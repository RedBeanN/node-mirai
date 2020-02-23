const axios = require('axios');

const verify = async (port, sessionKey, qq) => {
  const { data } = await axios.post(`http://localhost:${port}/verify`, {
    sessionKey, qq,
  });
  return data;
};

module.exports = verify;