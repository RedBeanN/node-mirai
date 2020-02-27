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
};
const setUnmute = async ({
  target,
  memberId,
  port,
  sessionKey,
}) => {
  const { data } = await axios.post(`http://localhost:${port}/unmute`, {
    sessionKey,
    target,
    memberId,
  });
  return data;
};

const setMuteAll = async ({
  target,
  port,
  sessionKey,
}) => {
  const { data } = await axios.post(`http://localhost:${port}/muteAll`, {
    sessionKey,
    target,
  });
  return data;
};

const setUnmuteAll = async ({
  target,
  port,
  sessionKey,
}) => {
  const { data } = await axios.post(`http://localhost:${port}/unmuteAll`, {
    sessionKey,
    target,
  });
  return { data };
};

const setKick = async ({
  target,
  memberId,
  msg,
  port,
  sessionKey,
}) => {
  const { data } = await axios.post(`http://localhost:${port}/kick`, {
    sessionKey,
    target,
    memberId,
    msg,
  });
  return data;
}

const getConfig = async ({
  target,
  port,
  sessionKey,
}) => {
  const { data } = await axios.get(`http://localhost:${port}/groupConfig`, {
    params: {
      sessionKey,
      target,
    },
  });
  return data;
};
const setConfig = async ({
  target,
  config,
  port,
  sessionKey,
}) => {
  const { data } = await axios.post(`http://localhost:${port}/groupConfig`, {
    target,
    sessionKey,
    config,
  });
  return data;
};

const getMemberInfo = async ({
  target,
  memberId,
  port,
  sessionKey,
}) => {
  const { data } = await axios.get(`http://localhost:${port}/memberInfo`, {
    params: {
      sessionKey,
      target,
      memberId,
    },
  });
  return data;
};

const setMemberInfo = async ({
  target,
  memberId,
  info,
  port,
  sessionKey,
}) => {
  const { data } = await axios.post(`http://localhost:${port}/memberInfo`, {
    target,
    memberId,
    info,
    sessionKey,
  });
  return data;
}

module.exports = {
  getMemberList,
  setMute,
  setUnmute,
  setMuteAll,
  setUnmuteAll,
  setKick,
  getConfig,
  setConfig,
  getMemberInfo,
  setMemberInfo,
};
