// node-mirai 文件发送 & 群文件管理相关实现

const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

/**
 * 上传群文件并发送
 * @param { string | Buffer | ReadStream } url 文件所在路径或 URL
 * @param { string } path 文件要上传到群文件中的位置（路径）
 * @param { message } target 要发送文件的目标
 * @param { string } sessionKey
 * @param { string } host
 * @return { object } 
 */
const uploadFileAndSend = async({
  url,
  path,
  target,
  sessionKey,
  host
}) => {
  const file = (typeof url === "string") ? fs.createReadStream(url) : url,
    form = new FormData();
  form.append('sessionKey', sessionKey);
  form.append('type', "Group");               // 当前只支持上传群文件
  form.append('path', path);
  form.append('target', target);
  form.append('file', file);

  const { data } = await axios.post(`${host}/uploadFileAndSend`, form, {
    headers: form.getHeaders()
  });

  return data;
};

module.exports = { 
  uploadFileAndSend
};