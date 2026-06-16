const fs = require('fs/promises');
const path = require('path');
const objectStorage = require('../services/objectStorage.service');

const publicDir = path.resolve(__dirname, '..', '..', 'public');

const resolveLocalPublicPath = (fileUrl) => {
  if (!fileUrl || typeof fileUrl !== 'string' || !fileUrl.startsWith('/public/')) {
    return null;
  }

  const relativePath = fileUrl.replace('/public/', '');
  const filePath = path.resolve(publicDir, relativePath);

  if (!filePath.startsWith(`${publicDir}${path.sep}`)) {
    return null;
  }

  return filePath;
};

const removeUploadedFile = async (fileUrl) => {
  if (!fileUrl) {
    return false;
  }

  if (await objectStorage.deleteFileByUrl(fileUrl)) {
    return true;
  }

  const filePath = resolveLocalPublicPath(fileUrl);
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

const removeUploadedFiles = async (fileUrls = []) => {
  const uniqueUrls = [...new Set(fileUrls.filter(Boolean))];
  await Promise.all(uniqueUrls.map((fileUrl) => removeUploadedFile(fileUrl)));
};

module.exports = {
  removeUploadedFile,
  removeUploadedFiles,
};
