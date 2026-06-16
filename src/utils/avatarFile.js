const fs = require('fs/promises');
const path = require('path');
const objectStorage = require('../services/objectStorage.service');

const userAvatarDir = path.resolve(__dirname, '..', '..', 'public', 'users');

const resolveLocalUserAvatarPath = (avatarUrl) => {
  if (!avatarUrl || typeof avatarUrl !== 'string' || !avatarUrl.startsWith('/public/users/')) {
    return null;
  }

  const relativePath = avatarUrl.replace('/public/users/', '');
  const filePath = path.resolve(userAvatarDir, relativePath);

  if (!filePath.startsWith(`${userAvatarDir}${path.sep}`)) {
    return null;
  }

  return filePath;
};

const removeLocalUserAvatar = async (avatarUrl) => {
  const filePath = resolveLocalUserAvatarPath(avatarUrl);
  if (!filePath) {
    return false;
  }

  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false;
    }

    throw error;
  }
};

const removeUserAvatar = async (avatarUrl) => {
  if (await objectStorage.deleteFileByUrl(avatarUrl)) {
    return true;
  }

  return removeLocalUserAvatar(avatarUrl);
};

module.exports = {
  removeLocalUserAvatar,
  removeUserAvatar,
};
