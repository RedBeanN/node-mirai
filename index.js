const Signal = require('./src/utils/Signal');

const MessageComponent = require('./src/MessageComponent');
const { Plain } = MessageComponent;

const init = require('./src/init');
const verify = require('./src/verify');
const release = require('./src/release');
const fetchMessage = require('./src/fetchMessage');
const recall = require('./src/recall');

const { sendFriendMessage, sendGroupMessage, sendQuotedFriendMessage, sendQuotedGroupMessage, sendImageMessage } = require('./src/sendMessage');

class NodeMirai {
  constructor ({
    port = 8080,
    authKey = 'InitKeyQzrZbHQd',
    qq = 123456,
  }) {
    this.port = port;
    this.authKey = authKey;
    this.qq = qq;
    this.signal = new Signal();
    this.eventListeners = [];
    init(port, authKey).then(data => {
      const { code, session } = data;
      if (code !== 0) {
        console.error('Invalid auth key');
        process.exit(1);
      }
      this.sessionKey = session;
      this.signal.trigger('authed');
      this.startListeningEvents();
    }).catch(() => {
      console.error('Invalid port');
      process.exit(1);
    });
  }
  async verify () {
    return verify(this.port, this.sessionKey, this.qq).then(({ code, msg}) => {
      if (code !== 0) {
        console.error('Invalid session key');
        process.exit(1);
      }
      this.signal.trigger('verified');
      return code;
    });
  }
  async release () {
    return release(this.port, this.sessionKey, this.qq).then(({ code }) => {
      if (code !== 0) return console.error('Invalid session key');
      this.signal.trigger('released');
      return code;
    });
  }
  async fetchMessage (count = 10) {
    return fetchMessage(this.port, this.sessionKey, count).catch(e => {
      console.error('Unknown error @ fetchMessage:', e.message);
      // process.exit(1);
    });
  }
  async sendFriendMessage (message, target) {
    return sendFriendMessage({
      messageChain: message,
      target,
      sessionKey: this.sessionKey,
      port: this.port,
    });
  }
  async sendGroupMessage (message, target) {
    return sendGroupMessage({
      messageChain: message,
      target,
      sessionKey: this.sessionKey,
      port: this.port,
    });
  }
  async sendImageMessage (urls, target) {
    switch (target.type) {
      case 'FriendMessage':
        return sendImageMessage({
          urls,
          qq: target.sender.id,
          sessionKey: this.sessionKey,
          port: this.port,
        });
      case 'GroupMessage':
        return sendImageMessage({
          urls,
          group: target.sender.group.id,
          sessionKey: this.sessionKey,
          port: this.port,
        });
      default:
        console.error('Error @ sendImageMessage: unknown target type');
    }
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
      port: this.port,
    });
  }
  async sendQuotedGroupMessage (message, target, quote) {
    return sendQuotedGroupMessage({
      messageChain: message,
      target, quote,
      sessionKey: this.sessionKey,
      port: this.port,
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
    this.sendQuotedMessage(replyMessage, srcMsg);
  }
  recall (msg) {
    try {
      const target = msg.messageId || msg;
      console.log(target);
      return recall({
        target,
        sessionKey: this.sessionKey,
        port: this.port,
      });
    } catch (e) {
      console.error('Error @ recall', e.message);
    }
  }
  onSignal (signalName, callback) {
    this.signal.on(signalName, callback);
  }
  onMessage (callback) {
    this.eventListeners.push(callback);
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
            for (let eventListener of this.eventListeners) {
              eventListener(message, this);
            }
          }
        })
      }
    }, 200);
  }
}

NodeMirai.MessageComponent = MessageComponent;

module.exports = NodeMirai;