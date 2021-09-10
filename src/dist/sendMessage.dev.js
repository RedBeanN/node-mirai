"use strict";

var axios = require('axios');

var fs = require('fs');

var FormData = require('form-data');

var _require = require('./MessageComponent'),
    Plain = _require.Plain,
    Image = _require.Image,
    FlashImage = _require.FlashImage,
    Voice = _require.Voice;

var sendFriendMessage = function sendFriendMessage(_ref) {
  var messageChain, target, sessionKey, _ref$host, host, _ref2, data;

  return regeneratorRuntime.async(function sendFriendMessage$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          messageChain = _ref.messageChain, target = _ref.target, sessionKey = _ref.sessionKey, _ref$host = _ref.host, host = _ref$host === void 0 ? 8080 : _ref$host;
          if (typeof messageChain === 'string') messageChain = [Plain(messageChain)];
          _context.next = 4;
          return regeneratorRuntime.awrap(axios.post("".concat(host, "/sendFriendMessage"), {
            messageChain: messageChain,
            target: target,
            sessionKey: sessionKey
          })["catch"](function (e) {
            console.error('Unknown Error @ sendFriendMessage:', e.message);
          }));

        case 4:
          _ref2 = _context.sent;
          data = _ref2.data;
          return _context.abrupt("return", data);

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
};

var sendQuotedFriendMessage = function sendQuotedFriendMessage(_ref3) {
  var messageChain, qq, quote, sessionKey, _ref3$host, host, _ref4, data;

  return regeneratorRuntime.async(function sendQuotedFriendMessage$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          messageChain = _ref3.messageChain, qq = _ref3.qq, quote = _ref3.quote, sessionKey = _ref3.sessionKey, _ref3$host = _ref3.host, host = _ref3$host === void 0 ? 8080 : _ref3$host;
          if (typeof messageChain === 'string') messageChain = [Plain(messageChain)];
          _context2.next = 4;
          return regeneratorRuntime.awrap(axios.post("".concat(host, "/sendFriendMessage"), {
            messageChain: messageChain,
            target: qq,
            sessionKey: sessionKey,
            quote: quote
          })["catch"](function (e) {
            console.error('Unknown Error @ sendQuotedFriendMessage:', e.message);
          }));

        case 4:
          _ref4 = _context2.sent;
          data = _ref4.data;
          return _context2.abrupt("return", data);

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
};

var sendGroupMessage = function sendGroupMessage(_ref5) {
  var messageChain, target, sessionKey, _ref5$host, host, _ref6, data;

  return regeneratorRuntime.async(function sendGroupMessage$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          messageChain = _ref5.messageChain, target = _ref5.target, sessionKey = _ref5.sessionKey, _ref5$host = _ref5.host, host = _ref5$host === void 0 ? 8080 : _ref5$host;
          if (typeof messageChain === 'string') messageChain = [Plain(messageChain)];
          _context3.next = 4;
          return regeneratorRuntime.awrap(axios.post("".concat(host, "/sendGroupMessage"), {
            messageChain: messageChain,
            target: target,
            sessionKey: sessionKey
          })["catch"](function (e) {
            console.error('Unknown Error @ sendGroupMessage:', e.message);
          }));

        case 4:
          _ref6 = _context3.sent;
          data = _ref6.data;
          return _context3.abrupt("return", data);

        case 7:
        case "end":
          return _context3.stop();
      }
    }
  });
};

var sendQuotedGroupMessage = function sendQuotedGroupMessage(_ref7) {
  var messageChain, target, quote, sessionKey, _ref7$host, host, _ref8, data;

  return regeneratorRuntime.async(function sendQuotedGroupMessage$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          messageChain = _ref7.messageChain, target = _ref7.target, quote = _ref7.quote, sessionKey = _ref7.sessionKey, _ref7$host = _ref7.host, host = _ref7$host === void 0 ? 8080 : _ref7$host;
          if (typeof messageChain === 'string') messageChain = [Plain(messageChain)];
          _context4.next = 4;
          return regeneratorRuntime.awrap(axios.post("".concat(host, "/sendGroupMessage"), {
            messageChain: messageChain,
            target: target,
            sessionKey: sessionKey,
            quote: quote
          })["catch"](function (e) {
            console.error('Unknown Error @ sendQuotedGroupMessage:', e.message);
          }));

        case 4:
          _ref8 = _context4.sent;
          data = _ref8.data;
          return _context4.abrupt("return", data);

        case 7:
        case "end":
          return _context4.stop();
      }
    }
  });
};

