const util = require('util');
/**
 * @type { import('./src/typedef').WebSocket }
 */
const WebSocket = require('ws');
const semver = require('semver');
const { default: axios } = require('axios');

const Signal = require('./src/utils/Signal');
const checkMAHVersion = require('./src/utils/checkMAHVersion');

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
  sendFlashImageMessage,
  sendNudge,
} = require('./src/sendMessage');
const ws = require('./src/ws');

const {
  getFriendList,
  getGroupList,
  getBotProfile,
  getFriendProfile,
  getMemberProfile,
  getMessageById,
  registerCommand,
  sendCommand,
  getManagers,
  botInvitedJoinGroupRequestHandler,
  quitGroup,
  handleNewFriendRequest,
  deleteFriend,
  getRoamingMessages,
} = require('./src/manage');

const group = require('./src/group');

const {
  uploadFileAndSend,
  getGroupFileList,
  getGroupFileInfo,
  renameGroupFile,
  moveGroupFile,
  deleteGroupFile,
  makeDir,
} = require('./src/fileUtility');

/**
 * @typedef MessageResponse
 * @property { number } code
 * @property { string } msg
 * @property { number } messageId
 * @property { () => Promise<httpApiResponse> } recall
 *
 * @typedef { Promise<MessageResponse> } RecallableMessage
 */
/**
 * @typedef { import('./src/typedef').Buffer } Buffer
 * @typedef { import('./src/typedef').ReadStream } ReadStream
 * @typedef { import('./src/typedef').httpApiResponse } httpApiResponse
 * @typedef { import('./src/typedef').MessageChain } MessageChain
 * @typedef { import('./src/typedef').message } message
 * @typedef { import('./src/typedef').UserInfo } UserInfo
 * @typedef { import('./src/typedef').GroupMember } GroupMember
 * @typedef { import('./src/typedef').Friend } Friend
 * @typedef { import('./src/typedef').GroupPermissionInfo } GroupPermissionInfo
 * @typedef { import('./src/typedef').GroupInfo } GroupInfo
 * @typedef { import('./src/typedef').GroupFile } GroupFile
 * @typedef { import('./src/target').MessageTarget } MessageTarget
 * @typedef { import('./src/target').GroupTarget } GroupTarget
 * @typedef { import('./src/events').EventMap } EventMap
 * @typedef { import('./src/events').AllEventMap } AllEventMap
 */
/**
 * @namespace NodeMirai
 */
class NodeMirai {
  static MessageComponent = MessageComponent
  static Target = Target
  /**
   * @typedef { Object } BotConfig
   * @property { string } host http-api 服务的地址
   * @property { string } verifyKey http-api 服务的verifyKey
   * @property { number } qq bot 的 qq 号
   * @property { boolean } [enableWebsocket] 使用 ws 来获取消息和事件推送
   * @property { boolean } [wsOnly] 完全使用 ws 来收发消息，为 true 时覆盖 enableWebsocket 且无需调用 verify
   * @property { number } [syncId] wsOnly 模式下用于标记 server 主动推送的消息
   * @property { number } [interval] 拉取消息的周期(ms), 默认为200
   * @property { string } [authKey] (Deprecated) http-api 1.x 版本的authKey
   */
  /**
   * Create a NodeMirai bot
   * @constructor
   * @param { BotConfig } config bot config
   * @param { string } config.host http-api 服务的地址
   * @param { string } config.verifyKey http-api 服务的verifyKey
   * @param { number } config.qq bot 的 qq 号
   * @param { boolean } [config.enableWebsocket] 使用 ws 来获取消息和事件推送
   * @param { boolean } [config.wsOnly] 完全使用 ws 来收发消息，为 true 时覆盖 enableWebsocket 且无需调用 verify
   * @param { number } [config.syncId] wsOnly 模式下用于标记 server 主动推送的消息
   * @param { number } [config.interval] 拉取消息的周期(ms), 默认为200
   * @param { string } [config.authKey] (Deprecated) http-api 1.x 版本的authKey
   */
  constructor ({
    host,
    verifyKey,
    qq,
    enableWebsocket = false,
    wsOnly = false,
    syncId = -1,
    interval = 200,
    authKey,
  }) {
    this.host = host;
    // support 1.x authKey
    this.verifyKey = verifyKey || authKey;
    this.qq = qq;
    this.interval = interval;
    this.signal = new Signal();
    this.eventListeners = {
      message: [],
    };
    for (let event in events) {
      this.eventListeners[events[event]] = [];
    }
    /**
     * @type { string[] }
     */
    this.types = [];

    this.wsOnly = wsOnly;
    this.syncId = syncId;
    this.enableWebsocket = wsOnly || enableWebsocket;
    /**
     * @type { WebSocket | null }
     */
    this.wsHost = null;
    this.plugins = [];
    this._is_mah_v1_ = false;
    this.mahVersion = '2.0.0';
    checkMAHVersion(this).then(isV1 => {
      this._is_mah_v1_ = isV1;
      this.auth();
    });
  }

