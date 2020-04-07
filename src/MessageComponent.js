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
};
