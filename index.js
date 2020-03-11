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

class NodeMirai {
  constructor ({
    host = 'http://localhost:8080',
    authKey = 'InitKeyQzrZbHQd',
    qq = 123456,
    interval = 200,
  }) {
    // init
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

  // send message
  async sendFriendMessage (message, target) {
    return sendFriendMessage({
      messageChain: message,
      target,
      sessionKey: this.sessionKey,
      host: this.host,
    });
  }
  async sendGroupMessage (message, target) {
    return sendGroupMessage({
      messageChain: message,
      target,
      sessionKey: this.sessionKey,
      host: this.host,
    });
  }
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
  async sendMessage (message, target) {
    switch (target.type) {
      case 'FriendMessage':
        return this.sendFriendMessage(message, target.sender.id);
      case 'GroupMessage':
        return this.sendGroupMessage(message, target.sender.group.id);
      default:
        console.error('Invalid target @ sendMessage');
        process.exit(1);
    }
  }
  async sendQuotedFriendMessage (message, target, quote) {
    return sendQuotedFriendMessage({
      messageChain: message,
      target, quote,
      sessionKey: this.sessionKey,
      host: this.host,
    });
  }
  async sendQuotedGroupMessage (message, target, quote) {
    return sendQuotedGroupMessage({
      messageChain: message,
      target, quote,
      sessionKey: this.sessionKey,
      host: this.host,
    });
  }
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
  reply (replyMsg, srcMsg) {
    const replyMessage = typeof replyMsg === 'string' ? [Plain(replyMsg)] : replyMsg;
    return this.sendMessage(replyMessage, srcMsg);
  }
  quoteReply (replyMsg, srcMsg) {
    const replyMessage = typeof replyMsg === 'string' ? [Plain(replyMsg)] : replyMsg;
    return this.sendQuotedMessage(replyMessage, srcMsg);
  }

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

  // management
  getFriendList () {
    return getFriendList({
      host: this.host,
      sessionKey: this.sessionKey,
    });
  }
  getGroupList () {
    return getGroupList({
      host: this.host,
      sessionKey: this.sessionKey,
    });
  }
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