const mediaFileModel = require('../models/mediaFile.model');
const richTextContent = require('../utils/richTextContent');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

class RichTextService {
  async prepare(content, subject = 'Content') {
    const sanitizedContent = richTextContent.sanitize(content);
    const imageUrls = richTextContent.extractImageUrls(sanitizedContent);

    if (!imageUrls.length) {
      return sanitizedContent;
    }

    const activeUrls = await mediaFileModel.findActiveUrls(imageUrls);
    const activeUrlSet = new Set(activeUrls);
    const invalidUrls = imageUrls.filter((url) => !activeUrlSet.has(url));

    if (invalidUrls.length) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `${subject} contains images that are not available in Media Manager`,
        { invalid_image_urls: invalidUrls }
      );
    }

    return sanitizedContent;
  }
}

module.exports = new RichTextService();
