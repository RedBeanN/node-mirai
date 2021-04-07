const util = require('util');
const WebSocket = require('ws');

const Signal = require('./src/utils/Signal');

const MessageComponent = require('./src/MessageComponent');
const Target = require('./src/target');
const events = require('./src/events.json');

const { Plain } = MessageComponent;

const init = require('./src/init');
const verify = require('./src/verify');
const release = require('./src/release');
const fetchMessage = require('./src/fetchMessage');
const recall = require('./src/recall');

const {
  sendFriendMessage,
  sendGroupMessage,
  sendTempMessage,
  sendQuotedFriendMessage,
  sendQuotedGroupMessage,
  sendQuotedTempMessage,
  uploadImage,
  uploadVoice,
  sendImageMessage,
  sendVoiceMessage,
  sendFlashImageMessage
} = require('./src/sendMessage');

const {
  getFriendList,
  getGroupList,
  getMessageById,
  registerCommand,
  sendCommand,
  getManagers,
  botInvitedJoinGroupRequestHandler,
  quitGroup,
  handleNewFriendRequest
} = require('./src/manage');

const group = require('./src/group');

const {
  uploadFileAndSend,
  getGroupFileList,
  getGroupFileInfo,
  renameGroupFile,
  moveGroupFile,
  deleteGroupFile
} = require('./src/fileUtility');

/**
 * @typedef { Object } MessageChain 消息链
 * @description 消息链对象, node-mirai-sdk 提供各类型的 .value() 方法获得各自的属性值
 * @property { string } type 消息类型
 * @property { number } [id] Source 类型中的消息 id, 或Quote类型中引用的源消息的 id
 * @property { number } [time] Source 类型中的时间戳
 * @property { number } [groupId] Quote 类型中源消息所在群的群号, 好友消息时为 0
 * @property { number } [senderId] Quote 类型中源消息发送者的 qq 号
 * @property { object } [origin] Quote 类型中源消息的 MessageChain
 * @property { string } [text] Plain 类型的文本
 * @property { number } [target] At 类型中 @ 目标的 qq 号
 * @property { string } [display] At 类型中 @ 目标的群名片
 * @property { number } [faceId] Face 类型中表情的编号
 * @property { string } [imageId] Image 类型中图片的 imageId
 * @property { string } [url] Image 类型中图片的 url, 可用于下载图片
 * @property { string } [xml] Xml 类型中的 xml 字符串
 * @property { string } [json] Json 类型中的 json 字符串
 * @property { string } [content] App 类型中的 app content 字符串
 */
/**
 * @typedef { Object } message 消息
 * @property { "FriendMessage"|"GroupMessage" } messageType 消息类型
 * @property { MessageChain[] } messageChain 消息链对象
 * @property { Sender } sender 发送者
 * @property { function } reply 快速回复消息
 * @property { function } quoteReply 快速引用回复消息
 * @property { function } recall 撤回本条消息
 */

/**
 * Class NodeMirai
 */
class NodeMirai {
  /**
   * Create a NodeMirai bot
   * @param { object } options
   * @param { string } options.host http-api 服务的地址
   * @param { string } options.authKey http-api 服务的 authKey
   * @param { number } options.qq bot 的 qq 号
   * @param { boolean } [options.enableWebsocket] 使用 ws 来获取消息和事件推送
   * @param { number } [options.interval] 拉取消息的周期(ms), 默认为200
   */
  constructor ({
    host,
    authKey,
    qq,
    enableWebsocket = false,
    interval = 200,
  }) {
    this.host = host;
    this.authKey = authKey;
    this.qq = qq;
    this.interval = interval;
    this.signal = new Signal();
    this.eventListeners = {
      message: [],
    };
    for (let event in events) {
      this.eventListeners[events[event]] = [];
    }
    this.types = [];
    this.enableWebsocket = enableWebsocket;
    this.plugins = [];
    this.auth();
  }

  /**
   * Bot 认证, 获取 sessionKey
   */
  auth () {
    init(this.host, this.authKey).then(data => {
      const { code, session } = data;
      if (code !== 0) {
        console.error('Failed @ auth: Invalid auth key');
        // process.exit(1);
        return { code, session };
      }
      this.sessionKey = session;
      this.signal.trigger('authed');
      this.startListeningEvents();
      return { code, session };
    }).catch(() => {
      console.error('Failed @ auth: Invalid host');
      // process.exit(1);
      return {
        code: 2,
        msg: 'Invalid host',
      };
    });
  }

