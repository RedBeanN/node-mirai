const Source = id => {
  return {
    type: 'Source',
    id,
  };
};
Source.value = source => source.id;

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
At.value = at => at.target;

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

const App = app => {
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
Quote.value = quote => quote.id;

module.exports = {
  Source,
  Plain,
  At,
  AtAll,
  Face,
  Image,
  Xml,
  Quote,
};
