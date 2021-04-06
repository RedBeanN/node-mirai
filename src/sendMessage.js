const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const { Plain, Image, FlashImage, Voice } = require('./MessageComponent');

const sendFriendMessage = async ({ //发送好友消息
  messageChain,
  target,
  sessionKey,
  host = 8080,
}) => {
  if (typeof messageChain === 'string') messageChain = [Plain(messageChain)];
  const { data } = await axios.post(`${host}/sendFriendMessage`, {
    messageChain, target, sessionKey,
  }).catch(e => {
    console.error('Unknown Error @ sendFriendMessage:', e.message);
  });
  return data;
};

const sendQuotedFriendMessage = async ({ // 好友中引用一条消息的messageId进行回复
  messageChain,
  qq,
  quote,
  sessionKey,
  host = 8080,
}) => {
  if (typeof messageChain === 'string') messageChain = [Plain(messageChain)];
  const { data } = await axios.post(`${host}/sendFriendMessage`, {
    messageChain, target: qq, sessionKey, quote,
  }).catch(e => {
    console.error('Unknown Error @ sendQuotedFriendMessage:', e.message);
  });
  return data;
};

const sendGroupMessage = async ({ // 发送群消息
  messageChain,
  target,
  sessionKey,
  host = 8080,
}) => {
  if (typeof messageChain === 'string') messageChain = [Plain(messageChain)];
  const { data } = await axios.post(`${host}/sendGroupMessage`, {
    messageChain, target, sessionKey,
  }).catch(e => {
    console.error('Unknown Error @ sendGroupMessage:', e.message);
  });
  return data;
};
const sendQuotedGroupMessage = async ({ // 群消息中引用一条消息的 messageId 进行回复
  messageChain,
  target,
  quote,
  sessionKey,
  host = 8080,
}) => {
  if (typeof messageChain === 'string') messageChain = [Plain(messageChain)];
  const { data } = await axios.post(`${host}/sendGroupMessage`, {
    messageChain, target, sessionKey, quote,
  }).catch(e => {
    console.error('Unknown Error @ sendQuotedGroupMessage:', e.message);
  });
  return data;
};

const sendTempMessage = async ({ // 发送临时会话消息
  messageChain,
  qq,
  group,
  sessionKey,
  host = 8080,
}) => {
  if (typeof messageChain === 'string') messageChain = [Plain(messageChain)];
  const { data } = await axios.post(`${host}/sendTempMessage`, {
    messageChain, qq, group, sessionKey,
  }).catch(e => {
    console.error('Unknown Error @ sendTempMessage:', e.message);
  });
  return data;
};

const sendQuotedTempMessage = async ({ // 发送临时会话引用一条消息的messageId进行回复
  messageChain,
  qq,
  group,
  quote,
  sessionKey,
  host = 8080,
}) => {
  if (typeof messageChain === 'string') messageChain = [Plain(messageChain)];
  const { data } = await axios.post(`${host}/sendTempMessage`, {
    messageChain, qq, group, sessionKey, quote,
  }).catch(e => {
    console.error('Unknown Error @ sendQuotedTempMessage:', e.message);
  });
  return data;
};

const uploadImage = async ({
  url,
  type,
  sessionKey,
  host,
}) => {
  let img = url;
  if (typeof url === 'string') img = fs.createReadStream(url);
  const form = new FormData();
  form.append('sessionKey', sessionKey);
  form.append('type', type);
  // #19: 当传入的 url 为 Buffer 类型时，只需指定文件名即可，此写法兼容 ReadStream；另外图片文件名的后缀类型并不会影响上传结果
  form.append('img', img, { filename: "payload.jpg" });
  
  const { data } = await axios.post(`${host}/uploadImage`, form, {
    headers: form.getHeaders(),
  });
  return data;
};

const uploadVoice = async({
  url,
  type,
  sessionKey,
  host
}) => {
  let voice = (typeof url === 'string') ? fs.createReadStream(url) : url;
  const form = new FormData();
  form.append('sessionKey', sessionKey);
  form.append('type', type);
  form.append('voice', voice);

  const { data } = await axios.post(`${host}/uploadVoice`, form, {
    headers: form.getHeaders()
  });
  return data;
};

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
  const image = await uploadImage({
    url,
    type,
    sessionKey,
    host,
  });
  const messageChain = [Image(image)];
  return send({
    messageChain,
    target,
    sessionKey,
    host,
  });
};

const sendVoiceMessage = async({
  url,
  group,
  sessionKey,
  host = 8080
}) => {
  const target = group,
    type = 'group';
  const voice = await uploadVoice({
    url,
    type,
    sessionKey,
    host
  });
  const messageChain = [Voice(voice)];
  return sendGroupMessage({
    messageChain,
    target,
    sessionKey,
    host
  });
};

const sendFlashImageMessage = async ({
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
  const image = await uploadImage({
    url,
    type,
    sessionKey,
    host,
  });
  const messageChain = [FlashImage(image)];
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
  sendTempMessage,
  sendQuotedTempMessage,
  uploadImage,
  uploadVoice,
  sendImageMessage,
  sendVoiceMessage,
  sendFlashImageMessage,
};
