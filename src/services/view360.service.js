const BaseService = require('./base.service');
const view360Model = require('../models/view360.model');
const locationModel = require('../models/location.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');
const { removeUploadedFile, removeUploadedFiles } = require('../utils/uploadedFile');

class View360Service extends BaseService {
  listAdmin(query = {}) {
    return view360Model.findAdminPage(query);
  }

  list(query = {}) {
    return view360Model.findAll(query);
  }

  async listByLocation(locationId) {
    await this.ensureLocationExists(locationId);
    return view360Model.findByLocation(locationId);
  }

  async createForLocation(locationId, payload) {
    await this.ensureLocationExists(locationId);
    return view360Model.createForLocation(locationId, payload);
  }

  async update(viewId, payload) {
    const currentView = await this.get(viewId);
    const view = await view360Model.updateActive(viewId, payload);

    if (!view) {
      throw new ApiError(httpStatus.NOT_FOUND, 'View360 not found');
    }

    if (
      payload.audio_file
      && currentView.audio_file
      && currentView.audio_file !== view.audio_file
    ) {
      await removeUploadedFile(currentView.audio_file);
    }

    return view;
  }

  async remove(viewId) {
    const currentView = await this.get(viewId);
    const { view, imageFiles } = await view360Model.softDeleteWithImages(viewId);

    await removeUploadedFile(currentView.audio_file);
    await removeUploadedFiles(imageFiles);

    return view;
  }

  async get(id) {
    const view = await view360Model.findActiveById(id);
    if (!view) {
      throw new ApiError(httpStatus.NOT_FOUND, 'View360 not found');
    }
    return view;
  }

  async ensureLocationExists(locationId) {
    const location = await locationModel.findActiveById(locationId);
    if (!location) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
    }
  }

  async ensureViewExists(viewId) {
    await this.get(viewId);
  }
}

module.exports = new View360Service(view360Model);
