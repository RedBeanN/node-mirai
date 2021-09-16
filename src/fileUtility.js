// node-mirai 文件发送 & 群文件管理相关实现

const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

/**
 * @typedef { import('./typedef').GroupFile } FileOrDir
 */

/**
 * 上传群文件并发送
 * @param { object } config
 * @param { string | Buffer | ReadStream } config.url 文件所在路径或 URL
 * @param { string | FileOrDir } config.path 文件要上传到群文件中的位置（路径）
 * @param { string } config.target 要发送文件的目标
 * @param { string } config.sessionKey
 * @param { string } config.host
 * @param { boolean } config.isV1
 * @return { object } 
 */
const uploadFileAndSend = async({
  url,
  path,
  target,
  sessionKey,
  host,
  isV1,
}) => {
  const postUrl = isV1
    ? `${host}/uploadFileAndSend`
    : `${host}/file/upload`;
  const file = (typeof url === "string") ? fs.createReadStream(url) : url,
    form = new FormData();
  form.append('sessionKey', sessionKey);
  form.append('type', isV1 ? "Group" : 'group');               // 当前只支持上传群文件
  form.append('path', typeof path === 'string' ? path : path.path || '');
  form.append('target', target);
  form.append('file', file);

  const { data } = await axios.post(postUrl, form, {
    headers: form.getHeaders()
  });

  return data;
};

/**
 * 获取群文件指定路径下的文件列表
 * @param { Object } config
 * @param { number | string } config.target 要获取的群号
 * @param { FileOrDir | string } config.dir 要获取的文件路径
 * @param { string } config.sessionKey
 * @param { string } config.host
 * @param { boolean } config.withDownloadInfo
 * @param { boolean } config.isV1
 * @returns { Promise<FileOrDir[]> }
 */
const getGroupFileList = async({
  target,
  dir,
  sessionKey,
  host,
  withDownloadInfo = false,
  isV1 = false,
}) => {
  let getUrl = isV1
    ? `${host}/groupFileList?sessionKey=${sessionKey}&target=${target}`
    : `${host}/file/list?sessionKey=${sessionKey}&target=${target}`;
  if (withDownloadInfo) {
    getUrl += '&withDownloadInfo=true';
  }
  // set dir to null for listing root path
  if (!dir) {
    getUrl += '&id=';
  } else {
    if (typeof dir === 'string') {
      getUrl += `&${isV1 ? 'dir' : 'path'}=${dir}`;
    } else {
      getUrl += `&id=${dir.id}`;
    }
  }
  const { data } = await axios.get(getUrl);
  return data.data || data;
};

/**
 * 获取群文件指定详细信息
 * @param { Object } config
 * @param { number | string } config.target 要获取的群号
 * @param { string | FileOrDir } config.id 文件唯一 ID 
 * @param { string } config.sessionKey
 * @param { string } config.host
 * @param { boolean } config.withDownloadInfo
 * @param { boolean } config.isV1
 * @returns { object }
 */
const getGroupFileInfo = async({
  target,
  id,
  sessionKey,
  host,
  withDownloadInfo,
  isV1,
}) => {
  const realId = typeof id === 'object' ? id.id : id;
  const getUrl = isV1
    ? `${host}/groupFileInfo?sessionKey=${sessionKey}&target=${target}&id=${realId}`
    : `${host}/file/info?sessionKey=${sessionKey}&target=${target}&id=${realId}`;
  if (withDownloadInfo) {
    getUrl += '&withDownloadInfo=true';
  }
  const { data } = await axios.get(getUrl);
  return data;
};


/**
 * 重命名指定群文件
 * @param { object } config
 * @param { number | string } config.target 目标群号
 * @param { string | FileOrDir } config.id 要重命名的文件唯一 ID 
 * @param { string } config.rename 文件的新名称
 * @param { string } config.sessionKey
 * @param { string } config.host
 * @param { boolean } config.isV1
 * @returns { object }
 */
const renameGroupFile = async({
  target,
  id,
  rename,
  sessionKey,
  host,
  isV1,
}) => {
  const postUrl = isV1
    ? `${host}/groupFileRename`
    : `${host}/file/rename`;
  const postData = {
    sessionKey,
    target,
    id: typeof id === 'string' ? id : id.id,
    [isV1 ? 'rename' : 'renameTo']: rename,
  };
  console.log(postData);
  const { data } = await axios.post(postUrl, postData);

  return data;
};

/**
 * 移动指定群文件
 * @param { object } config
 * @param { number | string } config.target 目标群号
 * @param { string | FileOrDir } config.id 要移动的文件唯一 ID 
 * @param { string | FileOrDir } config.moveTo 文件的新路径
 * @param { string } config.sessionKey
 * @param { string } config.host
 * @param { boolean } config.isV1
 * @returns { object }
 */
const moveGroupFile = async({
  target,
  id,
  moveTo,
  sessionKey,
  host,
  isV1,
}) => {
  const postUrl = isV1
    ? `${host}/groupFileMove`
    : `${host}/file/move`;
  const postData = {
    sessionKey,
    id: typeof id === 'string' ? id : id.id,
    target,
  };
  if (typeof moveTo === 'object') {
    postData.moveTo = moveTo.id;
  } else {
    postData[isV1 ? 'movePath' : 'moveToPath'] = moveTo;
  }
  console.log(postData, postUrl);
  const { data } = await axios.post(postUrl, postData);

  return data;
};

/**
 * 删除指定群文件
 * @param { object } config
 * @param { number | string } config.target 目标群号
 * @param { string | FileOrDir } config.id 要删除的文件唯一 ID
 * @param { string } config.sessionKey
 * @param { string } config.host
 * @param { boolean } config.isV1
 * @returns { object }
 */
const deleteGroupFile = async({
  target,
  id,
  sessionKey,
  host,
  isV1,
}) => {
  const postUrl = isV1
    ? `${host}/groupFileDelete`
    : `${host}/file/delete`;
  const postData = {
    sessionKey,
    id: typeof id === 'string' ? id : id.id,
    target
  };
  const { data } = await axios.post(postUrl, postData);

  return data;
};

/**
 * NOTE: MAH seems not work correctly with parent directory
 * @function makeDir
 * @param { object } config
 * @param { string } config.sessionKey
 * @param { string } config.host
 * @param { string | FileOrDir } config.id
 * @param { number } config.target
 * @param { string } config.directoryName
 * @param { boolean } config.isV1
 */
const makeDir = async ({
  sessionKey,
  host,
  id,
  target,
  directoryName,
  isV1,
}) => {
  if (isV1) return { code: 400, message: 'not supported' };
  const postUrl = `${host}/file/mkdir`;
  const postData = {
    sessionKey,
    id: typeof id === 'string' ? id : id.id,
    target,
    directoryName,
  };
  const { data } = await axios.post(postUrl, postData);
  return data;
};

module.exports = { 
  uploadFileAndSend,
  getGroupFileList,
  getGroupFileInfo,
  renameGroupFile,
  moveGroupFile,
  deleteGroupFile,
  makeDir,
};