  /**
   * 校验 sessionKey, 必须在 authed 事件后进行
   */
  async verify () {
    return verify(this.host, this.sessionKey, this.qq).then(({ code, msg}) => {
      if (code !== 0) {
        console.error('Failed @ verify: Invalid session key');
        // process.exit(1);
        return { code, msg };
      }
      this.signal.trigger('verified');
      return { code, msg };
    });
  }

  /**
   * 释放 sessionKey
   */
  async release () {
    return release(this.host, this.sessionKey, this.qq).then(({ code, msg }) => {
      if (code !== 0) {
        console.error('Failed @ release: Invalid session key');
        return { code, msg };
      }
      this.signal.trigger('released');
      return { code, msg };
    });
  }

  async fetchMessage (count = 10) {
    return fetchMessage(this.host, this.sessionKey, count).catch(e => {
      console.error('Unknown error @ fetchMessage:', e.message);
      return [];
      // process.exit(1);
    });
  }

  /**
   * @method NodeMirai#sendFriendMessage
   * @description 发送好友消息
   * @async
   * @param { MessageChain[] } MessageChain MessageChain 数组
   * @param { number } qq 发送对象的 qq 号
   * @return { object } {
   *  code: 0,
   *  msg: "success",
   *  messageId: 123456
   * }
   */
  async sendFriendMessage (messageChain, qq) {
    return sendFriendMessage({
      messageChain: messageChain,
      target: qq,
      sessionKey: this.sessionKey,
      host: this.host,
    });
  }
  /**
   * @method NodeMirai#sendGroupMessage
   * @description 发送群组消息
   * @async
   * @param { MessageChain[] } MessageChain MessageChain 数组
   * @param { number } qq 发送群组的群号
   * @return { object } {
   *  code: 0,
   *  msg: "success",
   *  messageId: 123456
   * }
   */
  async sendGroupMessage (message, target) {
    return sendGroupMessage({
      messageChain: message,
      target,
      sessionKey: this.sessionKey,
      host: this.host,
    });
  }
  /**
   * @method NodeMirai#sendTempMessage
   * @description 发送临时消息
   * @async
   * @param { MessageChain[] } MessageChain MessageChain 数组
   * @param { number } qq 临时消息发送对象 QQ 号
   * @param { number } group 所在群号
   * @return { object } {
   *  code: 0,
   *  msg: "success",
   *  messageId: 123456
   * }
   */
  async sendTempMessage (message, qq, group) {
    // 兼容旧格式：高 32 位为群号，低 32 位为 QQ 号
    if (!group)
      return sendTempMessage({
        messageChain: message,
        qq: (qq & 0xFFFFFFFF),
        group: ((qq >> 32) & 0xFFFFFFFF),
        sessionKey: this.sessionKey,
        host: this.host,
      });
    else
      return sendTempMessage({
        messageChain: message,
        qq,
        group,
        sessionKey: this.sessionKey,
        host: this.host,
      });
  }
  /**
   * @method NodeMirai#sendImageMessage
   * @async
   * @param { string | Buffer | ReadStream } url 图片所在路径
   * @param { message } target 发送目标对象
   * @return { object } {
   *  code: 0,
   *  msg: "success",
   *  messageId: 123456
   * }
   */
  async sendImageMessage (url, target) {
    switch (target.type) {
      case 'FriendMessage':
        return sendImageMessage({
          url,
          qq: target.sender.id,
          sessionKey: this.sessionKey,
          host: this.host,
        });
      case 'GroupMessage':
        return sendImageMessage({
          url,
          group: target.sender.group.id,
          sessionKey: this.sessionKey,
          host: this.host,
        });
      default:
        console.error('Error @ sendImageMessage: unknown target type');
    }
  }
  /**
   * @method NodeMirai#sendVoiceMessage
   * @async
   * @param { string | Buffer | ReadStream } url 语音所在路径
   * @param { target } group 发送目标对象（目前仅支持群组）
   * @return { object } {
   *  code: 0,
   *  msg: "success",
   *  messageId: 123456
   * }
   */
  async sendVoiceMessage (url, target) {
    if (target.type !== 'GroupMessage')
      console.error('Error @ sendVoiceMessage: only support send voice to group');

    return sendVoiceMessage({
      url,
      group: target.sender.group.id,
      sessionKey: this.sessionKey,
      host: this.host
    });
  }

