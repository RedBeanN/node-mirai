/**
 * syncId
 * 与 ws 服务端通信使用, 和 ws 推送的 syncId 对应
 */
let _id = 0;
let _skipId = -1;

const syncId = () => {
  return _id++ === _skipId ? _id : _id++;
};
syncId.skip = n => _skipId = n;

module.exports = syncId;
