/**
 * @typedef { import('./typedef').MessageChain } MessageChain
 * @typedef { import('./typedef').message } message
 * 
 * @typedef { Object } source
 * @property { number } id
 * @property { number } time
 * 
 * @typedef { Object } at
 * @property { number } target
 * @property { string } [display]
 * 
 * @typedef { Object } image
 * @property { string } [imageId]
 * @property { string } [url]
 * 
 * @typedef { Object } voice
 * @property { string } voiceId
 * @property { string } [url]
 * 
 * @typedef { Object } quote
 * @property { number } id
 * @property { number } [groupId]
 * @property { number } [senderId]
 * @property { MessageChain[] } [origin]
 * 
 * @typedef { Object } music
 * @property { 'QQMusic'|'NeteaseCloudMusic'|'MiguMusic'|'KugouMusic'|'KuwoMusic' } kind
 * @property { string } title
 * @property { string } summary
 * @property { string } jumpUrl
 * @property { string } pictureUrl
 * @property { string } musicUrl
 * @property { string } [brief]
 * 
 * @typedef { Object } ForwardNode
 * @property { number } senderId
 * @property { number } time
 * @property { string } senderName
 * @property { MessageChain[] } [messageChain]
 * @property { number } [messageId]
 * @typedef { Array<ForwardNode> } nodeList
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
 * @function MarketFace
 * @param { string } name
 * @returns { MessageChain }
 */
const MarketFace = name => {
  return {
    type: 'MarketFace',
    name,
  };
};
/**
 * @function MarketFace#value
 * @param { MessageChain } face
 * @returns { string }
 */
MarketFace.value = face => face.name;

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
 * @param { MessageChain } quote
 * @returns { quote }
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

/**
 * @function MusicShare
 * @param { music } music
 * @returns { MessageChain }
 */
const MusicShare = ({
  kind,
  title,
  summary,
  jumpUrl,
  pictureUrl,
  musicUrl,
  brief,
}) => {
  return {
    type: 'MusicShare',
    kind, title, summary, jumpUrl, pictureUrl, musicUrl,
    brief: brief || `[分享]${title}`,
  };
};
// seems this is unnecessary
MusicShare.value = () => {};

/**
 * @function Dice
 * @param { number } value 骰子点数
 * @returns { MessageChain }
 */
const Dice = (value) => {
  return {
    type: 'Dice',
    value,
  };
};
/**
 * @method Dice#value
 * @param { MessageChain } dice
 * @returns { number }
 */
Dice.value = dice => {
  return dice.value;
};

/**
 * @function Forward 转发消息
 * @param { nodeList | message[] | number[] } messages 可以传入消息数组、消息ID数组或自行构建`nodeList`，三者可以混合
 * @returns { MessageChain }
 */
const Forward = (messages) => {
  if (!Array.isArray(messages)) throw new Error('messages must be array')
  const nodeList = messages.map(/** @param {ForwardNode|message|number} msg */msg => {
    // 消息ID可以直接作为节点
    if (typeof msg === 'number') {
      return { messageId: msg };
    }
    if (msg.sender) {
      /** @type { message } */
      const time = msg.messageChain[0].type === 'Source' ? msg.messageChain[0].time : 0;
      return {
        senderId: msg.sender.id,
        time: 0,
        senderName: msg.sender.memberName || msg.sender.nickname,
        messageChain: msg.messageChain,
        messageId: null
      };
    }
    /** @see https://github.com/project-mirai/mirai-api-http/issues/482 */
    return Object.assign({ messageId: null }, msg);
  })
  return {
    type: 'Forward',
    nodeList,
  };
};
/**
 * @function Forward#value
 * @param { MessageChain } forward
 * @returns { nodeList }
 */
Forward.value = forward => {
  return forward.nodeList;
};

// TODO: Impl: File MiraiCode

const encodeText = (text = '') => {
  return text
    .replace(/\\/g, '\\\\') // This must be first since others will add `\`
    .replace(/\[/g, '\\[')
    .replace(/]/g, '\\]')
    .replace(/:/g, '\\:')
    .replace(/,/g, '\\,')
    // .replace(/\n/g, '\\n')
    // .replace(/\r/g, '\\r')
};
const decodeText = (text = '') => {
  // Better use reverted order as `encodeText` does
  return text
    // .replace(/\\r/g, '\r')
    // .replace(/\\n/g, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\:/g, ':')
    .replace(/\\]/g, ']')
    .replace(/\\\[/g, '[')
    .replace(/\\\\/g, '\\')
};

// Experimental
// refer: https://github.com/mamoe/mirai/blob/dev/docs/Messages.md#%E6%B6%88%E6%81%AF%E9%93%BE%E7%9A%84-mirai-%E7%A0%81
/**
 * @function toMiraiCode
 * @param { MessageChain } component
 * @returns { string }
 * @throws { TypeError }
 */