  /**
   * @method NodeMirai#sendFlashImageMessage
   * @async
   * @param { string | Buffer | ReadStream } url 图片所在路径
   * @param { message } target 发送目标对象
   * @return { object } {
   *  code: 0,
   *  msg: "success",
   *  messageId: 123456
   * }
   */
  async sendFlashImageMessage (url, target) {
    switch (target.type) {
      case 'FriendMessage':
        return sendFlashImageMessage({
          url,
          qq: target.sender.id,
          sessionKey: this.sessionKey,
          host: this.host,
        });
      case 'GroupMessage':
        return sendFlashImageMessage({
          url,
          group: target.sender.group.id,
          sessionKey: this.sessionKey,
          host: this.host,
        });
      default:
        console.error('Error @ sendFlashImageMessage: unknown target type');
    }
  }
  /**
   * @method NodeMirai#uploadImage
   * @async
   * @param { string | Buffer | ReadStream } url 图片所在路径
   * @param { message } target 发送目标对象
   * @returns { object } {
   *  imageId: "{XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX}.jpg",
   *  url: "xxxxxxxxxxxxxxxxxxxx"
   * }
   */
  async uploadImage (url, target) {
    let type;
    switch (target.type) {
      case 'FriendMessage':
        type = 'friend';
        break;
      case 'GroupMessage':
        type = 'group';
        break;
      case 'TempMessage':
        type = 'temp';
        break;
      default:
        console.error('Error @ uploadImage: unknown target type');
    }
    return uploadImage({
      url,
      type,
      sessionKey: this.sessionKey,
      host: this.host,
    });
  }


  /**
   * @method NodeMirai#uploadVoice
   * @async
   * @param { string | Buffer | ReadStream } url 声音所在路径
   * @returns { object } {
   *  voiceId: "{XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX}.amr",
   *  url: "xxxxxxxxxxxxxxxxxxxx"
   * }
   */
  async uploadVoice (url) {
    return uploadVoice({
      url,
      type: 'group',
      sessionKey: this.sessionKey,
      host: this.host
    });
  }

  /**
   * @method NodeMirai#sendMessage
   * @description 发送消息给指定好友或群组
   * @async
   * @param { MessageChain[]|string } message 要发送的消息
   * @param { message } target 发送目标对象
   */
  async sendMessage (message, target) {
    switch (target.type) {
      case 'FriendMessage':
        return this.sendFriendMessage(message, target.sender.id);
      case 'GroupMessage':
        return this.sendGroupMessage(message, target.sender.group.id);
      case 'TempMessage':
        return this.sendTempMessage(message, target.sender.id, target.sender.group.id);
      default:
        console.error('Invalid target @ sendMessage');
    }
  }

  /**
   * @method NodeMirai#sendQuotedFriendMessage
   * @description 发送带引用的好友消息
   * @async
   * @param { MessageChain[] } MessageChain MessageChain 数组
   * @param { number } qq 发送对象的 qq 号
   * @param { number } quote 引用的 Message 的 id
   * @return { object } {
   *  code: 0,
   *  msg: "success",
   *  messageId: 123456
   * }
   */
  async sendQuotedFriendMessage (message, qq, quote) {
    return sendQuotedFriendMessage({
      messageChain: message,
      qq,
      quote,
      sessionKey: this.sessionKey,
      host: this.host,
    });
  }
  /**
   * @method NodeMirai#sendQuotedGroupMessage
   * @description 发送带引用的群组消息
   * @async
   * @param { MessageChain[] } MessageChain MessageChain 数组
   * @param { number } qq 发送群组的群号
   * @param { number} quote 引用的 Message 的 id
   * @return { object } {
   *  code: 0,
   *  msg: "success",
   *  messageId: 123456
   * }
   */
  async sendQuotedGroupMessage (message, target, quote) {
    return sendQuotedGroupMessage({
      messageChain: message,
      target, quote,
      sessionKey: this.sessionKey,
      host: this.host,
    });
  }
  /**
   * @method NodeMirai#sendQuotedTempMessage
   * @description 发送带引用的临时消息
   * @async
   * @param { MessageChain[] } MessageChain MessageChain 数组
   * @param { number } qq 临时消息发送对象 QQ 号
   * @param { number } group 所在群号
   * @param { number} quote 引用的 Message 的 id
   * @return { object } {
   *  code: 0,
   *  msg: "success",
   *  messageId: 123456
   * }
   */
  async sendQuotedTempMessage (message, qq, group, quote) {
    // 兼容旧格式：高 32 位为群号，低 32 位为 QQ 号
    // 若使用旧 API 格式，则 group 位置的值实为 quote
    if (!quote)
      return sendQuotedTempMessage({
        messageChain: message,
        qq: (qq & 0xFFFFFFFF),
        group: ((qq >> 32) & 0xFFFFFFFF),
        quote: group,
        sessionKey: this.sessionKey,
        host: this.host,
      });    
    else
      return sendQuotedTempMessage({
        messageChain: message,
        qq,
        group,
        quote,
        sessionKey: this.sessionKey,
        host: this.host,
      });
  }

