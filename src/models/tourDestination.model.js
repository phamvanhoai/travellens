const db = require('../config/db');
const BaseModel = require('./base.model');

class TourDestinationModel extends BaseModel {
  constructor() {
    super({
      table: 'tour_destination',
      primaryKey: 'tour_destination_id',
      fields: [
        'tour_id', 'destination_id', 'order_index', 'estimated_time', 'estimated_minutes',
        'day_number', 'start_time', 'end_time', 'activity', 'note',
      ],
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
      const base = index * 10;
      values.push(
        tourId,
        destination.destination_id,
        destination.order_index,
        destination.estimated_time || null,
        destination.estimated_minutes ?? null,
        destination.day_number || 1,
        destination.start_time || null,
        destination.end_time || null,
        destination.activity || null,
        destination.note || null
      );
      return `(${Array.from({ length: 10 }, (_, position) => `$${base + position + 1}`).join(', ')})`;
    });

    const result = await client.query(
      `INSERT INTO tour_destination (
          tour_id, destination_id, order_index, estimated_time, estimated_minutes,
          day_number, start_time, end_time, activity, note
       )
       VALUES ${rows.join(', ')}
       RETURNING *`,
      values
    );

    return result.rows;
  }
}

module.exports = new TourDestinationModel();
