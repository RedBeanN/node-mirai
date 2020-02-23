const polling = async (fn = async () => {}, cb) => {
  if (await fn()) return cb();
  else return setTimeout(() => {
    return polling(fn, cb);
  }, 100);
};
const waitFor = async (fn = () => {}, cb = () => {}) => {
  return setTimeout(() => {
    return polling(fn, cb);
  }, 100);
};

module.exports = waitFor;