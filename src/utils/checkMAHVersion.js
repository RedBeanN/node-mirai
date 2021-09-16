const axios = require('axios');

const checkMAHVersion = (self) => {
  // ws-only mode is supported in v2
  if (this.wsOnly) return false;
  return axios.get(`${self.host}/about`).then(({ data }) => {
    if (data && data.data && data.data.version) {
      if (data.data.version.startsWith('1.')) {
        console.log(`You are using mah-${data.data.version}, recommended to update to 2.x`);
        return true;
      }
    }
    return false;
  });
};

module.exports = checkMAHVersion;
