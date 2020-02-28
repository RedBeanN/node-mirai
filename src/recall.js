const axios = require('axios');

const recall = async ({
  target,
  sessionKey,
  host,
}) => {
  return await axios.post(`${host}/recall`, {
    sessionKey,
    target,
  }).catch(e => {
    console.error('Error @ recall', e.message);
  });
};

module.exports = recall;