const axios = require('axios');

const getMemberList = async ({
  target,
  port,
  sessionKey,
}) => {
  const { data } = await axios.get(`http://localhost:${port}/memberList`, {
    params: {
      sessionKey,
      target,
    },
  });
  return data;
};

module.exports = {
  getMemberList,
};
