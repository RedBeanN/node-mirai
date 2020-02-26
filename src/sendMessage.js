const axios = require('axios');
const fs = require('fs');

const sendFriendMessage = async ({
  messageChain,
  target,
  sessionKey,
  port = 8080,
}) => {
  return await axios.post(`http://localhost:${port}/sendFriendMessage`, {
    messageChain, target, sessionKey,
  }).catch(e => {
    console.error('Unknown Error @ sendFriendMessage:', e.message);
    // process.exit(1);
  });
};
const sendQuotedFriendMessage = async ({
  messageChain,
  target,
  quote,
  sessionKey,
  port = 8080,
}) => {
  return await axios.post(`http://localhost:${port}/sendFriendMessage`, {
    messageChain, target, sessionKey, quote,
  }).catch(e => {
    console.error('Unknown Error @ sendQuotedFriendMessage:', e.message);
    // process.exit(1);
  });
};

const sendGroupMessage = async ({
  messageChain,
  target,
  sessionKey,
  port = 8080,
}) => {
  return await axios.post(`http://localhost:${port}/sendGroupMessage`, {
    messageChain, target, sessionKey,
  }).catch(e => {
    console.error('Unknown Error @ sendGroupMessage:', e.message);
    // process.exit(1);
  });
};
const sendQuotedGroupMessage = async ({
  messageChain,
  target,
  quote,
  sessionKey,
  port = 8080,
}) => {
  return await axios.post(`http://localhost:${port}/sendGroupMessage`, {
    messageChain, target, sessionKey, quote,
  }).catch(e => {
    console.error('Unknown Error @ sendQuotedGroupMessage:', e.message);
    // process.exit(1);
  });
  return data;
};

const sendImageMessage = async ({
  urls,
  qq,
  group,
  sessionKey,
  port = 8080,
}) => {
  if (qq) return await axios.post(`http://localhost:${port}/sendImageMessage`, {
    urls,
    qq,
    sessionKey,
  }).catch(e => {
    console.error('Unknown Error @ sendImageMessage:', e.message);
    // process.exit(1);
  });
  else if (group) return await axios.post(`http://localhost:${port}/sendImageMessage`, {
    urls,
    group,
    sessionKey,
  }).catch(e => {
    console.error('Unknown Error @ sendImageMessage:', e.message);
    // process.exit(1);
  });
  else {
    console.error('Error @ sendImageMessage: You need to provide a qq or a group');
  }
};

module.exports = {
  sendFriendMessage,
  sendQuotedFriendMessage,
  sendGroupMessage,
  sendQuotedGroupMessage,
  sendImageMessage,
};