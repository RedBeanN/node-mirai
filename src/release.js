const axios = require('axios');

const release = async (port, sessionKey, qq) => {
  const { data } = await axios.post(`http://localhost:${port}/release`, {
    sessionKey, qq,
  });
  return data;
};

module.exports = release;