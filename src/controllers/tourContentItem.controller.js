const service = require('../services/tourContentItem.service');
const asyncHandler = require('../utils/asyncHandler');
const { httpStatus } = require('../constants');

module.exports = {
  list: asyncHandler(async (req, res) => {
    const result = await service.list(req.query);
    res.json({
      success: true,
      data: result.items,
      meta: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        total_pages: result.pagination.totalPages,
      },
    });
  }),
  get: asyncHandler(async (req, res) => res.json({ success: true, data: await service.get(req.params.id) })),
  create: asyncHandler(async (req, res) => res.status(httpStatus.CREATED).json({
    success: true, message: 'Tour content item created successfully', data: await service.create(req.body),
  })),
  bulkCreate: asyncHandler(async (req, res) => res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Tour content items created successfully',
    data: (await service.bulkCreate(req.body)).map((item) => ({
      id: item.content_item_id,
      content_item_id: item.content_item_id,
      type: item.type,
      content: item.content,
      status: item.status,
    })),
  })),
  update: asyncHandler(async (req, res) => res.json({
    success: true, message: 'Tour content item updated successfully', data: await service.update(req.params.id, req.body),
  })),
  remove: asyncHandler(async (req, res) => res.json({
    success: true, message: 'Tour content item deleted successfully', data: await service.remove(req.params.id),
  })),
};
