const axios = require('axios');

const getFriendList = async ({
  host,
  sessionKey,
}) => {
  const { data } = await axios.get(`${host}/friendList?sessionKey=${sessionKey}`);
  return data;
};

const getGroupList = async ({
  host,
  sessionKey,
}) => {
  const { data } = await axios.get(`${host}/groupList?sessionKey=${sessionKey}`);
  return data;
};

const getMessageById = async ({
  messageId,
  host,
  sessionKey,
}) => {
  const { data } = await axios.get(`${host}/messageFromId?sessionKey=${sessionKey}&id=${messageId}`);
  return data;
};

module.exports = {
  getFriendList,
  getGroupList,
  getMessageById,
};