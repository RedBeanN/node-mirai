const axios = require('axios');

const getMemberList = async ({
  target,
  host,
  sessionKey,
}) => {
  const { data } = await axios.get(`${host}/memberList`, {
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
  host,
  sessionKey,
}) => {
  const { data } = await axios.post(`${host}/mute`, {
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
  host,
  sessionKey,
}) => {
  const { data } = await axios.post(`${host}/unmute`, {
    sessionKey,
    target,
    memberId,
  });
  return data;
};

const setMuteAll = async ({
  target,
  host,
  sessionKey,
}) => {
  const { data } = await axios.post(`${host}/muteAll`, {
    sessionKey,
    target,
  });
  return data;
};

const setUnmuteAll = async ({
  target,
  host,
  sessionKey,
}) => {
  const { data } = await axios.post(`${host}/unmuteAll`, {
    sessionKey,
    target,
  });
  return { data };
};

const setKick = async ({
  target,
  memberId,
  msg,
  host,
  sessionKey,
}) => {
  const { data } = await axios.post(`${host}/kick`, {
    sessionKey,
    target,
    memberId,
    msg,
  });
  return data;
}

const getConfig = async ({
  target,
  host,
  sessionKey,
}) => {
  const { data } = await axios.get(`${host}/groupConfig`, {
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
  host,
  sessionKey,
}) => {
  const { data } = await axios.post(`${host}/groupConfig`, {
    target,
    sessionKey,
    config,
  });
  return data;
};

const getMemberInfo = async ({
  target,
  memberId,
  host,
  sessionKey,
}) => {
  const { data } = await axios.get(`${host}/memberInfo`, {
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
  host,
  sessionKey,
}) => {
  const { data } = await axios.post(`${host}/memberInfo`, {
    target,
    memberId,
    info,
    sessionKey,
  });
  return data;
}

const handleMemberJoinRequest = async({
  sessionKey,
  host,
  eventId,
  fromId,
  groupId,
  operate,
  message
}) => {
  console.log(sessionKey, eventId, fromId, groupId, operate, message)
  const { data } = await axios.post(`${host}/resp/memberJoinRequestEvent`, {
    sessionKey,
    eventId,
    fromId,
    groupId,
    operate,
    message
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
  handleMemberJoinRequest
};
