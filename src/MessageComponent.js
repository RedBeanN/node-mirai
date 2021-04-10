const Source = id => {
  return {
    type: 'Source',
    id,
  };
};
Source.value = source => {
  return {
    id: source.id,
    time: source.time,
  };
};

const Plain = text => {
  return {
    type: 'Plain',
    text,
  };
};
Plain.value = plain => plain.text;

const At = target => {
  return {
    type: 'At',
    target,
  };
};
At.value = at => {
  return {
    target: at.target,
    display: at.display,
  };
};

const AtAll = () => {
  return {
    type: 'AtAll',
  };
};
AtAll.value = () => {};

const Face = faceId => {
  return {
    type: 'Face',
    faceId,
  };
};
Face.value = face => face.faceId;

const Image = ({ imageId, url = '' }) => {
  return {
    type: 'Image',
    imageId,
    url,
  };
};
Image.value = image => {
  return {
    imageId: image.imageId,
    url: image.url,
  };
};

const FlashImage = ({ imageId, url = '' }) => {
  return {
    type: 'FlashImage',
    imageId,
    url,
  };
};
FlashImage.value = image => {
  return {
    imageId: image.imageId,
    url: image.url,
  };
};

const Xml = xml => {
  return {
    type: 'Xml',
    xml,
  };
};
Xml.value = xml => xml.xml;

const Json = json => {
  return {
    type: 'Json',
    json,
  };
};
Json.value = json => json.json;

const App = content => {
  return {
    type: 'App',
    content,
  };
};
App.value = app => app.content;

const Quote = id => {
  return {
    type: 'Quote',
    id,
  };
};
Quote.value = quote => {
  return {
    id: quote.id,
    groupId: quote.groupId,
    senderId: quote.senderId,
    origin: quote.origin,
  };
};

const Poke = name => {
  return {
    type: 'Poke',
    name,
  };
};
Poke.value = poke => poke.name;

const Voice = ({ voiceId, url = '' }) => {
  return {
    type: 'Voice',
    voiceId,
    url
  };
};
Voice.value = voice => {
  return {
    voiceId: voice.voiceId,
    url: voice.url
  }
};

// Experimental
// refer: https://github.com/mamoe/mirai/blob/master/docs/mirai-code-specification.md
const toMiraiCode = component => {
  switch (component.type) {
    case 'Plain':
      return Plain.value(component);
    case 'AtAll':
      return '[mirai:atall]';
    case 'At':
      return `[mirai:at:${component.target},${component.display}]`;
    case 'Face':
      return `[mirai:face:${component.id}]`;
    case 'Poke':
      return `[mirai:poke:${component.name},${component.type},${component.id}]`;
    case 'VipFace':
      // TODO: 当前版本(http-api1.7.2)尚未支持 VipFace 消息
      // return `[mirai:vipface:${component.id},${component.name},${component.count}]`;
      break;
    case 'Image':
      return `[mirai:image:${component.imageId}]`;
    case 'Voice':
      return `[mirai:voice:${component.voiceId}]`;
    case 'FlashImage':
      return `[mirai:flash:${component.imageId}]`;
  }
  throw new Error(`Type ${component.type} is not yet supported`);
};

// TODO:
const parseMiraiCode = code => {};

module.exports = {
  Source,
  Plain,
  At,
  AtAll,
  Face,
  Image,
  FlashImage,
  Xml,
  Json,
  App,
  Quote,
  Poke,
  Voice,
  toMiraiCode,
  parseMiraiCode,
};
