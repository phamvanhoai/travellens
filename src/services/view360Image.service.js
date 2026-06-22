const BaseService = require('./base.service');
const view360Model = require('../models/view360.model');
const view360ImageModel = require('../models/view360Image.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');
const { removeUploadedFile } = require('../utils/uploadedFile');

class View360ImageService extends BaseService {
  list(query = {}) {
    return view360ImageModel.findAll(query);
  }

  async listByView(viewId) {
    await this.ensureViewExists(viewId);
    return view360ImageModel.findByView(viewId);
  }

  async createForView(viewId, payload) {
    await this.ensureViewExists(viewId);
    return view360ImageModel.createForView(viewId, payload);
  }

  async update(imageId, payload) {
    const currentImage = await this.get(imageId);
    const image = await view360ImageModel.updateActive(imageId, payload);

    if (!image) {
      throw new ApiError(httpStatus.NOT_FOUND, 'View360 image not found');
    }

    if (
      payload.image_file
      && currentImage.image_file
      && currentImage.image_file !== image.image_file
    ) {
      await removeUploadedFile(currentImage.image_file);
    }

    return image;
  }

  async remove(imageId) {
    const currentImage = await this.get(imageId);
    const image = await view360ImageModel.softDelete(imageId);

    if (!image) {
      throw new ApiError(httpStatus.NOT_FOUND, 'View360 image not found');
    }

    await removeUploadedFile(currentImage.image_file);
    return image;
  }

  async get(imageId) {
    const image = await view360ImageModel.findActiveById(imageId);
    if (!image) {
      throw new ApiError(httpStatus.NOT_FOUND, 'View360 image not found');
    }
    return image;
  }

  async ensureViewExists(viewId) {
    const view = await view360Model.findActiveById(viewId);
    if (!view) {
      throw new ApiError(httpStatus.NOT_FOUND, 'View360 not found');
    }
  }

  async ensureImageExists(imageId) {
    await this.get(imageId);
  }
}

module.exports = new View360ImageService(view360ImageModel);
