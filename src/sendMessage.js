const axios = require('axios');
const fs = require('fs');
const request = require('request');
const FormData = require('form-data');

const { Image } = require('./MessageComponent');

const sendFriendMessage = async ({
  messageChain,
  target,
  sessionKey,
  host = 8080,
}) => {
  const { data } = await axios.post(`${host}/sendFriendMessage`, {
    messageChain, target, sessionKey,
  }).catch(e => {
    console.error('Unknown Error @ sendFriendMessage:', e.message);
    // process.exit(1);
  });
  return data;
};
const sendQuotedFriendMessage = async ({
  messageChain,
  target,
  quote,
  sessionKey,
  host = 8080,
}) => {
  const { data } = await axios.post(`${host}/sendFriendMessage`, {
    messageChain, target, sessionKey, quote,
  }).catch(e => {
    console.error('Unknown Error @ sendQuotedFriendMessage:', e.message);
    // process.exit(1);
  });
  return data;
};

const sendGroupMessage = async ({
  messageChain,
  target,
  sessionKey,
  host = 8080,
}) => {
  const { data } = await axios.post(`${host}/sendGroupMessage`, {
    messageChain, target, sessionKey,
  }).catch(e => {
    console.error('Unknown Error @ sendGroupMessage:', e.message);
    // process.exit(1);
  });
  return data;
};
const sendQuotedGroupMessage = async ({
  messageChain,
  target,
  quote,
  sessionKey,
  host = 8080,
}) => {
  const { data } = await axios.post(`${host}/sendGroupMessage`, {
    messageChain, target, sessionKey, quote,
  }).catch(e => {
    console.error('Unknown Error @ sendQuotedGroupMessage:', e.message);
    // process.exit(1);
  });
  return data;
};

const uploadImage = async ({
  url,
  type,
  sessionKey,
  host,
}) => new Promise((resolve, reject) => {
  const options = {
    method: 'POST',
    url: `${host}/uploadImage`,
    'headers': {
      'Content-Type': 'multipart/form-data'
    },
    formData: {
      sessionKey,
      type,
      img: fs.createReadStream(url),
    }
  };
  request(options, (err, res, body) => {
    if (err) return reject('ERROR:', err);
    else return resolve(body);
  });
  // const data = new FormData();
  // data.append('sessionKey', sessionKey);
  // data.append('type', type);
  // data.append('img', fs.createReadStream(url));
  // axios.post(`${host}/uploadImage`, data, {
  //   headers: {
  //     'Content-Type': 'multipart/form-data',
  //   }
  // })
  // .then(res => {
  //   console.log(res.data);
  //   resolve(res.data)
  // })
  // .catch(err => {
  //   console.error(err.message);
  //   reject(err);
  // });
});

const sendImageMessage = async ({
  url,
  qq,
  group,
  sessionKey,
  host = 8080,
}) => {
  let type, send, target;
  if (qq) {
    type = 'friend';
    send = sendFriendMessage;
    target = qq;
  } else if (group) {
    type = 'group';
    send = sendGroupMessage;
    target = group;
  } else return console.error('Error @ sendImageMessage: you should provide qq or group');
  const imageId = await uploadImage({
    url,
    type,
    sessionKey,
    host,
  });
  const messageChain = [Image(imageId)];
  return send({
    messageChain,
    target,
    sessionKey,
    host,
  });
};

module.exports = {
  sendFriendMessage,
  sendQuotedFriendMessage,
  sendGroupMessage,
  sendQuotedGroupMessage,
  uploadImage,
  sendImageMessage,
};