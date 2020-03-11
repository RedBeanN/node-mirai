const Signal = require('./src/utils/Signal');

const MessageComponent = require('./src/MessageComponent');
const { Plain } = MessageComponent;
const events = require('./src/events.json');

const init = require('./src/init');
const verify = require('./src/verify');
const release = require('./src/release');
const fetchMessage = require('./src/fetchMessage');
const recall = require('./src/recall');

const { sendFriendMessage, sendGroupMessage, sendQuotedFriendMessage, sendQuotedGroupMessage, uploadImage, sendImageMessage } = require('./src/sendMessage');

const { getFriendList, getGroupList, getMessageById } = require('./src/manage');
const group = require('./src/group');

/**
 * @typedef { Object } MessageChain 消息链
 * @property { string } type 消息类型
 * @property { number } id
 * @property { number } [time] 时间戳, 只在 Source 类型中出现
 */
/**
 * @typedef { Object } message 消息
 * @property { "FriendMessage"|"GroupMessage" } messageType 消息类型
 * @property { MessageChain[] } messageChain
 * @property { Sender } sender 发送者
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
   * @param { number } [options.interval] 拉取消息的周期(ms), 默认为200
   */
  constructor ({
    host,
    authKey,
    qq,
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
   * @method NodeMirai#sendImageMessage
   * @async
   * @param { url } url 图片所在路径
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
   * @method NodeMirai#uploadImage
   * @async
   * @param { string } url 图片所在路径
   * @param { message } target 发送目标对象
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
  async sendQuotedFriendMessage (message, target, quote) {
    return sendQuotedFriendMessage({
      messageChain: message,
      target, quote,
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
        default:
          console.error('Invalid target @ sendMessage');
          // process.exit(1);
      }
    } catch (e) {
      // 无法引用时退化到普通消息
      // console.log('Back to send message');
      return this.sendMessage(message, target);
    }
  }

  /**
   * @method NodeMirai#reply
   * @description 回复一条消息, sendMessage 的别名方法
   * @param { MessageChain[]|string } replyMsg 回复的内容
   * @param { message } srcMsg 源消息
   */
  reply (replyMsg, srcMsg) {
    const replyMessage = typeof replyMsg === 'string' ? [Plain(replyMsg)] : replyMsg;
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
      const target = msg.messageId || msg.messageChain[0].id || msg;
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

  // group management
  getGroupMemberList (target) {
    return group.getMemberList({
      target,
      host: this.host,
      sessionKey: this.sessionKey,
    });
  }
  setGroupMute (target, memberId, time = 600) {
    return group.setMute({
      target,
      memberId,
      time,
      host: this.host,
      sessionKey: this.sessionKey,
    });
  }
  setGroupUnmute (target, memberId) {
    return group.setUnmute({
      target,
      memberId,
      host: this.host,
      sessionKey: this.sessionKey,
    });
  }
  setGroupMuteAll (target) {
    return group.setMuteAll({
      target,
      host: this.host,
      sessionKey: this.sessionKey,
    });
  }
  setGroupUnmuteAll (target) {
    return group.setUnmuteAll({
      target,
      host: this.host,
      sessionKey: this.sessionKey,
    });
  }
  setGroupKick (target, memberId, msg = '您已被移出群聊') {
    return group.setKick({
      target,
      memberId,
      msg,
      host: this.host,
      sessionKey: this.sessionKey,
    });
  }
  setGroupConfig (target, config) {
    return group.setConfig({
      target,
      config,
      host: this.host,
      sessionKey: this.sessionKey,
    });
  }
  getGroupConfig (target) {
    return group.getConfig({
      target,
      host: this.host,
      sessionKey: this.sessionKey,
    });
  }
  setGroupMemberInfo (target, memberId, info) {
    return group.setMemberInfo({
      target,
      memberId,
      info,
      host: this.host,
      sessionKey: this.sessionKey,
    });
  }
  getGroupMemberInfo (target, memberId) {
    return group.getMemberInfo({
      target,
      memberId,
      host: this.host,
      sessionKey: this.sessionKey,
    });
  }

  // event listener
  onSignal (signalName, callback) {
    return this.signal.on(signalName, callback);
  }
  on (name, callback) {
    if (name === 'message') return this.onMessage(callback)
    else if (name in this.signal.signalList) return this.onSignal(name, callback);
    return this.onEvent(name, callback);
  }
  onMessage (callback) {
    this.eventListeners.message.push(callback);
  }
  onEvent (event, callback) {
    if (!this.eventListeners[event]) this.eventListeners[event] = [];
    this.eventListeners[event].push(callback);
  }
  listen (type = 'all') {
    this.types = [];
    switch (type) {
      case 'group': this.types.push('GroupMessage'); break;
      case 'friend': this.types.push('FriendMessage'); break;
      case 'all': this.types.push('FriendMessage', 'GroupMessage'); break;
      default:
        console.error('Invalid listen type. Type should be "all", "friend" or "group"');
        process.exit(1);
    }
  }
  startListeningEvents () {
    setInterval(async () => {
      const messages = await this.fetchMessage(10);
      if (messages.length) {
        messages.forEach(message => {
          if (this.types.includes(message.type)) {
            message.reply = msg => this.reply(msg, message);
            message.quoteReply = msg => this.quoteReply(msg, message);
            message.recall = () => this.recall(message);
            for (let listener of this.eventListeners.message) {
              listener(message);
            }
          }
          else if (message.type in events) {
            for (let listener of this.eventListeners[events[message.type]]) {
              listener(message);
            }
          }
        });
      }
    }, this.interval);
  }
}

NodeMirai.MessageComponent = MessageComponent;

module.exports = NodeMirai;