var sendTempMessage = function sendTempMessage(_ref9) {
  var messageChain, qq, group, sessionKey, _ref9$host, host, _ref10, data;

  return regeneratorRuntime.async(function sendTempMessage$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          messageChain = _ref9.messageChain, qq = _ref9.qq, group = _ref9.group, sessionKey = _ref9.sessionKey, _ref9$host = _ref9.host, host = _ref9$host === void 0 ? 8080 : _ref9$host;
          if (typeof messageChain === 'string') messageChain = [Plain(messageChain)];
          _context5.next = 4;
          return regeneratorRuntime.awrap(axios.post("".concat(host, "/sendTempMessage"), {
            messageChain: messageChain,
            qq: qq,
            group: group,
            sessionKey: sessionKey
          })["catch"](function (e) {
            console.error('Unknown Error @ sendTempMessage:', e.message);
          }));

        case 4:
          _ref10 = _context5.sent;
          data = _ref10.data;
          return _context5.abrupt("return", data);

        case 7:
        case "end":
          return _context5.stop();
      }
    }
  });
};

var sendQuotedTempMessage = function sendQuotedTempMessage(_ref11) {
  var messageChain, qq, group, quote, sessionKey, _ref11$host, host, _ref12, data;

  return regeneratorRuntime.async(function sendQuotedTempMessage$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          messageChain = _ref11.messageChain, qq = _ref11.qq, group = _ref11.group, quote = _ref11.quote, sessionKey = _ref11.sessionKey, _ref11$host = _ref11.host, host = _ref11$host === void 0 ? 8080 : _ref11$host;
          if (typeof messageChain === 'string') messageChain = [Plain(messageChain)];
          _context6.next = 4;
          return regeneratorRuntime.awrap(axios.post("".concat(host, "/sendTempMessage"), {
            messageChain: messageChain,
            qq: qq,
            group: group,
            sessionKey: sessionKey,
            quote: quote
          })["catch"](function (e) {
            console.error('Unknown Error @ sendQuotedTempMessage:', e.message);
          }));

        case 4:
          _ref12 = _context6.sent;
          data = _ref12.data;
          return _context6.abrupt("return", data);

        case 7:
        case "end":
          return _context6.stop();
      }
    }
  });
};

var uploadImage = function uploadImage(_ref13) {
  var url, type, sessionKey, host, img, form, _ref14, data;

  return regeneratorRuntime.async(function uploadImage$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          url = _ref13.url, type = _ref13.type, sessionKey = _ref13.sessionKey, host = _ref13.host;
          img = url;
          if (typeof url === 'string') img = fs.createReadStream(url);
          form = new FormData();
          form.append('sessionKey', sessionKey);
          form.append('type', type); // #19: 当传入的 url 为 Buffer 类型时，只需指定文件名即可，此写法兼容 ReadStream；另外图片文件名的后缀类型并不会影响上传结果

          form.append('img', img, {
            filename: "payload.jpg"
          });
          _context7.next = 9;
          return regeneratorRuntime.awrap(axios.post("".concat(host, "/uploadImage"), form, {
            headers: form.getHeaders()
          }));

        case 9:
          _ref14 = _context7.sent;
          data = _ref14.data;
          return _context7.abrupt("return", data);

        case 12:
        case "end":
          return _context7.stop();
      }
    }
  });
};

var uploadVoice = function uploadVoice(_ref15) {
  var url, type, sessionKey, host, voice, form, _ref16, data;

  return regeneratorRuntime.async(function uploadVoice$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          url = _ref15.url, type = _ref15.type, sessionKey = _ref15.sessionKey, host = _ref15.host;
          voice = typeof url === 'string' ? fs.createReadStream(url) : url;
          form = new FormData();
          form.append('sessionKey', sessionKey);
          form.append('type', type);
          form.append('voice', voice);
          _context8.next = 8;
          return regeneratorRuntime.awrap(axios.post("".concat(host, "/uploadVoice"), form, {
            headers: form.getHeaders()
          }));

        case 8:
          _ref16 = _context8.sent;
          data = _ref16.data;
          return _context8.abrupt("return", data);

        case 11:
        case "end":
          return _context8.stop();
      }
    }
  });
};

