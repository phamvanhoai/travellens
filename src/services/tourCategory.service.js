const BaseService = require('./base.service');
const tourCategoryModel = require('../models/tourCategory.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

class TourCategoryService extends BaseService {
  async remove(id) {
    await this.get(id);

    const totalTours = await this.model.countActiveTours(id);
    if (totalTours > 0) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'Cannot delete tour category because it has linked tours',
        { total_tours: totalTours }
      );
    }

    return super.remove(id);
  }
}

module.exports = new TourCategoryService(tourCategoryModel);

