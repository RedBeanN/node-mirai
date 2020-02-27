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

const setMute = async ({
  target,
  memberId,
  time,
  port,
  sessionKey,
}) => {
  const { data } = await axios.post(`http://localhost:${port}/mute`, {
    sessionKey,
    target,
    memberId,
    time,
   });
   return data;
}

module.exports = {
  getMemberList,
  setMute
};
