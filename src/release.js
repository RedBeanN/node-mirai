const axios = require('axios');

const release = async (host, sessionKey, qq) => { //释放会话
  const { data } = await axios.post(`${host}/release`, {
    sessionKey, qq,
  });
  return data;
};

module.exports = release;