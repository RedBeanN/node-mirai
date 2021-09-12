const axios = require('axios');
//原auth接口
const init = async (host, verifyKey) => { //开始会话-认证
  const { data } = await axios.post(`${host}/verify`, {
    verifyKey,
  });
  return data;
};

module.exports = init;