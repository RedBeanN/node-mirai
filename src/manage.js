const axios = require('axios');

const getFriendList = async ({ //获取好友列表
  host,
  sessionKey,
}) => {
  const { data } = await axios.get(`${host}/friendList?sessionKey=${sessionKey}`);
  return data.data || data;
};

const getGroupList = async ({ //获取群列表
  host,
  sessionKey,
}) => {
  const { data } = await axios.get(`${host}/groupList?sessionKey=${sessionKey}`);
  return data.data || data;
};

const getMessageById = async ({ //通过messageId获取一条被缓存的消息
  messageId, 
  host,
  sessionKey,
}) => {
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
  message
}) => {
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
  target
}) => {
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
  message
}) => {
  const { data } = await axios.post(`${host}/resp/newFriendRequestEvent`, {
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
  getFriendList,
  getGroupList,
  getMessageById,
  registerCommand,
  sendCommand,
  getManagers,
  botInvitedJoinGroupRequestHandler,
  quitGroup,
  handleNewFriendRequest
};