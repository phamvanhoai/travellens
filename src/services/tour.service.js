const BaseService = require('./base.service');
const tourModel = require('../models/tour.model');
const tourDestinationModel = require('../models/tourDestination.model');
const tourCategoryModel = require('../models/tourCategory.model');
const travelDestinationModel = require('../models/travelDestination.model');
const tourContentItemModel = require('../models/tourContentItem.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');
const { removeUploadedFile } = require('../utils/uploadedFile');

class TourService extends BaseService {
  async viewTourList(query = {}) {
    return this.model.findAllForAdminView(query);
  }

  async viewTourDetail(id) {
    const item = await this.model.findDetailForAdminView(id);
    if (!item) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Tour Not Found');
    }
    return item;
  }

  async publicList(query = {}) {
    return this.model.findAllForAdminView({
      ...query,
      status: 'active',
    });
  }

  async publicDetail(id) {
    const item = await this.model.findDetailForAdminView(id);
    if (!item || item.status !== 'active') {
      throw new ApiError(httpStatus.NOT_FOUND, 'Tour Not Found');
    }
    return item;
  }

  async create(payload) {
    this.normalizeAliases(payload);
    await this.applyContentItems(payload);
    this.validateDestinationList(payload.destinations);

    const client = await this.model.getClient();
    try {
      await client.query('BEGIN');
      await this.ensureTourCategoryExists(payload.tour_category_id, client);
      await this.ensureDestinationsExist(payload.destinations, client);
      await this.ensureTourNameIsUnique(payload.name, null, client);
      payload.slug = await this.resolveUniqueSlug(payload.slug || payload.name, null, client);
      this.validateTourRules(payload);

      const tour = await this.model.createTour(payload, client);
      await tourDestinationModel.replaceForTour(tour.tour_id, payload.destinations, client);

      await client.query('COMMIT');
      return { tour_id: tour.tour_id };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async update(id, payload) {
    this.normalizeAliases(payload);
    await this.applyContentItems(payload);
    if (payload.destinations) {
      this.validateDestinationList(payload.destinations);
    }

    const client = await this.model.getClient();
    try {
      await client.query('BEGIN');

      const existingTour = await this.model.findRawById(id, client);
      if (!existingTour) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Tour Not Found');
      }

      if (payload.tour_category_id !== undefined) {
        await this.ensureTourCategoryExists(payload.tour_category_id, client);
      }

      if (payload.destinations) {
        await this.ensureDestinationsExist(payload.destinations, client);
      }

      if (payload.name !== undefined) {
        await this.ensureTourNameIsUnique(payload.name, id, client);
      }

      if (payload.slug !== undefined) {
        payload.slug = await this.resolveUniqueSlug(payload.slug, id, client);
      }

      this.validateTourRules({ ...existingTour, ...payload });

      if (payload.capacity !== undefined) {
        const bookedSlots = await this.model.countBookedSlots(id, client);
        if (Number(payload.capacity) < bookedSlots) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'Capacity cannot be lower than current booked slots.');
        }
      }

      const tour = await this.model.updateTour(id, payload, client);
      if (!tour) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Tour Not Found');
      }

      if (payload.destinations) {
        await tourDestinationModel.replaceForTour(id, payload.destinations, client);
      }

      await client.query('COMMIT');

      if (
        payload.thumbnail
        && existingTour.thumbnail
        && existingTour.thumbnail !== payload.thumbnail
      ) {
        await removeUploadedFile(existingTour.thumbnail);
      }

      return { tour_id: Number(id) };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async remove(id) {
    const client = await this.model.getClient();
    try {
      await client.query('BEGIN');

      const existingTour = await this.model.findRawById(id, client);
      if (!existingTour) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Tour Not Found');
      }

      const activeBookings = await this.model.countActiveBookings(id, client);
      if (activeBookings > 0) {
        throw new ApiError(httpStatus.CONFLICT, 'Cannot delete tour because it has active bookings');
      }

      await this.model.softDelete(id, client);
      await client.query('COMMIT');

      await removeUploadedFile(existingTour.thumbnail);

      return { tour_id: Number(id) };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  validateDestinationList(destinations) {
    const destinationIds = new Set();
    const orderIndexes = new Set();

    for (const destination of destinations) {
      if (destinationIds.has(destination.destination_id)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Duplicate destination_id inside one tour is not allowed');
      }
      if (orderIndexes.has(destination.order_index)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'order_index must be unique inside one tour');
      }

      destinationIds.add(destination.destination_id);
      orderIndexes.add(destination.order_index);
    }
  }

  async ensureTourCategoryExists(tourCategoryId, client) {
    const exists = await tourCategoryModel.exists(tourCategoryId, client);
    if (!exists) {
      throw new ApiError(httpStatus.NOT_FOUND, 'TourCategory Not Found');
    }
  }

  async ensureDestinationsExist(destinations, client) {
    const destinationIds = destinations.map((destination) => destination.destination_id);
    const existingIds = await travelDestinationModel.findExistingActiveIds(destinationIds, client);
    if (existingIds.length !== destinationIds.length) {
      throw new ApiError(httpStatus.NOT_FOUND, 'TravelDestination Not Found');
    }
  }

  async ensureTourNameIsUnique(name, excludeTourId, client) {
    const existingTour = await this.model.findByName(name, excludeTourId, client);
    if (existingTour) {
      throw new ApiError(httpStatus.CONFLICT, 'Duplicate Tour');
    }
  }

  slugify(value) {
    const slug = String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 240);
    return slug || 'tour';
  }

  async resolveUniqueSlug(value, excludeTourId, client) {
    const base = this.slugify(value);
    let candidate = base;
    let suffix = 2;
    while (await this.model.findBySlug(candidate, excludeTourId, client)) {
      candidate = `${base.slice(0, 245)}-${suffix}`;
      suffix += 1;
    }
    return candidate;
  }

  validateTourRules(tour) {
    if (tour.maximum_booking != null && Number(tour.maximum_booking) < Number(tour.minimum_booking || 1)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'maximum_booking cannot be lower than minimum_booking');
    }
    if (tour.capacity != null && Number(tour.minimum_participants || 1) > Number(tour.capacity)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'minimum_participants cannot exceed capacity');
    }
    if (tour.capacity != null && tour.maximum_booking != null && Number(tour.maximum_booking) > Number(tour.capacity)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'maximum_booking cannot exceed capacity');
    }
  }

  normalizeAliases(payload) {
    if (payload.thumbnail_url !== undefined && payload.thumbnail === undefined) {
      payload.thumbnail = payload.thumbnail_url;
    }
    delete payload.thumbnail_url;
    this.normalizeOrderedCollection(payload, 'faqs', 'faq_id');
    this.normalizeOrderedCollection(payload, 'gallery', 'media_id');
  }

  normalizeOrderedCollection(payload, field, idField) {
    if (!Array.isArray(payload[field])) return;
    const orderIndexes = new Set();
    payload[field] = [...payload[field]]
      .sort((left, right) => Number(left.order_index) - Number(right.order_index))
      .map((item, index) => {
        if (orderIndexes.has(item.order_index)) {
          throw new ApiError(httpStatus.BAD_REQUEST, `${field}.order_index must be unique`);
        }
        orderIndexes.add(item.order_index);
        return {
          ...item,
          [idField]: item[idField] || index + 1,
        };
      });
  }

  async applyContentItems(payload) {
    if (!payload.content_item_ids) return;
    const ids = payload.content_item_ids;
    delete payload.content_item_ids;
    if (!ids.length) return;

    const items = await tourContentItemModel.findActiveByIds(ids);
    if (items.length !== ids.length) {
      throw new ApiError(httpStatus.NOT_FOUND, 'One or more active tour content items were not found');
    }

    const listFields = {
      highlight: 'highlights',
      requirement: 'requirements',
      inclusion: 'inclusions',
      exclusion: 'exclusions',
    };
    const scalarFields = new Set(['booking_policy', 'cancellation_policy', 'additional_information']);
    const selectedScalars = new Set();
    const explicitScalars = new Set([...scalarFields].filter((field) => payload[field] !== undefined));

    for (const item of items) {
      const listField = listFields[item.type];
      if (listField) {
        payload[listField] = [...new Set([...(payload[listField] || []), item.content])];
        continue;
      }
      if (scalarFields.has(item.type)) {
        if (selectedScalars.has(item.type)) {
          throw new ApiError(httpStatus.BAD_REQUEST, `Select only one ${item.type} item`);
        }
        selectedScalars.add(item.type);
        if (!explicitScalars.has(item.type)) payload[item.type] = item.content;
      }
    }
  }
}

module.exports = new TourService(tourModel);