  /**
   * @method NodeMirai#sendQuotedMessage
   * @description 发送引用消息
   * @async
   * @param { MessageChain[]|string } message 要发送的消息
   * @param { message } target 发送目标对象
   */
  async sendQuotedMessage (message, target) {
    try {
      let quote = target.messageChain[0].type === 'Source' ? target.messageChain[0].id : -1;
      if (quote < 0) throw new Error();
      // console.log(target.type, quote);
      switch (target.type) {
        case 'FriendMessage':
          return await this.sendQuotedFriendMessage(message, target.sender.id, quote);
        case 'GroupMessage':
          return await this.sendQuotedGroupMessage(message, target.sender.group.id, quote);
        case 'TempMessage':
          return await this.sendQuotedTempMessage(message, target.sender.id, target.sender.group.id, quote);
        default:
          console.error('Invalid target @ sendQuotedMessage');
          // process.exit(1);
      }
    } catch (e) {
      // 无法引用时退化到普通消息
      // console.log('Back to send message');

      /*
      2020.4.20 因 mirai 0.37.5 更新导致 sequenceId not yet available 错误，但消息正常发出，导致消息重复，在此修复
      https://github.com/mamoe/mirai-api-http/issues/66
       */
      // return this.sendMessage(message, target);
      console.error('Invalid target @ sendQuotedMessage');
    }
  }

  /**
   * @method NodeMirai#reply
   * @description 回复一条消息, sendMessage 的别名方法
   * @param { MessageChain[]|string } replyMsg 回复的内容
   * @param { message } srcMsg 源消息
   * @param { boolean } [quote] 是否引用源消息
   */
  reply (replyMsg, srcMsg, quote = false) {
    const replyMessage = typeof replyMsg === 'string' ? [Plain(replyMsg)] : replyMsg;
    if (quote) return this.sendQuotedMessage(replyMessage, srcMsg);
    return this.sendMessage(replyMessage, srcMsg);
  }
  /**
   * @method NodeMirai#quoteReply
   * @description 引用回复一条消息, sendQuotedMessage 的别名方法
   * @param { MessageChain[]|string } replyMsg 回复的内容
   * @param { message } srcMsg 源消息
   */
  quoteReply (replyMsg, srcMsg) {
    const replyMessage = typeof replyMsg === 'string' ? [Plain(replyMsg)] : replyMsg;
    return this.sendQuotedMessage(replyMessage, srcMsg);
  }

  /**
   * @method NodeMirai#recall
   * @description 撤回一条消息
   * @param { object|number } msg 要撤回的消息或消息 id
   */
  recall (msg) {
    try {
      const target = msg.messageId || (msg.messageChain && msg.messageChain[0] && msg.messageChain[0].id) || msg;
      return recall({
        target,
        sessionKey: this.sessionKey,
        host: this.host,
      });
    } catch (e) {
      console.error('Error @ recall', e.message);
    }
  }

