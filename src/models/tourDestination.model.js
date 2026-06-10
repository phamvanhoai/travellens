const db = require('../config/db');
const BaseModel = require('./base.model');

class TourDestinationModel extends BaseModel {
  constructor() {
    super({
      table: 'tour_destination',
      primaryKey: 'tour_destination_id',
      fields: ['tour_id', 'destination_id', 'order_index', 'estimated_time', 'note'],
      filters: ['tour_id', 'destination_id'],
    });
  }

  async replaceForTour(tourId, destinations, client = db) {
    await client.query('DELETE FROM tour_destination WHERE tour_id = $1', [tourId]);

    if (!destinations.length) {
      return [];
    }

    const values = [];
    const rows = destinations.map((destination, index) => {
      const base = index * 5;
      values.push(
        tourId,
        destination.destination_id,
        destination.order_index,
        destination.estimated_time || null,
        destination.note || null
      );
      return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5})`;
    });

    const result = await client.query(
      `INSERT INTO tour_destination (
          tour_id, destination_id, order_index, estimated_time, note
       )
       VALUES ${rows.join(', ')}
       RETURNING *`,
      values
    );

    return result.rows;
  }
}

module.exports = new TourDestinationModel();
