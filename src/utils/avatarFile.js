const { removeUploadedFile } = require('./uploadedFile');

const removeLocalUserAvatar = async (avatarUrl) => {
  return removeUploadedFile(avatarUrl);
};

const removeUserAvatar = async (avatarUrl) => {
  return removeUploadedFile(avatarUrl);
};

module.exports = {
  removeLocalUserAvatar,
  removeUserAvatar,
};