  /**
   * @method NodeMirai#getFriendList
   * @description 获取 bot 的好友列表
   * @async
   * @returns { Friend[] }
   */
  getFriendList () {
    return getFriendList({
      host: this.host,
      sessionKey: this.sessionKey,
    });
  }
  /**
   * @method NodeMirai#getGroupList
   * @description 获取 bot 的群组列表
   * @async
   * @returns { Group[] }
   */
  getGroupList () {
    return getGroupList({
      host: this.host,
      sessionKey: this.sessionKey,
    });
  }
  /**
   * @method NodeMirai#getMessageById
   * @description 根据消息 id 获取消息内容
   * @async
   * @param { number } messageId 指定的消息 id
   * @return { message }
   */
  getMessageById (messageId) {
    return getMessageById({
      messageId,
      host: this.host,
      sessionKey: this.sessionKey,
    });
  }

  /**
   * @method NodeMirai#getGroupMemberList
   * @description 获取指定群的成员名单
   * @async
   * @param { number } target 指定的群号
   */
  getGroupMemberList (target) {
    return group.getMemberList({
      target,
      host: this.host,
      sessionKey: this.sessionKey,
    });
  }
  /**
   * @method NodeMirai#setGroupMute
   * @description 禁言一位群员(需有相应权限)
   * @async
   * @param { number } target 群号
   * @param { number } memberId 群员的 qq 号
   * @param { number } time 禁言时间(秒)
   */
  setGroupMute (target, memberId, time = 600) {
    return group.setMute({
      target,
      memberId,
      time,
      host: this.host,
      sessionKey: this.sessionKey,
    });
  }
  /**
   * @method NodeMirai#setGroupUnmute
   * @description 解除一位群员的禁言状态
   * @async
   * @param { number } target 群号
   * @param { number } memberId 群员的 qq 号
   */
  setGroupUnmute (target, memberId) {
    return group.setUnmute({
      target,
      memberId,
      host: this.host,
      sessionKey: this.sessionKey,
    });
  }
  /**
   * @method NodeMirai#setGroupMuteAll
   * @description 设置全体禁言
   * @async
   * @param { number } target 群号
   */
  setGroupMuteAll (target) {
    return group.setMuteAll({
      target,
      host: this.host,
      sessionKey: this.sessionKey,
    });
  }
  /**
   * @method NodeMirai#setGroupUnmuteAll
   * @description 解除全体禁言
   * @async
   * @param { number } target 群号
   */
  setGroupUnmuteAll (target) {
    return group.setUnmuteAll({
      target,
      host: this.host,
      sessionKey: this.sessionKey,
    });
  }
  /**
   * @method NodeMirai#setGroupKick
   * @description 移除群成员
   * @async
   * @param { number } target 群号
   * @param { number } memberId 群员的 qq 号
   * @param { string } msg 信息
   */
  setGroupKick (target, memberId, msg = '您已被移出群聊') {
    return group.setKick({
      target,
      memberId,
      msg,
      host: this.host,
      sessionKey: this.sessionKey,
    });
  }
  /**
   * @method NodeMirai#setGroupConfig
   * @description 修改群设置
   * @async
   * @param { number } target 群号
   * @param { object } config 设置
   */
  setGroupConfig (target, config) {
    return group.setConfig({
      target,
      config,
      host: this.host,
      sessionKey: this.sessionKey,
    });
  }
  /**
   * @method NodeMirai#setEssence
   * @description 设置群精华消息
   * @param { number | string | message } target 要设置的群
   * @param { number } id 精华消息 ID
   */
  setEssence(target, id) {
    const { host, sessionKey } = this;
    const realTarget = (typeof target === 'number') || (typeof target === 'string')
      ? target
      : target.sender.group.id;
    return group.setEssence({
      target: realTarget,
      id,
      host,
      sessionKey
    });
  }
  /**
   * @method NodeMirai#getGroupConfig
   * @description 获取群设置
   * @async
   * @param { number } target 群号
   */
  getGroupConfig (target) {
    return group.getConfig({
      target,
      host: this.host,
      sessionKey: this.sessionKey,
    });
  }
  /**
   * @method NodeMirai#setGroupMemberInfo
   * @description 设置群成员信息
   * @param { number } target 群号
   * @param { number } memberId 群员 qq 号
   * @param { object } info 信息
   */
  setGroupMemberInfo (target, memberId, info) {
    return group.setMemberInfo({
      target,
      memberId,
      info,
      host: this.host,
      sessionKey: this.sessionKey,
    });
  }
  /**
   * @method NodeMirai#getGroupMemberInfo
   * @description 获取群成员信息
   * @param { number } target 群号
   * @param { number } memberId 群员 qq 号
   */
  getGroupMemberInfo (target, memberId) {
    return group.getMemberInfo({
      target,
      memberId,
      host: this.host,
      sessionKey: this.sessionKey,
    });
  }

