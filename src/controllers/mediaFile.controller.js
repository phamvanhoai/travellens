const mediaFileService = require('../services/mediaFile.service');
const asyncHandler = require('../utils/asyncHandler');
const { httpStatus } = require('../constants');

module.exports = {
  list: asyncHandler(async (req, res) => {
    const data = await mediaFileService.list(req.query);
    res.json({ success: true, message: 'Media files retrieved successfully', data });
  }),

  get: asyncHandler(async (req, res) => {
    const data = await mediaFileService.get(req.params.id);
    res.json({ success: true, message: 'Media file retrieved successfully', data });
  }),

  upload: asyncHandler(async (req, res) => {
    const data = await mediaFileService.upload(req.user.sub, req.file, req.body.file_url);
    res.status(httpStatus.CREATED).json({ success: true, message: 'Media file uploaded successfully', data });
  }),

  update: asyncHandler(async (req, res) => {
    const data = await mediaFileService.update(req.params.id, req.body);
    res.json({ success: true, message: 'Media file name updated successfully', data });
  }),

  remove: asyncHandler(async (req, res) => {
    const data = await mediaFileService.remove(req.params.id);
    res.json({ success: true, message: 'Media file deleted successfully', data });
  }),
};
