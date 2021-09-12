const axios = require('axios');
//原auth接口
const init = async (host, verifyKey, isV1) => { //开始会话-认证
  const keyName = isV1 ? 'auth' : 'verify'
  const { data } = await axios.post(`${host}/${keyName}`, {
    [keyName + 'Key']: verifyKey,
  });
  return data;
};

module.exports = init;