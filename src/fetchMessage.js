const axios = require('axios');

const fetchMessage = async (port, sessionKey, count = 10) => {
  const { data } = await axios.get(`http://localhost:${port}/fetchMessage?sessionKey=${sessionKey}&count=${count}`, );
  return data;
};

module.exports = fetchMessage;