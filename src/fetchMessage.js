const axios = require('axios');

const fetchMessage = async (host, sessionKey, count = 10) => { //使用此方法获取bot接收到的最老消息和最老各类事件(会从MiraiApiHttp消息记录中删除)
  const { data } = await axios.get(`${host}/fetchMessage?sessionKey=${sessionKey}&count=${count}`, );
  if ('code' in data && data.code === 0) return data.data;
  return data;
};

module.exports = fetchMessage;