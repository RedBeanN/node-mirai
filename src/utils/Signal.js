const waitFor = require('./waitFor');

class Signal {
  constructor () {
    // this.signalList = {
    //   'authed': [],
    //   'verified': [],
    // };
    this.signalList = ['authed', 'verified'];
    this.signals = [];
  }
  on (signalName, callback) {
    // if (!this.signalList[signalName]) this.signalList[signalName] = [];
    // this.signalList[signalName].push(callback);
    waitFor(() => {
      if (this.signals.includes(signalName)) return true;
      return false;
    }, callback);
  }
  trigger (signalName) {
    this.signals.push(signalName);
    // if (!this.signalList[signalName]) return;
    // for (let callback of this.signalList[signalName]) callback();
  }
}

module.exports = Signal;