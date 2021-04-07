const axios = require('axios');

const getMemberList = async ({ //获取群成员列表
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

const setMute = async ({ //群禁言群成员
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
const setUnmute = async ({ //群解除群成员禁言
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

const setMuteAll = async ({ //群全体禁言
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

const setUnmuteAll = async ({ //群解除全体禁言
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

const setKick = async ({ // 移除群成员
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

const setEssence = async ({  // 设置群精华
  target,
  sessionKey
}) => {
  const { data } = await axios.post(`${host}/setEssence`, {
    sessionKey,
    target
  });
  return data;
}

const getConfig = async ({ // 获取群设置
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
const setConfig = async ({ //修改群设置
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

const getMemberInfo = async ({ //获取群员资料
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

const setMemberInfo = async ({ //修改群员资料
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

const handleMemberJoinRequest = async({ //获取入群申请
  sessionKey,
  host,
  eventId,
  fromId,
  groupId,
  operate,
  message
}) => {
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
  setEssence,
  getConfig,
  setConfig,
  getMemberInfo,
  setMemberInfo,
  handleMemberJoinRequest
};