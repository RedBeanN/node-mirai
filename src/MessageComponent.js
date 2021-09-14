/**
 * @typedef { import('./typedef').MessageChain } MessageChain
 * 
 * @typedef { Object } source
 * @property { number } id
 * @property { number } time
 * 
 * @typedef { Object } at
 * @property { number } target
 * @property { string } display
 * 
 * @typedef { Object } image
 * @property { string } imageId
 * @property { string } url
 * 
 * @typedef { Object } voice
 * @property { string } voiceId
 * @property { string } url
 * 
 * @typedef { Object } quote
 * @property { number } id
 * @property { number } [groupId]
 * @property { number } [senderId]
 * @property { MessageChain[] } [origin]
 */

/**
 * @function Source
 * @param { number } id
 * @returns { MessageChain }
 */
const Source = id => {
  return {
    type: 'Source',
    id,
  };
};
/**
 * @method Source#value
 * @param { MessageChain } source
 * @returns { source }
 */
Source.value = source => {
  return {
    id: source.id,
    time: source.time,
  };
};

/**
 * @function Plain
 * @param { string } text
 * @returns { MessageChain }
 */
const Plain = text => {
  return {
    type: 'Plain',
    text,
  };
};
/**
 * @method Plain#value
 * @param { MessageChain } plain
 * @returns { string }
 */
Plain.value = plain => plain.text;

/**
 * @function At
 * @param { number } target
 * @returns { MessageChain }
 */
const At = target => {
  return {
    type: 'At',
    target,
  };
};
/**
 * @method At#value
 * @param { MessageChain } at
 * @returns { at }
 */
At.value = at => {
  return {
    target: at.target,
    display: at.display,
  };
};

/**
 * @function AtAll
 * @returns { MessageChain }
 */
const AtAll = () => {
  return {
    type: 'AtAll',
  };
};
/**
 * @method AtAll#value
 * @returns { undefined }
 */
AtAll.value = () => {};

/**
 * @function Face
 * @param { number } faceId
 * @returns { MessageChain }
 */
const Face = faceId => {
  return {
    type: 'Face',
    faceId,
  };
};
/**
 * @method Face#value
 * @param { MessageChain } face
 * @returns { number }
 */
Face.value = face => face.faceId;

/**
 * @function Image
 * @param { image } image
 * @returns { MessageChain }
 */
const Image = ({ imageId, url = '' }) => {
  return {
    type: 'Image',
    imageId,
    url,
  };
};
/**
 * @method Image#value
 * @param { MessageChain } image
 * @returns { image }
 */
Image.value = image => {
  return {
    imageId: image.imageId,
    url: image.url,
  };
};

/**
 * @function FlashImage
 * @param { image } image
 * @returns { MessageChain }
 */
const FlashImage = ({ imageId, url = '' }) => {
  return {
    type: 'FlashImage',
    imageId,
    url,
  };
};
/**
 * @method FlashImage#value
 * @param { MessageChain } image
 * @returns { image }
 */
FlashImage.value = image => {
  return {
    imageId: image.imageId,
    url: image.url,
  };
};

/**
 * @function Xml
 * @param { string } xml
 * @returns { MessageChain }
 */
const Xml = xml => {
  return {
    type: 'Xml',
    xml,
  };
};
/**
 * @method Xml#value
 * @param { MessageChain } xml
 * @returns { string }
 */
Xml.value = xml => xml.xml;

/**
 * @function Json
 * @param { string } json
 * @returns { MessageChain }
 */
const Json = json => {
  return {
    type: 'Json',
    json,
  };
};
/**
 * @method Json#value
 * @param { MessageChain } json
 * @returns { string }
 */
Json.value = json => json.json;

/**
 * @function App
 * @param { string } content
 * @returns { MessageChain }
 */
const App = content => {
  return {
    type: 'App',
    content,
  };
};
/**
 * @method App#value
 * @param { MessageChain } app
 * @returns { string }
 */
App.value = app => app.content;

/**
 * @function Quote
 * @param { number } id
 * @returns { MessageChain }
 */
const Quote = id => {
  return {
    type: 'Quote',
    id,
  };
};
/**
 * @method Quote#value
 * @param { quote } quote
 * @returns { MessageChain }
 */
Quote.value = quote => {
  return {
    id: quote.id,
    groupId: quote.groupId,
    senderId: quote.senderId,
    origin: quote.origin,
  };
};

/**
 * @function Poke
 * @param { string } name
 * @returns { MessageChain }
 */
const Poke = name => {
  return {
    type: 'Poke',
    name,
  };
};
/**
 * @method Poke#value
 * @param { MessageChain } poke
 * @returns { string }
 */
Poke.value = poke => poke.name;

/**
 * @function Voice
 * @param { voice } voice
 * @returns { MessageChain }
 */
const Voice = ({ voiceId, url = '' }) => {
  return {
    type: 'Voice',
    voiceId,
    url
  };
};
/**
 * @method Voice#value
 * @param { MessageChain } voice
 * @returns { voice }
 */
Voice.value = voice => {
  return {
    voiceId: voice.voiceId,
    url: voice.url
  }
};
// Voice is deprecated since miria-core-2.7
// TODO: Deprecate Voice and use Audio instead
const Audio = Voice;

// TODO: Impl: File Dice MusicShare MiraiCode

// Experimental
// refer: https://github.com/mamoe/mirai/blob/dev/docs/Messages.md#%E6%B6%88%E6%81%AF%E9%93%BE%E7%9A%84-mirai-%E7%A0%81
/**
 * @function toMiraiCode
 * @param { MessageChain } component
 * @returns { string }
 */
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
/**
 * @todo
 * @function parseMiraiCode
 * @param { string } code
 * @returns { MessageChain }
 */
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
  Audio,
  toMiraiCode,
  parseMiraiCode,
};
