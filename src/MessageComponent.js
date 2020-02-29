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

const Image = imageId => {
  return {
    type: 'Image',
    imageId,
  };
};
Image.value = image => image.imageId;

const Xml = xml => {
  return {
    type: 'Xml',
    xml,
  };
};
Xml.value = xml => xml.xml;

module.exports = {
  Plain,
  At,
  AtAll,
  Face,
  Image,
  Xml,
};