  /**
   * @method NodeMirai#quit
   * @description BOT 主动离群
   * @param { number } target 要离开的群的群号
   * @returns {Promise<*>}
   */
  quit(target) {
    return quitGroup({
      host: this.host,
      sessionKey: this.sessionKey,
      target
    });
  }
  
  /**
   * @method NodeMirai#handleMemberJoinRequest
   * @description 处理用户入群申请
   * @param { number } eventId 入群事件 (memberJoinRequest) ID
   * @param { number } fromId 申请入群人 QQ 号
   * @param { number } groupId 申请入群群号
   * @param { number } operate 响应操作，0同意，1拒绝，2忽略，3拒绝并拉黑，4忽略并拉黑
   * @param { string } message 回复的消息
   */
  handleMemberJoinRequest (eventId, fromId, groupId, operate, message = "") {
    return group.handleMemberJoinRequest({
      eventId,
      fromId,
      groupId,
      operate,
      message,
      host: this.host,
      sessionKey: this.sessionKey,
    });
  }

  /**
   * @method NodeMirai#handleBotInvitedJoinGroupRequest
   * @description 处理 BOT 被邀请入群的申请
   * @param { number } eventId 被邀请入群事件 (botInvitedJoinGroupRequest) ID
   * @param { number } fromId  邀请人群者的 QQ 号
   * @param { number } groupId 被邀请进入群的群号
   * @param { number } operate 响应的操作类型, 0同意邀请，1拒绝邀请
   * @param { string } message 回复的信息
   * @returns {Promise<*>}
   */
  handleBotInvitedJoinGroupRequest(eventId, fromId, groupId, operate, message = "") {
    // 由于方法是单独引入的，所以使用 [event]Handler 而不是 handle[Event] 作为函数名
    return botInvitedJoinGroupRequestHandler({
      eventId,
      fromId,
      groupId,
      operate,
      message,
      host: this.host,
      sessionKey: this.sessionKey
    });
  }

  /**
   * @method NodeMirai#handleNewFriendRequest
   * @description 处理好友申请
   * @param { number } eventId 好友申请事件 (newFriendRequest) ID
   * @param { number } fromId 申请人 QQ 号
   * @param { number } groupId 申请人如果通过某个群添加好友，该项为该群群号；否则为0
   * @param { number } operate 响应操作，0同意，1拒绝，2拒绝并拉黑
   * @param { string } message 回复的消息
   * @returns {Promise<*>}
   */
  handleNewFriendRequest (eventId, fromId, groupId, operate, message = "") {
    return handleNewFriendRequest({
      eventId,
      fromId,
      groupId,
      operate,
      message,
      host: this.host,
      sessionKey: this.sessionKey,
    });
  }

  /**
   * @method NodeMirai#uploadFileAndSend
   * @description 上传（群）文件并发送
   * @param { string | Buffer | ReadStream } url 文件所在路径或 URL
   * @param { string } path 文件要上传到群文件中的位置（路径）
   * @param { message } target 要发送文件的目标
   */
  uploadFileAndSend(url, path, target) {
    const { sessionKey, host } = this;
    const realTarget = (typeof target === 'number') || (typeof target === 'string')
      ? target
      : target.sender.group.id;
    return uploadFileAndSend({
      url,
      path,
      target: realTarget,
      sessionKey,
      host
    });
  }

  
  /**
   * @method NodeMirai#getGroupFileList
   * @description 获取群文件指定路径下的文件列表
   * @param { string } dir 要获取的群文件路径
   * @param { number | string | message } target 要获取的群号
   * @returns { object }
   */
  getGroupFileList(dir, target) {
    const { sessionKey, host } = this;
    const realTarget = (typeof target === 'number') || (typeof target === 'string')
      ? target
      : target.sender.group.id;
    return getGroupFileList({
      target: realTarget,
      dir,
      sessionKey,
      host
    });
  }

