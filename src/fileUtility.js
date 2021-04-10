// node-mirai 文件发送 & 群文件管理相关实现

const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

/**
 * 上传群文件并发送
 * @param { string | Buffer | ReadStream } url 文件所在路径或 URL
 * @param { string } path 文件要上传到群文件中的位置（路径）
 * @param { string } target 要发送文件的目标
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

/**
 * 获取群文件指定路径下的文件列表
 * @param { number | string } target 要获取的群号
 * @param { string } dir 要获取的群文件路径
 * @param { string } sessionKey
 * @param { string } host
 * @returns { object }
 */
const getGroupFileList = async({
  target,
  dir,
  sessoinKey,
  host 
}) => {
  let getUrl = `${host}/groupFileList?sessionKey=${sessionKey}&target=${target}`;
  if (dir !== undefined)
    getUrl += `&dir=${encodeURIComponent(dir)}`;
  const { data } = await axios.get(getUrl);
  return data;
};

/**
 * 获取群文件指定详细信息
 * @param { number | string } target 要获取的群号
 * @param { string } id 文件唯一 ID 
 * @param { string } sessionKey
 * @param { string } host
 * @returns { object }
 */
const getGroupFileInfo = async({
  target,
  id,
  sessionKey,
  host
}) => {
  const { data } = await axios.get(`${host}/groupFileInfo?sessionKey=${sessionKey}&target=${target}&id=${id}`);
  return data;
};


/**
 * 重命名指定群文件
 * @param { number | string } target 目标群号
 * @param { string } id 要重命名的文件唯一 ID 
 * @param { string } rename 文件的新名称
 * @param { string } sessionKey
 * @param { string } host
 * @returns { object }
 */
const renameGroupFile = async({
  target,
  id,
  rename,
  sessionKey,
  host
}) => {
  const { data } = await axios.post(`${host}/groupFileRename`, {
    sessionKey,
    target,
    id,
    rename
  });

  return data;
};

/**
 * 移动指定群文件
 * @param { number | string } target 目标群号
 * @param { string } id 要移动的文件唯一 ID 
 * @param { string } movePath 文件的新路径
 * @param { string } sessionKey
 * @param { string } host
 * @returns { object }
 */
const moveGroupFile = async({
  target,
  id,
  movePath,
  sessionKey,
  host
}) => {
  const { data } = await axios.post(`${host}/groupFileMove`, {
    sessionKey,
    id,
    target,
    movePath
  });

  return data;
};

/**
 * 删除指定群文件
 * @param { number | string } target 目标群号
 * @param { string } id 要删除的文件唯一 ID
 * @param { string } sessionKey
 * @param { string } host
 * @returns { object }
 */
const deleteGroupFile = async({
  target,
  id,
  sessionKey,
  host
}) => {
  const { data } = await axios.post(`${host}/groupFileDelete`, {
    sessionKey,
    id,
    target
  });

  return data;
};

module.exports = { 
  uploadFileAndSend,
  getGroupFileList,
  getGroupFileInfo,
  renameGroupFile,
  moveGroupFile,
  deleteGroupFile
};
