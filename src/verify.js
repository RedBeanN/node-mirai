const axios = require('axios');

const verify = async (host, sessionKey, qq) => { // 校验会话
  const { data } = await axios.post(`${host}/verify`, {
    sessionKey, qq,
  });
  return data;
};

module.exports = verify;