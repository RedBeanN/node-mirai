const axios = require('axios');

const fetchMessage = async (host, sessionKey, count = 10) => {
  const { data } = await axios.get(`${host}/fetchMessage?sessionKey=${sessionKey}&count=${count}`, );
  return data;
};

module.exports = fetchMessage;