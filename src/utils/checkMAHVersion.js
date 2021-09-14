const axios = require('axios');

const checkMAHVersion = (self) => {
  // ws-only mode is supported in v2
  if (this.wsOnly) return;
  return axios.get(`${self.host}/about`).then(({ data }) => {
    if (data && data.data && data.data.version) {
      if (data.data.version.startsWith('1.')) {
        console.log(`You are using mah-${data.data.version}, recommended to update to 2.x`);
        this._is_mah_v1_ = true;
      }
    }
  });
};

module.exports = checkMAHVersion;