  /**
   * @method getBotList
   * @returns { number[] }
   */
  async getBotList () {
    if (semver.lt(this.mahVersion, '2.6.0')) throw new Error('The getBotList API requires mah version >= 2.6.0');
    if (this.wsOnly) return ws.send({ command: 'botList' });
    return axios.get(`${this.host}/botList`).then(({ data }) => {
      if (data.code === 0) return data.data;
      return data;
    });
  }

  /**
   * @method auth
   * @description Bot 认证, 获取 sessionKey
   * @returns { Promise<httpApiResponse> }
   */
  async auth () {
    if (this.enableWebsocket && !this._is_mah_v1_) {
      this.wsHost = new WebSocket(`${this.host.replace('http', 'ws')}/all?verifyKey=${this.verifyKey}&qq=${this.qq}`);
      if (this.wsOnly) {
        // skip binding sessionKey
        this.signal.trigger('authed');
        this.signal.trigger('verified');
        this.startListeningEvents();
        ws.init(this.wsHost, this.syncId, this);
        return {
          code: 0,
          msg: 'authed',
        };
      }
    }
    return init(this.host, this.verifyKey, this._is_mah_v1_).then(data => {
      const { code, session } = data;
      if (code !== 0) {
        console.error('Failed @ auth: Invalid auth key');
        // process.exit(1);
        return { code, session };
      }
      /**
       * @type { string }
       */
      this.sessionKey = session;
      this.signal.trigger('authed');
      this.startListeningEvents();
      return { code, session };
    }).catch((code) => {
      console.error('init error with code', code);
      // console.error('Failed @ auth: Invalid host');
      // process.exit(1);
      return {
        code: 2,
        msg: 'Invalid host',
      };
    });
  }

