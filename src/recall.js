const axios = require('axios');
const ws = require('./ws/send');

const recall = ({ //撤回消息,管理BOT不能撤回群主消息,会报错
  target,
  messageId,
  sessionKey,
  host,
  wsOnly,
}) => {
  if (wsOnly) return ws.recall({ target, messageId });
  return axios.post(`${host}/recall`, {
    sessionKey,
    target,
    messageId,
  }).then(({ data }) => {
    // 和 ws 保持一致返回 data
    return data
  });
};

module.exports = recall;