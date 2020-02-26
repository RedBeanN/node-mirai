const axios = require('axios');

const recall = async ({
  target,
  sessionKey,
  port,
}) => {
  return await axios.post(`http://localhost:${port}/recall`, {
    sessionKey,
    target,
  }).catch(e => {
    console.error('Error @ recall', e.message);
  });
};

module.exports = recall;