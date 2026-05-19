module.exports = (object, keys) => keys.reduce((result, key) => {
  if (Object.prototype.hasOwnProperty.call(object, key)) {
    result[key] = object[key];
  }
  return result;
}, {});

