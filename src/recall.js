const axios = require('axios');

const recall = async ({ //撤回消息,管理BOT不能撤回群主消息,会报错
  target,
  sessionKey,
  host,
}) => {
  return await axios.post(`${host}/recall`, {
    sessionKey,
    target,
  }).catch(e => {
    console.error('Error @ recall', e.message);
  });
};

module.exports = recall;