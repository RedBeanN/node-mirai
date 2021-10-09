const id = require('./syncId');
/**
 * @type { WebSocket }
 */
let ws = null;
const messageMap = new Map();

const init = (wsHost, syncId = -1, bot) => {
  ws = wsHost;
  id.skip(syncId);
  ws.on('message', msg => {
    const data = JSON.parse(msg);
    const _id = parseInt(data.syncId)
    if (isNaN(_id)) return;
    // server push messages
    if (_id === syncId) return bot.emitEventListener(data);
    // responses
    if (messageMap.has(_id)) {
      const [r, j] = messageMap.get(_id);
      if (data.data && data.data.code === 0) {
        r(data.data);
      } else {
        j(data.data);
      }
    }
  });
};
const send = (data) => {
  if (!ws) return;
  const syncId = id();
  ws.send(JSON.stringify({ syncId, ...data }));
  return new Promise((r, j) => {
    messageMap.set(syncId, [r, j]);
  });
};

module.exports = {
  init,
  send,
};