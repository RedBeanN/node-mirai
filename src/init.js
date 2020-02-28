const axios = require('axios');

const init = async (host, authKey) => {
  const { data } = await axios.post(`${host}/auth`, {
    authKey,
  });
  return data;
};

module.exports = init;