  /**
   * @method NodeMirai#getGroupFileInfo
   * @description 获取群文件指定详细信息
   * @param { string } id 文件唯一 ID
   * @param { number | string | message } target 要获取的群号
   * @returns { object }
   */
  getGroupFileInfo(id, target) {
    const { sessionKey, host } = this;
    const realTarget = (typeof target === 'number') || (typeof target === 'string')
      ? target
      : target.sender.group.id;
    return getGroupFileInfo({
      target: realTarget,
      id,
      sessionKey,
      host
    });
  }

  /**
   * @method NodeMirai#renameGroupFile
   * @description 重命名指定群文件
   * @param { string } id 要重命名的文件唯一 ID 
   * @param { string } rename 文件的新名称
   * @param { number | string } target 目标群号
   * @returns { object }
   */
  renameGroupFile(id, rename, target) {
    const { sessionKey, host } = this;
    const realTarget = (typeof target === 'number') || (typeof target === 'string')
      ? target
      : target.sender.group.id;
    return renameGroupFile({
      target: realTarget,
      id,
      rename,
      sessionKey,
      host
    });
  }

  /**
   * @method NodeMirai#moveGroupFile
   * @description 移动指定群文件
   * @param { string } id 要移动的文件唯一 ID 
   * @param { string } movePath 文件的新路径
   * @param { number | string } target 目标群号
   * @returns { object }
   */
  moveGroupFile(id, movePath, target) {
    const { sessionKey, host } = this;
    const realTarget = (typeof target === 'number') || (typeof target === 'string')
      ? target
      : target.sender.group.id;
    return moveGroupFile({
      target: realTarget,
      id,
      movePath,
      sessionKey,
      host
    });
  }

  /**
   * 删除指定群文件
   * @param { string } id 要删除的文件唯一 ID
   * @param { number | string } target 目标群号
   * @returns { object }
   */
  deleteGroupFile(id, target) {
    const { sessionKey, host } = this;
    const realTarget = (typeof target === 'number') || (typeof target === 'string')
      ? target
      : target.sender.group.id;
    return deleteGroupFile({
      target: realTarget,
      id,
      sessionKey,
      host
    });
  }

  getManagers () {
    return getManagers({
      host: this.host,
      authKey: this.authKey,
      qq: this.qq,
    });
  }

  getManager () {
    return util.deprecate(this.getManagers, 'NodeMirai#getManager is deprecated, use getManagers instead');
  }

  // command
  /**
   * @method NodeMirai#registerCommand
   * @async
   * @param { Object } command 注册的 command 对象
   * @param { string } command.name
   * @param { string[] } command.alias
   * @param { string } command.description
   * @param { string } command.usage
   */
  registerCommand (command) {
    return registerCommand(Object.assign({
      host: this.host,
      authKey: this.authKey,
    }, command));
  }
  /**
   * @method NodeMirai#sendCommand
   * @async
   * @param { Object } command 发送的 command 对象
   * @param { string } command.name
   * @param { string[] } command.args
   */
  sendCommand (command) {
    return sendCommand(Object.assign({
      host: this.host,
      authKey: this.authKey,
    }, command));
  }

  /**
   * @callback messageCallback
   * @param { message } message
   */
  /**
   * @callback signalCallback
   */
  /**
   * @callback eventCallback
   * @param { object } message
   */

  // event listener
  /**
   * @method NodeMirai#on
   * @description 事件监听
   * @param { string } name 事件名
   * @param { messageCallback|signalCallback|eventCallback } callback 回调
   */
  on (name, callback) {
    if (name === 'message') return this.onMessage(callback);
    else if (name === 'command') return this.onCommand(callback);
    else if (name in this.signal.signalList) return this.onSignal(name, callback);
    return this.onEvent(name, callback);
  }
  /**
   * @method NodeMirai#onSignal
   * @description 订阅 authed, verified, 或 released 信号
   * @param { "authed"|"verified"|"released" } signalName 信号
   * @param { signalCallback } callback 回调
   */
  onSignal (signalName, callback) {
    return this.signal.on(signalName, callback);
  }
  /**
   * @method NodeMirai#onMessage
   * @description 订阅消息事件
   * @param { messageCallback } callback 回调
   */
  onMessage (callback) {
    this.eventListeners.message.push(callback);
  }
  /**
   * @method NodeMirai#onEvent
   * @description 订阅事件
   * @param { string } event 事件名
   * @param { eventCallback } callback 事件回调
   */
  onEvent (event, callback) {
    if (!this.eventListeners[event]) this.eventListeners[event] = [];
    this.eventListeners[event].push(callback);
  }
  onCommand (callback) {
    const ws = new WebSocket(`${this.host.replace('http', 'ws')}/command?authKey=${this.authKey}`);
    ws.on('message', message => {
      callback(JSON.parse(message));
    });
  }

