const axios = require('axios');

const sendFriendMessage = async ({
  messageChain,
  target,
  sessionKey,
  port = 8080,
}) => {
  const { data } = await axios.post(`http://localhost:${port}/sendFriendMessage`, {
    messageChain, target, sessionKey,
  });
  return data;
};

module.exports = {
  sendFriendMessage
};