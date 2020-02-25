const Plain = text => {
  return {
    type: 'Plain',
    text,
  };
}

const At = target => {
  return {
    type: 'At',
    target,
  };
};

const AtAll = () => {
  return {
    type: 'AtAll',
  };
};

const Face = faceId => {
  return {
    type: 'Face',
    faceId,
  };
};

const Image = imageId => {
  return {
    type: 'Image',
    imageId,
  };
};

const Xml = xml => {
  return {
    type: 'Xml',
    xml,
  };
};

module.exports = {
  Plain,
  At,
  AtAll,
  Face,
  Image,
  Xml,
};