  /**
   * @method verify
   * @description 校验 sessionKey, 必须在 authed 事件后进行
   * @returns { Promise<httpApiResponse> }
   */
  async verify () {
    if (this.wsOnly) return;
    return verify(this.host, this.sessionKey, this.qq, this._is_mah_v1_).then(({ code, msg }) => {
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
   * @method release
   * @description 释放 sessionKey
   * @returns { Promise<httpApiResponse> }
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

  /**
   * @method fetchMessage
   * @param { number } count
   * @returns { Promise<message[]> }
   */
  async fetchMessage (count = 10) {
    return fetchMessage(this.host, this.sessionKey, count).catch(e => {
      console.error('Unknown error @ fetchMessage:', e.message);
      return [];
      // process.exit(1);
    });
  }

  /**
   * @method getRoamingMessages
   * @description 获取漫游消息
   * @param { number } timeStart 起始时间, UTC+8 时间戳, 单位为秒. 可以为 0, 即表示从可以获取的最早的消息起. 负数将会被看是 0
   * @param { number } timeEnd 结束时间, 低于 `timeStart` 的值将会被看作是 `timeStart` 的值. 最大支持 `Number.MAX_SAFE_INTEGER`
   * @param { number } target 好友 qq, 目前仅支持好友消息漫游
   * @returns { message[] }
   */
  async getRoamingMessages (timeStart, timeEnd, target) {
    return getRoamingMessages({
      sessionKey: this.sessionKey,
      host: this.host,
      timeStart,
      timeEnd,
      target,
      wsOnly: this.wsOnly,
    });
  }

  /**
   * @method NodeMirai#sendFriendMessage
   * @description 发送好友消息
   * @param { string | MessageChain[] } messageChain MessageChain 数组
   * @param { number } target 发送对象的 qq 号
   * @returns { RecallableMessage }
   */
  async sendFriendMessage (messageChain, target) {
    return sendFriendMessage({ messageChain, target }, this);
  }
  /**
   * @method NodeMirai#sendGroupMessage
   * @description 发送群组消息
   * @param { string | MessageChain[] } messageChain MessageChain 数组
   * @param { number } group 发送群组的群号
   * @returns { RecallableMessage }
   */
  async sendGroupMessage (messageChain, group) {
    return sendGroupMessage({
      messageChain: messageChain,
      target: group,
    }, this);
  }
  /**
   * @method NodeMirai#sendTempMessage
   * @description 发送临时消息
   * @param { string | MessageChain[] } messageChain MessageChain 数组
   * @param { number } qq 临时消息发送对象 QQ 号
   * @param { number } group 所在群号
   * @returns { RecallableMessage }
   */
  async sendTempMessage (messageChain, qq, group) {
    // 兼容旧格式：高 32 位为群号，低 32 位为 QQ 号
    if (!group)
      return sendTempMessage({
        messageChain: messageChain,
        qq: (qq & 0xFFFFFFFF),
        group: ((qq >> 32) & 0xFFFFFFFF),
      }, this);
    else
      return sendTempMessage({
        messageChain: messageChain,
        qq,
        group,
      }, this);
  }
  /**
   * @method NodeMirai#sendImageMessage
   * @param { string | Buffer | ReadStream } url 图片所在路径
   * @param { message | MessageTarget } target 发送目标对象
   * @returns { RecallableMessage }
   */
  async sendImageMessage (url, target) {
    switch (target.type) {
      case 'FriendMessage':
        return sendImageMessage({
          url,
          qq: target.sender.id,
        }, this);
      case 'GroupMessage':
        return sendImageMessage({
          url,
          group: target.sender.group.id,
        }, this);
      default:
        console.error('Error @ sendImageMessage: unknown target type');
    }
  }
  /**
   * @method NodeMirai#sendVoiceMessage
   * @param { string | Buffer | ReadStream } url 语音所在路径
   * @param { GroupTarget } target 发送目标对象（目前仅支持群组）
   * @returns { RecallableMessage }
   */
  async sendVoiceMessage (url, target) {
    if (target.type !== 'GroupMessage')
      console.error('Error @ sendVoiceMessage: only support send voice to group');

    return sendVoiceMessage({
      url,
      group: target.sender.group.id,
    }, this);
  }

  /**
   * @method NodeMirai#sendFlashImageMessage
   * @param { string | Buffer | ReadStream } url 图片所在路径
   * @param { message | MessageTarget } target 发送目标对象
   * @returns { RecallableMessage }
   */
  async sendFlashImageMessage (url, target) {
    switch (target.type) {
      case 'FriendMessage':
        return sendFlashImageMessage({
          url,
          qq: target.sender.id,
        }, this);
      case 'GroupMessage':
        return sendFlashImageMessage({
          url,
          group: target.sender.group.id,
        }, this);
      default:
        console.error('Error @ sendFlashImageMessage: unknown target type');
    }
  }
  /**
   * @method NodeMirai#uploadImage
   * @param { string | Buffer | ReadStream } url 图片所在路径
   * @param { message | MessageTarget } target 发送目标对象
   * @returns {Promise<{
   *  imageId: string,
   *  url: string
   * }>}
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
    }, this);
  }


  /**
   * @method NodeMirai#uploadVoice
   * @param { string | Buffer | ReadStream } url 声音所在路径
   * @returns {Promise<{
   *  voiceId: string,
   *  url: string
   * }>}
   */
  async uploadVoice (url) {
    return uploadVoice({
      url,
      type: 'group',
    }, this);
  }

  /**
   * @method NodeMirai#sendMessage
   * @description 发送消息给指定好友或群组
   * @param { MessageChain[]|string } message 要发送的消息
   * @param { message | MessageTarget } target 发送目标对象
   * @returns { RecallableMessage }
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
   * @param { MessageChain[] } message MessageChain 数组
   * @param { number } target 发送对象的 qq 号
   * @param { number } quote 引用的 Message 的 id
   * @returns { RecallableMessage }
   */
  async sendQuotedFriendMessage (message, target, quote) {
    return sendQuotedFriendMessage({
      messageChain: message,
      target,
      quote,
    }, this);
  }
  /**
   * @method NodeMirai#sendQuotedGroupMessage
   * @description 发送带引用的群组消息
   * @param { MessageChain[] } message MessageChain 数组
   * @param { number } qq 发送群组的群号
   * @param { number} quote 引用的 Message 的 id
   * @returns { RecallableMessage }
   */
  async sendQuotedGroupMessage (message, target, quote) {
    return sendQuotedGroupMessage({
      messageChain: message,
      target, quote,
    }, this);
  }
  /**
   * @method NodeMirai#sendQuotedTempMessage
   * @description 发送带引用的临时消息
   * @param { MessageChain[] } message MessageChain 数组
   * @param { number } qq 临时消息发送对象 QQ 号
   * @param { number } group 所在群号
   * @param { number} quote 引用的 Message 的 id
   * @returns { RecallableMessage }
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
      }, this);    
    else
      return sendQuotedTempMessage({
        messageChain: message,
        qq,
        group,
        quote,
        sessionKey: this.sessionKey,
        host: this.host,
      }, this);
  }

  /**
   * @method NodeMirai#sendQuotedMessage
   * @description 发送引用消息
   * @param { MessageChain[]|string } message 要发送的消息
   * @param { message } target 发送目标对象
   * @returns { RecallableMessage }
   */
  async sendQuotedMessage (message, target) {
    let quote = target.messageChain[0].type === 'Source' ? target.messageChain[0].id : undefined;
    // messageId 可以是负数
    if (quote === undefined) throw new Error('Cannot get messageId from target');
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
  }

  /**
   * @method NodeMirai#sendNudge
   * @description 发送戳一戳消息, 未提供群号时为好友消息
   * @param { number } qq 好友或群员的QQ
   * @param { number } group 群号
   */
  async sendNudge (qq, group) {
    if (group) return sendNudge(Object.assign({}, this, { target: qq, subject: group, kind: 'Group' }))
    else {
      // TODO: Stranger is not supported. Expect returns an error if `qq` is not bot's friend
      return sendNudge(Object.assign({}, this, { target: qq, subject: qq, kind: 'Friend' }));
    }
  }

  /**
   * @method NodeMirai#reply
   * @description 回复一条消息, sendMessage 的别名方法
   * @param { MessageChain[]|string } replyMsg 回复的内容
   * @param { message | MessageTarget } srcMsg 源消息
   * @param { boolean } [quote] 是否引用源消息
   * @returns { RecallableMessage }
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
   * @param { message | MessageTarget } srcMsg 源消息
   * @returns { RecallableMessage }
   */
  quoteReply (replyMsg, srcMsg) {
    const replyMessage = typeof replyMsg === 'string' ? [Plain(replyMsg)] : replyMsg;
    return this.sendQuotedMessage(replyMessage, srcMsg);
  }

  /**
   * @method NodeMirai#recall
   * @description 撤回一条消息
   * @param { message|number } msg 要撤回的消息或消息 id
   * @param { number } [targetId] (mah >= v2.6.0)撤回消息为消息 id 时, 需提供好友 qq 或群号
   * @returns { Promise<httpApiResponse> }
   */
  async recall (msg, targetId) {
    let messageId = msg
    if (msg.messageId) messageId = msg.messageId
    if (msg.messageChain && msg.messageChain[0] && msg.messageChain[0].id) {
      messageId = msg.messageChain[0].id
    }
    if (typeof messageId !== 'number') throw new Error(`Cannot get messageId from ${msg}`)
    /**
     * API changed since mah v2.6.0
     * @see https://github.com/project-mirai/mirai-api-http/releases/tag/v2.6.0
     * @see https://github.com/project-mirai/mirai-api-http/commit/8ba96b5dd7362ef83bde9f210d43d319319bc896
     */
    if (semver.gte(this.mahVersion, '2.6.0')) {
      const target = msg.sender
        ? msg.sender.group
          ? msg.sender.group.id
          : msg.sender.id
        : targetId
      if (typeof target !== 'number') {
        throw new Error(`Cannot get targetId. Recall by messageId must also pass targetId since mah 2.6.0`)
      }
      return recall({
        target,
        messageId,
        sessionKey: this.sessionKey,
        host: this.host,
        wsOnly: this.wsOnly
      });
    } else {
      return recall({
        target: messageId,
        sessionKey: this.sessionKey,
        host: this.host,
        wsOnly: this.wsOnly,
      });
    }
  }

  /**
   * @method NodeMirai#getFriendList
   * @description 获取 bot 的好友列表
   * @returns { Promise<Friend[]> }
   */
  getFriendList () {
    return getFriendList({
      host: this.host,
      sessionKey: this.sessionKey,
      wsOnly: this.wsOnly,
    });
  }
  /**
   * @method NodeMirai#getGroupList
   * @description 获取 bot 的群组列表
   * @returns { Promise<GroupPermissionInfo[]> }
   */
  getGroupList () {
    return getGroupList({
      host: this.host,
      sessionKey: this.sessionKey,
      wsOnly: this.wsOnly,
    });
  }
  /**
   * @method NodeMirai#getBotProfile
   * @description 获取 bot 资料
   * @returns { Promise<UserInfo> }
   */
  getBotProfile () {
    return getBotProfile(this);
  }
  /**
   * @method NodeMirai#getFriendProfile
   * @param { number } qq 好友的 QQ 号
   * @returns { Promise<UserInfo> }
   */
  getFriendProfile (qq) {
    return getFriendProfile(Object.assign({}, this, { qq }));
  }
  /**
   * @method NodeMirai#getGroupMemberProfile
   * @description 获取群员的个人资料
   * @param { number } group 群号
   * @param { number } qq 群员的 QQ 号
   * @returns { Promise<UserInfo> }
   */
  getGroupMemberProfile (group, qq) {
    return getMemberProfile(Object.assign({}, this, { group, qq }));
  }
  /**
   * @method NodeMirai#getMessageById
   * @description 根据消息 id 获取消息内容
   * @param { number } messageId 指定的消息 id
   * @param { number } target 好友 QQ 或群号
   * @return { Promise<{ code: 0|5, data: message }> }
   */
  getMessageById (messageId, target) {
    return getMessageById(Object.assign({}, this, { messageId, target }));
  }

  /**
   * @method NodeMirai#getGroupMemberList
   * @description 获取指定群的成员名单
   * @param { number } target 指定的群号
   * @returns { Promise<GroupMember[]> }
   */
  getGroupMemberList (target) {
    return group.getMemberList(Object.assign({}, this, { target }));
  }
  /**
   * @method NodeMirai#setGroupMute
   * @description 禁言一位群员(需有相应权限)
   * @param { number } target 群号
   * @param { number } memberId 群员的 qq 号
   * @param { number } time 禁言时间(秒)
   * @returns { Promise<httpApiResponse> }
   */
  setGroupMute (target, memberId, time = 600) {
    return group.setMute(Object.assign({}, this, {
      target, memberId, time,
    }));
  }
  /**
   * @method NodeMirai#setGroupUnmute
   * @description 解除一位群员的禁言状态
   * @param { number } target 群号
   * @param { number } memberId 群员的 qq 号
   * @returns { Promise<httpApiResponse> }
   */
  setGroupUnmute (target, memberId) {
    return group.setUnmute(Object.assign({}, this, {
      target, memberId,
    }));
  }
  /**
   * @method NodeMirai#setGroupMuteAll
   * @description 设置全体禁言
   * @param { number } target 群号
   * @returns { Promise<httpApiResponse> }
   */
  setGroupMuteAll (target) {
    return group.setMuteAll(Object.assign({}, this, { target }));
  }
  /**
   * @method NodeMirai#setGroupUnmuteAll
   * @description 解除全体禁言
   * @param { number } target 群号
   * @returns { Promise<httpApiResponse> }
   */
  setGroupUnmuteAll (target) {
    return group.setUnmuteAll(Object.assign({}, this, { target }));
  }
  /**
   * @method NodeMirai#setGroupKick
   * @description 移除群成员
   * @param { number } target 群号
   * @param { number } memberId 群员的 qq 号
   * @param { string } msg 信息
   * @returns { Promise<httpApiResponse> }
   */
  setGroupKick (target, memberId, msg = '您已被移出群聊') {
    return group.setKick(Object.assign({}, this, {
      target, memberId, msg,
    }));
  }
  /**
   * @method NodeMirai#setGroupConfig
   * @description 修改群设置
   * @param { number } target 群号
   * @param { Partial<GroupInfo> } config 设置
   * @returns { Promise<httpApiResponse> }
   */
  setGroupConfig (target, config) {
    return group.setConfig(Object.assign({}, this, {
      target, config,
    }));
  }
  /**
   * @method NodeMirai#setEssence
   * @description 设置群精华消息
   * @param { number | string | GroupTarget } target 要设置的群
   * @param { number } id 精华消息 ID
   * @returns { Promise<httpApiResponse> }
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
      sessionKey,
      wsOnly: this.wsOnly,
    });
  }
  /**
   * @method NodeMirai#getGroupConfig
   * @description 获取群设置
   * @param { number } target 群号
   * @returns { Promise<GroupInfo> }
   */
  getGroupConfig (target) {
    return group.getConfig(Object.assign({}, this, target));
  }
  /**
   * @method NodeMirai#setGroupMemberInfo
   * @description 设置群成员信息
   * @param { number } target 群号
   * @param { number } memberId 群员 qq 号
   * @param { Partial<GroupMember> } info 信息
   * @returns { Promise<httpApiResponse> }
   */
  setGroupMemberInfo (target, memberId, info) {
    return group.setMemberInfo(Object.assign({}, this, {
      target, memberId, info,
    }));
  }
  /**
   * @method NodeMirai#getGroupMemberInfo
   * @description 获取群成员信息
   * @param { number } target 群号
   * @param { number } memberId 群员 qq 号
   * @returns { Promise<GroupMember> }
   */
  getGroupMemberInfo (target, memberId) {
    return group.getMemberInfo(Object.assign({}, this, {
      target, memberId,
    }));
  }

  /**
   * @method NodeMirai#quit
   * @description BOT 主动离群
   * @param { number } target 要离开的群的群号
   * @returns { Promise<httpApiResponse> }
   */
  quit(target) {
    return quitGroup(Object.assign({}, this, { target }));
  }
  
  /**
   * @method NodeMirai#handleMemberJoinRequest
   * @description 处理用户入群申请
   * @param { number } eventId 入群事件 (memberJoinRequest) ID
   * @param { number } fromId 申请入群人 QQ 号
   * @param { number } groupId 申请入群群号
   * @param { 0|1|2|3|4 } operate 响应操作，0同意，1拒绝，2忽略，3拒绝并拉黑，4忽略并拉黑
   * @param { string } message 回复的消息
   * @returns { Promise<httpApiResponse> }
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
      wsOnly: this.wsOnly,
    });
  }

  /**
   * @method NodeMirai#handleBotInvitedJoinGroupRequest
   * @description 处理 BOT 被邀请入群的申请
   * @param { number } eventId 被邀请入群事件 (botInvitedJoinGroupRequest) ID
   * @param { number } fromId  邀请人群者的 QQ 号
   * @param { number } groupId 被邀请进入群的群号
   * @param { 0|1 } operate 响应的操作类型, 0同意邀请，1拒绝邀请
   * @param { string } message 回复的信息
   * @returns { Promise<httpApiResponse> }
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
      sessionKey: this.sessionKey,
      wsOnly: this.wsOnly,
    });
  }

  /**
   * @method NodeMirai#handleNewFriendRequest
   * @description 处理好友申请
   * @param { number } eventId 好友申请事件 (newFriendRequest) ID
   * @param { number } fromId 申请人 QQ 号
   * @param { number } groupId 申请人如果通过某个群添加好友，该项为该群群号；否则为0
   * @param { 0|1|2 } operate 响应操作，0同意，1拒绝，2拒绝并拉黑
   * @param { string } message 回复的消息
   * @returns { Promise<httpApiResponse> }
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
      wsOnly: this.wsOnly,
    });
  }

  /**
   * @method NodeMirai#uploadFileAndSend
   * @description 上传（群）文件并发送
   * @param { string | Buffer | ReadStream } url 文件所在路径或 URL
   * @param { string | GroupFile } path 文件要上传到群文件中的位置（路径）
   * @param { number | GroupTarget } [target] 要发送文件的目标
   * @returns { Promise<httpApiResponse> }
   */
  uploadFileAndSend(url, path, target) {
    const { sessionKey, host } = this;
    if (!target && typeof path === 'object') {
      target = path.contact.id;
    }
    const realTarget = (typeof target === 'number') || (typeof target === 'string')
      ? target
      : target.sender.group.id;
    return uploadFileAndSend({
      url,
      path,
      target: realTarget,
      sessionKey,
      host,
      isV1: this._is_mah_v1_,
      wsOnly: this.wsOnly,
    });
  }

  
  /**
   * @method NodeMirai#getGroupFileList
   * @description 获取群文件指定路径下的文件列表
   * @param { GroupFile | string | number } dir - - `GroupFile|string` 要获取的群文件路径对象, 使用 `string` 结果可能不准确
   *  - `number` 获取指定群的群文件根目录 `bot.getGroupFileList(groupId)`
   * @param { number | string | GroupTarget } [target] 要获取的群号, `dir` 为 `File` 时可不提供
   * @param { boolean } [withDownloadInfo] 是否携带下载信息, 无必要不要携带
   * @returns { Promise<GroupFile[]> }
   * 
   */
  getGroupFileList(dir, target, withDownloadInfo) {
    const { sessionKey, host } = this;
    if (typeof dir === 'object') {
      if (!target) target = dir.contact.id;
      if (dir.isFile) console.warn(`Warning: Getting list of a file will get empty returns`);
    }
    // 兼容写法: getGroupFileList(groupid) 返回指定群的根目录
    if (typeof dir === 'number' || typeof dir === 'bigint') {
      [dir, target] = ['/', dir];
    }
    const realTarget = (typeof target === 'number') || (typeof target === 'string')
      ? target
      : target.sender.group.id;
    return getGroupFileList({
      target: realTarget,
      dir,
      sessionKey,
      host,
      withDownloadInfo,
      isV1: this._is_mah_v1_,
      wsOnly: this.wsOnly,
    });
  }

  /**
   * @method NodeMirai#getGroupFileInfo
   * @description 获取群文件指定详细信息
   * @param { string | GroupFile } id 文件唯一 ID 或文件对象
   * @param { number | string | GroupTarget } [target] 要获取的群号
   * @param { boolean } [withDownloadInfo] 是否携带下载信息, 无必要不要携带
   * @returns { Promise<GroupFile> }
   */
  getGroupFileInfo(id, target, withDownloadInfo) {
    const { sessionKey, host } = this;
    if (!target && typeof id === 'object') {
      target = id.contact.id;
    }
    const realTarget = (typeof target === 'number') || (typeof target === 'string')
      ? target
      : target.sender.group.id;
    return getGroupFileInfo({
      target: realTarget,
      id,
      sessionKey,
      host,
      withDownloadInfo,
      isV1: this._is_mah_v1_,
      wsOnly: this.wsOnly,
    });
  }

  /**
   * @method NodeMirai#renameGroupFile
   * @description 重命名指定群文件
   * @param { string | GroupFile } id 要重命名的文件唯一 ID 或文件对象
   * @param { string } rename 文件的新名称
   * @param { number | string | GroupTarget } [target] 目标群号
   * @returns { Promise<httpApiResponse> }
   */
  renameGroupFile(id, rename, target) {
    const { sessionKey, host } = this;
    if (!target && typeof id === 'object') {
      target = id.contact.id;
    }
    const realTarget = (typeof target === 'number') || (typeof target === 'string')
      ? target
      : target.sender.group.id;
    return renameGroupFile({
      target: realTarget,
      id,
      rename,
      sessionKey,
      host,
      isV1: this._is_mah_v1_,
      wsOnly: this.wsOnly,
    });
  }

  /**
   * @method NodeMirai#moveGroupFile
   * @description 移动指定群文件
   * @param { string | GroupFile } id 要移动的文件唯一 ID 或文件对象
   * @param { string | GroupFile } moveTo 文件的新路径或文件夹对象, 使用 `string` 可能结果不准确
   * @param { number | string | GroupTarget } [target] 目标群号
   * @returns { Promise<httpApiResponse> }
   */
  moveGroupFile(id, moveTo, target) {
    const { sessionKey, host } = this;
    if (!target && typeof moveTo === 'object') {
      target = moveTo.contact.id;
    }
    const realTarget = (typeof target === 'number') || (typeof target === 'string')
      ? target
      : target.sender.group.id;
    return moveGroupFile({
      target: realTarget,
      id,
      moveTo,
      sessionKey,
      host,
      isV1: this._is_mah_v1_,
      wsOnly: this.wsOnly,
    });
  }

  /**
   * @typedef { httpApiResponse & { data: GroupFile } } makeDirResponse
   */
  /**
   * @method NodeMirai#makeDir
   * @description 创建文件夹
   * @param { string | GroupFile | null } id 父目录id, 空串或null为根目录
   * @param { string } directoryName 新建文件夹名
   * @param { string | number } [target] 群号
   * @returns { Promise<makeDirResponse> }
   */
  makeDir (id, directoryName, target) {
    const { sessionKey, host } = this;
    if (!target && typeof id === 'object' && id !== null) {
      target = id.contact.id;
    }
    if (!target) {
      console.warn(`Error: Expect providing a target if id is empty`);
    }
    return makeDir({
      sessionKey,
      host,
      id,
      target,
      directoryName,
      isV1: this._is_mah_v1_,
      wsOnly: this.wsOnly,
    });
  }

  /**
   * 删除指定群文件
   * @param { string | GroupFile } id 要删除的文件唯一 ID
   * @param { number | string | GroupTarget } [target] 目标群号
   * @returns { Promise<httpApiResponse> }
   */
  deleteGroupFile(id, target) {
    const { sessionKey, host } = this;
    if (!target && typeof id === 'object') {
      target = id.contact.id;
    }
    const realTarget = (typeof target === 'number') || (typeof target === 'string')
      ? target
      : target.sender.group.id;
    return deleteGroupFile({
      target: realTarget,
      id,
      sessionKey,
      host,
      isV1: this._is_mah_v1_,
      wsOnly: this.wsOnly,
    });
  }

  /**
   * @method NodeMirai#deleteFriend
   * @description 删除好友
   * @param { number } qq 好友的QQ号
   * @returns { Promise<httpApiResponse> }
   */
  deleteFriend (qq) {
    return deleteFriend(Object.assign({}, this, { target: qq }));
  }

  getManagers () {
    return getManagers({
      host: this.host,
      verifyKey: this.verifyKey,
      qq: this.qq,
    });
  }

  getManager () {
    return util.deprecate(this.getManagers, 'NodeMirai#getManager is deprecated, use getManagers instead');
  }

  // command
  /**
   * @method NodeMirai#registerCommand
   * @param { Object } command 注册的 command 对象
   * @param { string } command.name
   * @param { string[] } command.alias
   * @param { string } command.description
   * @param { string } command.usage
   * @returns { Promise<httpApiResponse> }
   */
  registerCommand (command) {
    return registerCommand(Object.assign({
      host: this.host,
      verifyKey: this.verifyKey,
    }, command));
  }
  /**
   * @method NodeMirai#sendCommand
   * @param { Object } command 发送的 command 对象
   * @param { string } command.name
   * @param { string[] } command.args
   * @returns { Promise<httpApiResponse> }
   */
  sendCommand (command) {
    return sendCommand(Object.assign({
      host: this.host,
      verifyKey: this.verifyKey,
    }, command));
  }

  // event listener
  /**
   * @method NodeMirai#on
   * @description 事件监听
   * @template { keyof AllEventMap } N
   * @param { N } name
   * @param { (message: AllEventMap[N], self?: NodeMirai) => void } callback
   */
  on (name, callback) {
    if (name === 'message') return this.onMessage(callback);
    else if (name === 'command') return this.onCommand(callback);
    else if (this.signal.signalList.includes(name)) return this.onSignal(name, callback);
    return this.onEvent(name, callback);
  }
  /**
   * @method NodeMirai#onSignal
   * @description 订阅 authed, verified, 或 released 信号
   * @param { "authed"|"verified"|"released" } signalName 信号
   * @param { () => void } callback 回调
   */
  onSignal (signalName, callback) {
    return this.signal.on(signalName, callback);
  }
  /**
   * @method NodeMirai#onMessage
   * @description 订阅消息事件
   * @param { (message: message, self?: NodeMirai) => void } callback 回调
   */
  onMessage (callback) {
    this.eventListeners.message.push(callback);
  }
  /**
   * @template { keyof EventMap } E
   * @method NodeMirai#onEvent
   * @param { E } event
   * @param { (event: EventMap[E], self?: NodeMirai) => void } callback
    */
  onEvent (event, callback) {
    if (!this.eventListeners[event]) this.eventListeners[event] = [];
    this.eventListeners[event].push(callback);
  }
  onCommand (callback) {
    const ws = new WebSocket(`${this.host.replace('http', 'ws')}/command?verifyKey=${this.verifyKey}`);
    ws.on('message', message => {
      callback(JSON.parse(message));
    });
  }

  /**
   * @method NodeMirai#listen
   * @description 启动事件监听
   * @param { ["all"] | Array<"friend"|"group"|"temp"> } types 类型
   */
  listen (...types) {
    this.types = [];
    if (types.includes('all')) {
      this.types.push('FriendMessage', 'GroupMessage', 'TempMessage');
      return;
    }
    for (const type of types) {
      switch (type) {
        case 'group': this.types.push('GroupMessage'); break;
        case 'friend': this.types.push('FriendMessage'); break;
        case 'temp': this.types.push('TempMessage'); break;
        default:
          console.error('Invalid listen type. Type should be "all", "friend", "group" or "temp"');
      }
    }
  }
  startListeningEvents () {
    if (this.isEventListeningStarted) return;
    this.isEventListeningStarted = true;
    if (this.wsOnly) return;
    if (this.enableWebsocket) {
      this.onSignal('verified', () => {
        if (!this.wsHost) {
          const wsHost = `${this.host.replace('http', 'ws')}/all?sessionKey=${this.sessionKey}`;
          this.wsHost = new WebSocket(wsHost);
        }
        this.wsHost.on('message', message => {
          this.emitEventListener(JSON.parse(message));
        });
      });
    }
    else setInterval(async () => {
      const messages = await this.fetchMessage(10);
      if (messages.length) {
        messages.forEach(message => {
          return this.emitEventListener(message);
        });
      // } else if (messages.code) {
      //   console.error(`Error @ fetchMessage:\n\tCode: ${messages.code}\n\tMessage: ${messages.message || messages.msg || messages}`);
      }
    }, this.interval);
  }
  emitEventListener (messageResp) {
    // No `code` or `code = 0` presents a success response
    if (messageResp.code) {
      console.error(`Error: bad response with code ${messageResp.code}: ${messageResp.msg}`);
      return;
    }
    // get response.data for 2.x or message for 1.x
    const message = messageResp.data || messageResp;
    if (this.types.includes(message.type)) {
      message.reply = msg => this.reply(msg, message);
      message.quoteReply = msg => this.quoteReply(msg, message);
      message.recall = () => this.recall(message);
      for (let listener of this.eventListeners.message) {
        listener(message, this);
      }
    }
    else if (message.type in events) {
      if (['NewFriendRequestEvent', 'BotInvitedJoinGroupRequestEvent', 'MemberJoinRequestEvent'].includes(message.type)) {
        const self = this;
        const args = [message.eventId, message.fromId, message.groupId];
        const eventHandler = message.type === 'NewFriendRequestEvent'
          ? (...opt) => self.handleNewFriendRequest(...args, ...opt)
            : message.type === 'BotInvitedJoinGroupRequestEvent'
             ? (...opt) => self.handleBotInvitedJoinGroupRequest(...args, ...opt)
             : (...opt) => self.handleMemberJoinRequest(...args, ...opt)
        const methods = {
          accept (msg) {
            return eventHandler(0, msg);
          },
          reject (msg) {
            return eventHandler(1, msg);
          },
          rejectAndBlock: null,
          ignore: null,
          ignoreAndBlock: null,
        };
        if (message.type === 'NewFriendRequestEvent') {
          methods.rejectAndBlock = (msg) => {
            return self.handleNewFriendRequest(...args, 2, msg);
          };
        }
        if (message.type === 'MemberJoinRequestEvent') {
          methods.ignore = msg => self.handleMemberJoinRequest(...args, 2, msg);
          methods.rejectAndBlock = msg => self.handleMemberJoinRequest(...args, 3, msg);
          methods.ignoreAndBlock = msg => self.handleMemberJoinRequest(...args, 4, msg);
        }
        Object.assign(message, methods);
      }
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

module.exports = NodeMirai;
