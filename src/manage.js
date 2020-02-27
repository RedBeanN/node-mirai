const axios = require('axios');

const getFriendList = async ({
  port,
  sessionKey,
}) => {
  const { data } = await axios.get(`http://localhost:${port}/friendList?sessionKey=${sessionKey}`);
  return data;
};

const getGroupList = async ({
  port,
  sessionKey,
}) => {
  const { data } = await axios.get(`http://localhost:${port}/groupList?sessionKey=${sessionKey}`);
  return data;
};

module.exports = {
  getFriendList,
  getGroupList,
};