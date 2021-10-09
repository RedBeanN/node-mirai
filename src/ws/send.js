const ws = require('.');

// const sendFriendMessage = (content) => {
//   return ws.send({
//     command: 'sendFriendMessage',
//     content,
//   });
// };

// module.exports = {
//   sendFriendMessage,
// };

// Just use a proxy to send all types of messages
const sendMessage = new Proxy({}, {
  /**
   * sendMessage
   * @param { any } _ any
   * @param { string } method method
   * @returns { function }
   */
  get(_, method) {
    const command = method.replace('Quoted', '');
    return content => ws.send({ command, content });
  }
});

module.exports = sendMessage;
