const axios = require('axios');
const ws = require('./ws/send');

const getFriendList = async ({ //获取好友列表
  host,
  sessionKey,
  wsOnly,
}) => {
  if (wsOnly) return ws.friendList();
  const { data } = await axios.get(`${host}/friendList?sessionKey=${sessionKey}`);
  return data.data || data;
};

const getGroupList = async ({ //获取群列表
  host,
  sessionKey,
  wsOnly,
}) => {
  if (wsOnly) return ws.groupList();
  const { data } = await axios.get(`${host}/groupList?sessionKey=${sessionKey}`);
  return data.data || data;
};

const getBotProfile = async ({
  host,
  sessionKey,
  wsOnly,
}) => {
  if (wsOnly) return ws.botProfile();
  const { data } = await axios.get(`${host}/botProfile?sessionKey=${sessionKey}`);
  return data.data || data;
};
const getFriendProfile = async ({
  host,
  sessionKey,
  qq,
  wsOnly,
}) => {
  if (wsOnly) return ws.friendProfile({ target: qq });
  const { data } = await axios.get(`${host}/friendProfile?sessionKey=${sessionKey}&target=${qq}`);
  return data.data || data;
};
const getMemberProfile = async ({
  host,
  sessionKey,
  group,
  qq,
  wsOnly,
}) => {
  if (wsOnly) return ws.memberProfile({ target: group, memberId: qq });
  const { data } = await axios.get(`${host}/memberProfile?sessionKey=${sessionKey}&target=${group}&memberId=${qq}`);
  return data.data || data;
};

const getMessageById = async ({ //通过messageId获取一条被缓存的消息
  messageId, 
  host,
  sessionKey,
  wsOnly,
}) => {
  if (wsOnly) return ws.messageFromId({ messageId });
  const { data } = await axios.get(`${host}/messageFromId?sessionKey=${sessionKey}&id=${messageId}`);
  return data;
};

const registerCommand = async ({ //注册指令
  host,
  verifyKey,
  name,
  alias,
  description,
  usage
}) => {
  const { data } = await axios.post(`${host}/command/register`, {
    verifyKey, name, alias, description, usage,
  });
  return { data };
};

const sendCommand = async ({ //发送指令
  host,
  verifyKey,
  name,
  args,
}) => {
  const { data } = await axios.post(`${host}/command/send`, {
    verifyKey, name, args,
  });
  return data;
};

const getManagers = async ({ //获取Mangers
  host,
  verifyKey,
  qq,
}) => {
  const { data } = await axios.get(`${host}/managers?verifyKey=${verifyKey}&qq=${qq}`);
  return data;
};

const botInvitedJoinGroupRequestHandler = async({
  sessionKey,
  host,
  eventId,
  fromId,
  groupId,
  operate,
  message,
  wsOnly,
}) => {
  if (wsOnly) return ws.resp_botInvitedJoinGroupRequestEvent({
    eventId,
    fromId,
    groupId,
    operate,
    message,
  });
  const { data } = await axios.post(`${host}/resp/botInvitedJoinGroupRequestEvent`, {
    sessionKey,
    eventId,
    fromId,
    groupId,
    operate,
    message
  });
  return data;
};

const quitGroup = async ({
  sessionKey,
  host,
  target,
  wsOnly,
}) => {
  if (wsOnly) return ws.quit({ target });
  const { data } = await axios.post(`${host}/quit`, {
    sessionKey,
    target
  });
  return data;
}

const handleNewFriendRequest = async({
  sessionKey,
  host,
  eventId,
  fromId,
  groupId,
  operate,
  message,
  wsOnly,
}) => {
  if (wsOnly) return ws.resp_newFriendRequestEvent({
    eventId,
    fromId,
    groupId,
    operate,
    message,
  });
  const { data } = await axios.post(`${host}/resp/newFriendRequestEvent`, {
    sessionKey,
    eventId,
    fromId,
    groupId,
    operate,
    message
  });
  return data;
};

const deleteFriend = async ({
  sessionKey,
  host,
  target,
  wsOnly,
}) => {
  if (wsOnly) return ws.deleteFriend({ target });
  const { data } = await axios.post(`${host}/deleteFriend`, {
    sessionKey,
    target,
  });
  return { data };
};

module.exports = {
  getFriendList,
  getGroupList,
  getBotProfile,
  getFriendProfile,
  getMemberProfile,
  getMessageById,
  registerCommand,
  sendCommand,
  getManagers,
  botInvitedJoinGroupRequestHandler,
  quitGroup,
  handleNewFriendRequest,
  deleteFriend,
};