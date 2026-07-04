const view360HotspotModel = require('../models/view360Hotspot.model');
const view360Model = require('../models/view360.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

class View360HotspotService {
  async listPublicByView(view360Id) {
    await this.ensureViewExists(view360Id);
    return view360HotspotModel.findByView(view360Id, { activeOnly: true });
  }

  async listByView(view360Id) {
    await this.ensureViewExists(view360Id);
    return view360HotspotModel.findByView(view360Id);
  }

  async createForView(view360Id, payload) {
    await this.ensureViewExists(view360Id);
    await this.ensureTargetViewExists(payload.target_view360_id);
    return view360HotspotModel.createForView(view360Id, this.normalizePayload(payload));
  }

  async update(hotspotId, payload) {
    const current = await this.get(hotspotId);
    await this.ensureTargetViewExists(payload.target_view360_id);

    const hotspot = await view360HotspotModel.updateActive(
      hotspotId,
      this.normalizePayload(payload)
    );

    if (!hotspot) {
      throw new ApiError(httpStatus.NOT_FOUND, 'View360 hotspot not found');
    }

    return {
      ...current,
      ...hotspot,
    };
  }

  async remove(hotspotId) {
    const hotspot = await view360HotspotModel.softDelete(hotspotId);
    if (!hotspot) {
      throw new ApiError(httpStatus.NOT_FOUND, 'View360 hotspot not found');
    }
    return hotspot;
  }

  async get(hotspotId) {
    const hotspot = await view360HotspotModel.findActiveById(hotspotId);
    if (!hotspot) {
      throw new ApiError(httpStatus.NOT_FOUND, 'View360 hotspot not found');
    }
    return hotspot;
  }

  normalizePayload(payload = {}) {
    const nextPayload = { ...payload };
    if (nextPayload.title !== undefined && nextPayload.title !== null) {
      nextPayload.title = nextPayload.title.trim();
    }
    if (nextPayload.description !== undefined && nextPayload.description !== null) {
      nextPayload.description = nextPayload.description.trim();
    }
    if (nextPayload.target_url !== undefined && nextPayload.target_url !== null) {
      nextPayload.target_url = nextPayload.target_url.trim();
    }
    return nextPayload;
  }

  async ensureViewExists(view360Id) {
    const view = await view360Model.findActiveById(view360Id);
    if (!view) {
      throw new ApiError(httpStatus.NOT_FOUND, 'View360 not found');
    }
    return view;
  }

  async ensureTargetViewExists(targetView360Id) {
    if (targetView360Id === undefined || targetView360Id === null) {
      return null;
    }

    return this.ensureViewExists(targetView360Id);
  }
}

module.exports = new View360HotspotService();
