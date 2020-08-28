const axios = require('axios');

/**
 * 校验会话
 * @param { string } host mirai-api-http 服务器地址
 * @param { string } sessionKey 会话密钥
 * @param { string } qq session 对应的 QQ 号
 * @returns {Promise<*>}
 */
const verify = async (host, sessionKey, qq) => {
  const { data } = await axios.post(`${host}/verify`, {
    sessionKey, qq,
  });
  return data;
};

module.exports = verify;