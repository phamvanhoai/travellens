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

  async listNavigationTargets(view360Id) {
    await this.ensureViewExists(view360Id);
    return view360Model.findNavigationTargets(view360Id);
  }

  async createForView(view360Id, payload) {
    await this.ensureViewExists(view360Id);
    await this.ensureNavigationTargetAllowed(view360Id, payload);
    return view360HotspotModel.createForView(view360Id, this.normalizePayload(payload));
  }

  async update(hotspotId, payload) {
    const current = await this.get(hotspotId);
    const effectivePayload = { ...current, ...payload };
    await this.ensureNavigationTargetAllowed(current.view360_id, effectivePayload);

    const hotspot = await view360HotspotModel.updateActive(
      hotspotId,
      this.normalizePayload(payload, effectivePayload.type)
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

  normalizePayload(payload = {}, effectiveType = payload.type) {
    const nextPayload = { ...payload };
    if (effectiveType !== 'navigation') nextPayload.target_view360_id = null;
    if (effectiveType !== 'link') nextPayload.target_url = null;
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

  async ensureNavigationTargetAllowed(view360Id, payload) {
    if (payload.type !== 'navigation') return null;
    if (!payload.target_view360_id) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Target scene is required for a navigation hotspot');
    }
    const allowed = await view360Model.isNavigationTargetInSameDestination(view360Id, payload.target_view360_id);
    if (!allowed) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Navigation target must belong to the same destination');
    }
    return true;
  }
}

module.exports = new View360HotspotService();
