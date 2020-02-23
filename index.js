const Signal = require('./src/utils/Signal');

const init = require('./src/init');
const verify = require('./src/verify');
const release = require('./src/release');
const fetchMessage = require('./src/fetchMessage');

class NodeMirai {
  constructor ({
    port = 8080,
    authKey = 'SupreSecureAuthKey',
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
    return fetchMessage(this.port, this.sessionKey, count);
  }
  async sendFriendMessage (message, target) {}
  async sendGroupMessage (message, target) {}
  async sendMessage (message, target) {}
  reply (replyMsg, srcMsg) {
    const replyMessage = [{
      type: 'Plain',
      text: replyMsg,
    }];
    this.sendMessage(replyMessage, srcMsg);
  }
  quoteReply (srcMsg, replyMsg) {}
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

module.exports = NodeMirai;