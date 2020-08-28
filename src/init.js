const axios = require('axios');

const init = async (host, authKey) => { //开始会话-认证
  const { data } = await axios.post(`${host}/auth`, {
    authKey,
  });
  return data;
};

module.exports = init;