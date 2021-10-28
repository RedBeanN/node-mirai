const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const wsMessage = require('./ws/send');

const { Plain, Image, FlashImage, Voice } = require('./MessageComponent');

const sendFriendMessage = async ({ //发送好友消息
  messageChain,
  target,
}, bot) => {
  if (typeof messageChain === 'string') messageChain = [Plain(messageChain)];
  if (bot.wsOnly) return wsMessage.sendFriendMessage({ messageChain, target });
  const { data } = await axios.post(`${bot.host}/sendFriendMessage`, {
    messageChain, target, sessionKey: bot.sessionKey,
  }).catch(e => {
    console.error('Unknown Error @ sendFriendMessage:', e.message);
  });
  return data;
};

const sendQuotedFriendMessage = async ({ // 好友中引用一条消息的messageId进行回复
  messageChain,
  target,
  quote,
}, bot) => {
  if (typeof messageChain === 'string') messageChain = [Plain(messageChain)];
  if (bot.wsOnly) return wsMessage.sendFriendMessage({
    messageChain, target, quote
  });
  const { data } = await axios.post(`${bot.host}/sendFriendMessage`, {
    messageChain, target, sessionKey: bot.sessionKey, quote,
  }).catch(e => {
    console.error('Unknown Error @ sendQuotedFriendMessage:', e.message);
  });
  return data;
};

const sendGroupMessage = async ({ // 发送群消息
  messageChain,
  target,
}, bot) => {
  if (typeof messageChain === 'string') messageChain = [Plain(messageChain)];
  if (bot.wsOnly) return wsMessage.sendGroupMessage({
    messageChain, target,
  });
  const { data } = await axios.post(`${bot.host}/sendGroupMessage`, {
    messageChain, target, sessionKey: bot.sessionKey,
  }).catch(e => {
    console.error('Unknown Error @ sendGroupMessage:', e.message);
  });
  return data;
};
const sendQuotedGroupMessage = async ({ // 群消息中引用一条消息的 messageId 进行回复
  messageChain,
  target,
  quote,
}, bot) => {
  if (typeof messageChain === 'string') messageChain = [Plain(messageChain)];
  if (bot.wsOnly) return wsMessage.sendGroupMessage({
    messageChain, target, quote,
  });
  const { data } = await axios.post(`${bot.host}/sendGroupMessage`, {
    messageChain, target, sessionKey: bot.sessionKey, quote,
  }).catch(e => {
    console.error('Unknown Error @ sendQuotedGroupMessage:', e.message);
  });
  return data;
};

const sendTempMessage = async ({ // 发送临时会话消息
  messageChain,
  qq,
  group,
}, bot) => {
  if (typeof messageChain === 'string') messageChain = [Plain(messageChain)];
  if (bot.wsOnly) return wsMessage.sendTempMessage({
    messageChain, qq, group,
  });
  const { data } = await axios.post(`${bot.host}/sendTempMessage`, {
    messageChain, qq, group, sessionKey: bot.sessionKey,
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
}, bot) => {
  if (typeof messageChain === 'string') messageChain = [Plain(messageChain)];
  if (bot.wsOnly) return wsMessage.sendTempMessage({
    messageChain, qq, group, quote,
  });
  const { data } = await axios.post(`${bot.host}/sendTempMessage`, {
    messageChain, qq, group, sessionKey: bot.sessionKey, quote,
  }).catch(e => {
    console.error('Unknown Error @ sendQuotedTempMessage:', e.message);
  });
  return data;
};

const uploadImage = async ({
  url,
  type,
}, bot) => {
  if (bot.wsOnly) {
    console.warn(`[Warn] uploadImage is not supported in wsOnly mode. Use http instead`);
  }
  let img = url;
  if (typeof url === 'string') img = fs.createReadStream(url);
  const form = new FormData();
  form.append('sessionKey', bot.sessionKey);
  form.append('type', type);
  // #19: 当传入的 url 为 Buffer 类型时，只需指定文件名即可，此写法兼容 ReadStream；另外图片文件名的后缀类型并不会影响上传结果
  form.append('img', img, { filename: "payload.jpg" });
  
  const { data } = await axios.post(`${bot.host}/uploadImage`, form, {
    headers: form.getHeaders(),
  });
  return data;
};

const uploadVoice = async({
  url,
  type,
}, bot) => {
  if (bot.wsOnly) {
    console.warn(`[Warn] uploadVoice is not supported in wsOnly mode. Use http instead`);
  }
  let voice = (typeof url === 'string') ? fs.createReadStream(url) : url;
  const form = new FormData();
  form.append('sessionKey', bot.sessionKey);
  form.append('type', type);
  form.append('voice', voice);
    
  const { data } = await axios.post(`${bot.host}/uploadVoice`, form, {
    headers: form.getHeaders()
  });
  return data;
};

const sendImageMessage = async ({
  url,
  qq,
  group,
}, bot) => {
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
  }, bot);
  const messageChain = [Image(image)];
  return send({
    messageChain,
    target,
  }, bot);
};

const sendVoiceMessage = async({
  url,
  group,
}, bot) => {
  const target = group,
    type = 'group';
  const voice = await uploadVoice({
    url,
    type,
  }, bot);
  const messageChain = [Voice(voice)];
  return sendGroupMessage({
    messageChain,
    target,
  }, bot);
};

const sendFlashImageMessage = async ({
  url,
  qq,
  group,
}, bot) => {
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
  }, bot);
  const messageChain = [FlashImage(image)];
  return send({
    messageChain,
    target,
  }, bot);
};

/**
 * @function sendNudge 发送戳一戳消息
 * @param { Object } option
 * @param { string } option.sessionKey
 * @param { number } option.target QQ号, 可以是Bot的QQ
 * @param { number } option.subject 接收主体(QQ号或群号)
 * @param { 'Group' | 'Friend' | 'Stranger' } option.type
 */
const sendNudge = async ({
  target,
  subject,
  kind,
  host,
  sessionKey,
  wsOnly,
}) => {
  console.log({
    sessionKey,
    target,
    subject,
    kind,
  });
  if (wsOnly) return wsMessage.sendNudge({
    target, subject, kind,
  });
  const { data } = await axios.post(`${host}/sendNudge`, {
    sessionKey,
    target,
    subject,
    kind,
  });
  return data;
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
  sendNudge,
};
