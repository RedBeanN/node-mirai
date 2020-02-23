const axios = require('axios');

const init = async (port, authKey) => {
  const { data } = await axios.post(`http://localhost:${port}/auth`, {
    authKey,
  });
  return data;
};

module.exports = init;