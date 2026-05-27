const express = require('express');
const validate = require('../middlewares/validate.middleware');
const { handleMapUpload } = require('../middlewares/upload.middleware');
const controller = require('../controllers/map.controller');
const { common, entity, map } = require('../validators');

const router = express.Router();

/**
 * @swagger
 * /maps/travel:
 *   get:
 *     summary: Customer interactive travel map data
 *     tags: [Maps]
 *     parameters:
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *           example: 10.7769
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *           example: 106.7009
 *       - in: query
 *         name: radius
 *         description: Radius in kilometers. Requires lat and lng.
 *         schema:
 *           type: number
 *           example: 5
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           example: Historical
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *           example: Dinh
 *     responses:
 *       200:
 *         description: Travel destination and location map markers
 */
router.get('/travel', validate(map.travel), controller.travel);
router.use('/nearby', require('./nearby.route'));

router
  .route('/')
  .get(validate(map.list), controller.list)
  .post(handleMapUpload, validate({ body: entity.map }), controller.create);

router
  .route('/:id')
  .get(validate({ params: common.idParam }), controller.get)
  .put(handleMapUpload, validate(map.update), controller.update)
  .delete(validate({ params: common.idParam }), controller.remove);

module.exports = router;

