const mediaFileModel = require('../models/mediaFile.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

class MediaFileService {
  list(query) {
    return mediaFileModel.list(query);
  }

  async get(id) {
    const media = await mediaFileModel.findById(id);
    if (!media) throw new ApiError(httpStatus.NOT_FOUND, 'Media file not found');
    return media;
  }

  async upload(userId, file, fileUrl) {
    if (!file || !fileUrl) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'file is required');
    }

    return mediaFileModel.create({
      uploaded_by: userId,
      original_name: file.originalname,
      file_name: file.filename || fileUrl.split('/').pop(),
      file_url: fileUrl,
      mime_type: file.mimetype,
      file_size: file.size,
    });
  }

  async update(id, payload) {
    const media = await mediaFileModel.updateOriginalName(id, payload.original_name);
    if (!media) throw new ApiError(httpStatus.NOT_FOUND, 'Media file not found');
    return media;
  }

  async remove(id) {
    const media = await this.get(id);
    const usedBy = await mediaFileModel.findBlogUsage(media.file_url);
    if (usedBy.length) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'Media file is being used by one or more blogs',
        { blogs: usedBy }
      );
    }

    return mediaFileModel.softDelete(id);
  }
}

module.exports = new MediaFileService();
