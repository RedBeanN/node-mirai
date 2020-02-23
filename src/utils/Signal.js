const waitFor = require('./waitFor');

class Signal {
  constructor () {
    this.signalList = [];
  }
  on (signalName, callback) {
    waitFor(() => {
      if (this.signalList.includes(signalName)) return true;
      return false;
    }, callback);
  }
  trigger (signalName) {
    this.signalList.push(signalName);
  }
}

module.exports = Signal;