var sendImageMessage = function sendImageMessage(_ref17) {
  var url, qq, group, sessionKey, _ref17$host, host, type, send, target, image, messageChain;

  return regeneratorRuntime.async(function sendImageMessage$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          url = _ref17.url, qq = _ref17.qq, group = _ref17.group, sessionKey = _ref17.sessionKey, _ref17$host = _ref17.host, host = _ref17$host === void 0 ? 8080 : _ref17$host;

          if (!qq) {
            _context9.next = 7;
            break;
          }

          type = 'friend';
          send = sendFriendMessage;
          target = qq;
          _context9.next = 14;
          break;

        case 7:
          if (!group) {
            _context9.next = 13;
            break;
          }

          type = 'group';
          send = sendGroupMessage;
          target = group;
          _context9.next = 14;
          break;

        case 13:
          return _context9.abrupt("return", console.error('Error @ sendImageMessage: you should provide qq or group'));

        case 14:
          _context9.next = 16;
          return regeneratorRuntime.awrap(uploadImage({
            url: url,
            type: type,
            sessionKey: sessionKey,
            host: host
          }));

        case 16:
          image = _context9.sent;
          messageChain = [Image(image)];
          return _context9.abrupt("return", send({
            messageChain: messageChain,
            target: target,
            sessionKey: sessionKey,
            host: host
          }));

        case 19:
        case "end":
          return _context9.stop();
      }
    }
  });
};

var sendVoiceMessage = function sendVoiceMessage(_ref18) {
  var url, group, sessionKey, _ref18$host, host, target, type, voice, messageChain;

  return regeneratorRuntime.async(function sendVoiceMessage$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          url = _ref18.url, group = _ref18.group, sessionKey = _ref18.sessionKey, _ref18$host = _ref18.host, host = _ref18$host === void 0 ? 8080 : _ref18$host;
          target = group, type = 'group';
          _context10.next = 4;
          return regeneratorRuntime.awrap(uploadVoice({
            url: url,
            type: type,
            sessionKey: sessionKey,
            host: host
          }));

        case 4:
          voice = _context10.sent;
          messageChain = [Voice(voice)];
          return _context10.abrupt("return", sendGroupMessage({
            messageChain: messageChain,
            target: target,
            sessionKey: sessionKey,
            host: host
          }));

        case 7:
        case "end":
          return _context10.stop();
      }
    }
  });
};

var sendFlashImageMessage = function sendFlashImageMessage(_ref19) {
  var url, qq, group, sessionKey, _ref19$host, host, type, send, target, image, messageChain;

  return regeneratorRuntime.async(function sendFlashImageMessage$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          url = _ref19.url, qq = _ref19.qq, group = _ref19.group, sessionKey = _ref19.sessionKey, _ref19$host = _ref19.host, host = _ref19$host === void 0 ? 8080 : _ref19$host;

          if (!qq) {
            _context11.next = 7;
            break;
          }

          type = 'friend';
          send = sendFriendMessage;
          target = qq;
          _context11.next = 14;
          break;

        case 7:
          if (!group) {
            _context11.next = 13;
            break;
          }

          type = 'group';
          send = sendGroupMessage;
          target = group;
          _context11.next = 14;
          break;

        case 13:
          return _context11.abrupt("return", console.error('Error @ sendImageMessage: you should provide qq or group'));

        case 14:
          _context11.next = 16;
          return regeneratorRuntime.awrap(uploadImage({
            url: url,
            type: type,
            sessionKey: sessionKey,
            host: host
          }));

        case 16:
          image = _context11.sent;
          messageChain = [FlashImage(image)];
          return _context11.abrupt("return", send({
            messageChain: messageChain,
            target: target,
            sessionKey: sessionKey,
            host: host
          }));

        case 19:
        case "end":
          return _context11.stop();
      }
    }
  });
};

module.exports = {
  sendFriendMessage: sendFriendMessage,
  sendQuotedFriendMessage: sendQuotedFriendMessage,
  sendGroupMessage: sendGroupMessage,
  sendQuotedGroupMessage: sendQuotedGroupMessage,
  sendTempMessage: sendTempMessage,
  sendQuotedTempMessage: sendQuotedTempMessage,
  uploadImage: uploadImage,
  uploadVoice: uploadVoice,
  sendImageMessage: sendImageMessage,
  sendVoiceMessage: sendVoiceMessage,
  sendFlashImageMessage: sendFlashImageMessage
};