  /**
   * @method NodeMirai#listen
   * @description 启动事件监听
   * @param { "all"|"friend"|"group" } type 类型
   */
  listen (type = 'all') {
    this.types = [];
    switch (type) {
      case 'group': this.types.push('GroupMessage'); break;
      case 'friend': this.types.push('FriendMessage'); break;
      case 'temp': this.types.push('TempMessage'); break;
      case 'all': this.types.push('FriendMessage', 'GroupMessage', 'TempMessage'); break;
      default:
        console.error('Invalid listen type. Type should be "all", "friend", "group" or "temp"');
        // process.exit(1);
    }
  }
  startListeningEvents () {
    if (this.isEventListeningStarted) return;
    this.isEventListeningStarted = true;
    if (this.enableWebsocket) {
      this.onSignal('verified', () => {
        const wsHost = `${this.host.replace('http', 'ws')}/all?sessionKey=${this.sessionKey}`;
        (new WebSocket(wsHost)).on('message', message => {
          this.emitEventListener(JSON.parse(message));
        })
      });
    }
    else setInterval(async () => {
      const messages = await this.fetchMessage(10);
      if (messages.length) {
        messages.forEach(message => {
          return this.emitEventListener(message);
        });
      } else if (messages.code) {
        console.error(`Error @ fetchMessage:\n\tCode: ${messages.code}\n\tMessage: ${messages.message || messages.msg || messages}`);
      }
    }, this.interval);
  }
  emitEventListener (message) {
    if (this.types.includes(message.type)) {
      message.reply = msg => this.reply(msg, message);
      message.quoteReply = msg => this.quoteReply(msg, message);
      message.recall = () => this.recall(message);
      for (let listener of this.eventListeners.message) {
        listener(message, this);
      }
    }
    else if (message.type in events) {
      for (let listener of this.eventListeners[events[message.type]]) {
        listener(message, this);
      }
    }
  }

  // plugins
  // 这个插件系统需要大量改进
  getPlugins () {
    return this.plugins.map(i => i.name);
  }
  /**
   * @method NodeMirai#use
   * @description install plugin
   * @param { object } plugin plugin config
   * @param { string } plugin.name unique plugin name
   * @param { string } [plugin.subscribe] subscribe event name
   * @param { function } plugin.callback callback function
   */
  use (plugin) {
    if (!plugin.name || typeof plugin.name !== 'string' || plugin.name.length === 0) throw new Error(`[NodeMirai] Invalid plugin name ${plugin.name}. Plugin name must be a string.`);
    if (!plugin.callback || typeof plugin.callback !== 'function') throw new Error('[NodeMirai] Invalid plugin callback. Plugin callback must be a function.');
    if (this.getPlugins().includes(plugin.name)) throw new Error(`[NodeMirai] Duplicate plugin name ${plugin.name}`);
    this.plugins.push(plugin);
    // TODO: support string[]
    const event = typeof plugin.subscribe === 'string' ? plugin.subscribe : 'message';
    this.on(event, plugin.callback);
    console.log(`[NodeMirai] Installed plugin [ ${plugin.name} ]`);
  }
  remove (pluginName) {
    const pluginNames = this.getPlugins();
    if (pluginNames.includes(pluginName)) {
      const plugin = this.plugins[pluginNames.indexOf(pluginName)];
      for (let event in this.eventListeners) {
        for (let i in this.eventListeners[event]) {
          if (this.eventListeners.message[i] === plugin.callback) {
            this.eventListeners.message.splice(i, 1);
            console.log(`[NodeMirai] Uninstalled plugin [ ${plugin.name} ]`);
          }
        }
      }
    }
  }
}

NodeMirai.MessageComponent = MessageComponent;
NodeMirai.Target = Target;

module.exports = NodeMirai;
