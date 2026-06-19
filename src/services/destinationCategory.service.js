const BaseService = require('./base.service');
const destinationCategoryModel = require('../models/destinationCategory.model');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

class DestinationCategoryService extends BaseService {
  async remove(id) {
    await this.get(id);

    const totalDestinations = await this.model.countActiveDestinations(id);
    if (totalDestinations > 0) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'Cannot delete destination category because it has linked travel destinations',
        { total_destinations: totalDestinations }
      );
    }

    return super.remove(id);
  }
}

module.exports = new DestinationCategoryService(destinationCategoryModel);