const toMiraiCode = component => {
  switch (component.type) {
    case 'Plain':
      return encodeText(component.text);
    case 'AtAll':
      return '[mirai:atall]';
    case 'At':
      return `[mirai:at:${component.target}]`;
    case 'Face':
      return `[mirai:face:${component.faceId}]`;
    case 'MarketFace':
      return `[mirai:market:${encodeText(component.name)}]`;
    case 'Poke':
      // This is from mirai-api-http, not from mirai-core, so there is no `type` or `id`
      return `[mirai:poke:${encodeText(component.name)}]`;
    case 'VipFace':
      // TODO: 当前版本(http-api1.7.2)尚未支持 VipFace 消息
      // return `[mirai:vipface:${component.id},${component.name},${component.count}]`;
      break;
    case 'Image':
      // 可以加参数，但是旧版本不支持，并且发送图片不用自带这些参数
      // return `[mirai:image:${encodeText(component.imageId)},size=${component.size},type=${component.imageType},width=${component.width},height=${component.height},isEmoji=${component.isEmoji}]`;
      return `[mirai:image:${encodeText(component.imageId)}]`;
    case 'Voice':
      return `[mirai:voice:${component.voiceId}]`;
    case 'FlashImage':
      return `[mirai:flash:${encodeText(component.imageId)}]`;
    case 'Dice':
      return `[mirai:dice:${component.value}]`;
    case 'Quote':
      return `[mirai:quote:${component.id}]`;
    case 'Forward':
      return `[mirai:forward:${encodeText(JSON.stringify(component.nodeList))}]`;
    case 'App':
      return `[mirai:app:${encodeText(component.content)}]`;
    case 'Xml':
      return `[mirai:xml:${encodeText(component.xml)}]`;
    case 'File':
      return `[mirai:file:${encodeText(component.id)},${encodeText(component.name)},${component.size}]`;
    case 'MusicShare':
      const args = [
        component.kind,
        component.title,
        component.summary,
        component.jumpUrl,
        component.pictureUrl,
        component.musicUrl,
        component.brief,
      ].map(str => encodeText(str)).join(',')
      return `[mirai:musicshare:${args}]`;
  }
  throw new TypeError(`Type ${component.type} is not yet supported`);
};

/**
 * @function serialize
 * @description Stringify message components to mirai code string
 * @param { MessageChain[] } messageChain
 * @returns { string }
 */
const serialize = messageChain => {
  return messageChain.reduce((str, chain) => {
    if (chain.type === 'Source') return str;
    try {
      return str + toMiraiCode(chain);
    } catch (e) {
      // Maybe fall back to a common component `[mirai:type]`?
      // return str + `[mirai:${chain.type}]`;
      console.warn(`Unsupported message type ${chain.type} is skipped. This may cause some errors.`, e.message || e);
      return str;
    }
  }, '');
};

// TODO:
/**
 * @function deserialize
 * @description Parse serialized mirai code string to message components
 * @param { string } string
 * @returns { MessageChain[] }
 */
const deserialize = string => {
  // Split from `[` or `]`, but not `\\[` or `\\]`
  // Even items are plain texts, and odd items are components starts like `mirai:type[:args]`
  const codes = string.split(/(?<!\\)[\[\]]/);
  // console.log(codes);
  /** @type { MessageChain[] } */
  return codes.map((c, index) => {
    if (index % 2) {
      // Is message component
      if (!c.startsWith('mirai:')) throw new Error(`Invalid serialized mirai code [${c}]`);
      const [_, type, ...args] = c.split(':');
      const arguments = args.join(':').split(/(?<!\\),/).map(decodeText);
      // Usually we only need the first arg
      const arg0 = arguments[0];
      // console.log(arg0, args);
      switch (type) {
        case 'image': return Image({ imageId: arg0 });
        case 'flash': return FlashImage({ imageId: arg0 });
        case 'at': return At(Number(arg0));
        case 'atall': return AtAll();
        case 'face': return Face(Number(arg0));
        case 'market': return MarketFace(decodeText(arg0));
        case 'poke': return Poke(decodeText(arg0));
        case 'dice': return Dice(Number(arg0));
        case 'quote': return Quote(Number(arg0));
        case 'forward': return Forward(JSON.parse(arg0));
        case 'app': return App(decodeText(arg0));
        case 'xml': return Xml(decodeText(arg0));
        case 'music': return MusicShare({
          kind: arguments[0],
          title: arguments[1],
          summary: arguments[2],
          jumpUrl: arguments[3],
          pictureUrl: arguments[4],
          musicUrl: arguments[5],
          brief: arguments[6],
        });
        // case 'file': return { type: 'File', id: arguments[0], name: arguments[1], size: Number(arguments[2]) }
        case 'vipface':
        case 'file':
          console.warn(`Type [${c}] is not yet supported`)
          return null;
        default:
          // This will be removed in `filter` below
          console.warn(`Cannot deserialize component [${c}]`);
          return null;
      }
    } else {
      // Is plain text
      if (c !== '') return Plain(decodeText(c));
      return null;
    }
  }).filter(i => i !== null);
};

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
  MusicShare,
  Dice,
  Forward,
  toMiraiCode,
  serialize,
  deserialize,
};
