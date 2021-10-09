const ws = require('./');

const sendFriendMessage = (content) => {
  return ws.send({
    command: 'sendFriendMessage',
    content,
  });
};

module.exports = {
  sendFriendMessage,
};
