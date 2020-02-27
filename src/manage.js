const axios = require('axios');

const getFriendList = ({
  port,
  sessionKey,
}) => {
  return axios.get(`http://localhost:${port}/friendList?sessionKey=${sessionKey}`);
};

const getGroupList = ({
  port,
  sessionKey,
}) => {
  return axios.get(`http://localhost:${port}/groupList?sessionKey=${sessionKey}`);
};

module.exports = {
  getFriendList,
  getGroupList,
};