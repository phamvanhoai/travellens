const db = require('../config/db');
const BaseModel = require('./base.model');

const ACTIVE_BOOKING_STATUSES = ['pending', 'confirmed', 'paid'];

class TourModel extends BaseModel {
  constructor() {
    super({
      table: 'tour',
      primaryKey: 'tour_id',
      fields: ['name', 'description', 'price', 'schedule', 'capacity', 'thumbnail', 'status', 'tour_category_id'],
      searchable: ['name', 'description', 'schedule'],
      filters: ['tour_category_id', 'status'],
    });
  }

  buildSort(query = {}) {
    const sortColumns = {
      tour_id: 't.tour_id',
      name: 't.name',
      price: 't.price',
      capacity: 't.capacity',
      status: 't.status',
      created_at: 't.created_at',
      updated_at: 't.updated_at',
    };
    const sortBy = sortColumns[query.sortBy] || sortColumns.created_at;
    const sortOrder = String(query.sortOrder || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    return { sortBy, sortOrder };
  }

  async findAllForAdminView(query = {}) {
    const page = Math.max(Number(query.page || 1), 1);
    const limit = Math.min(Math.max(Number(query.limit || 20), 1), 100);
    const offset = (page - 1) * limit;
    const values = [];
    const clauses = ['t.deleted_at IS NULL'];

    if (query.search) {
      values.push(`%${query.search}%`);
      clauses.push(`t.name ILIKE $${values.length}`);
    }

    if (query.tour_category_id) {
      values.push(query.tour_category_id);
      clauses.push(`t.tour_category_id = $${values.length}`);
    }

    if (query.destination_id) {
      values.push(query.destination_id);
      clauses.push(`EXISTS (
        SELECT 1
        FROM tour_destination td_filter
        WHERE td_filter.tour_id = t.tour_id
          AND td_filter.destination_id = $${values.length}
      )`);
    }

    if (query.status) {
      values.push(query.status);
      clauses.push(`t.status = $${values.length}`);
    }

    const whereText = `WHERE ${clauses.join(' AND ')}`;
    const { sortBy, sortOrder } = this.buildSort(query);

    const countResult = await db.query(
      `SELECT COUNT(*)::int AS total
       FROM tour t
       ${whereText}`,
      values
    );

    const listValues = [...values, limit, offset];
    const listResult = await db.query(
      `SELECT
          t.tour_id,
          t.name,
          t.description,
          t.price::float AS price,
          t.schedule,
          t.capacity,
          t.thumbnail,
          COALESCE(slot_stats.booked_slots, 0)::int AS booked_slots,
          (COALESCE(t.capacity, 0) - COALESCE(slot_stats.booked_slots, 0))::int AS available_slots,
          t.status,
          CASE
            WHEN tc.tour_category_id IS NULL THEN NULL
            ELSE json_build_object(
              'tour_category_id', tc.tour_category_id,
              'name', tc.name
            )
          END AS tour_category,
          COALESCE(destinations.destinations, '[]'::json) AS destinations,
          t.created_at,
          t.updated_at
       FROM tour t
       LEFT JOIN tour_category tc ON tc.tour_category_id = t.tour_category_id
       LEFT JOIN (
          SELECT
            b.tour_id,
            COUNT(bd.booking_detail_id)::int AS booked_slots
          FROM booking b
          INNER JOIN booking_detail bd ON bd.booking_id = b.booking_id
          WHERE b.status = ANY($${listValues.length + 1})
          GROUP BY b.tour_id
       ) slot_stats ON slot_stats.tour_id = t.tour_id
       LEFT JOIN LATERAL (
          SELECT json_agg(
            json_build_object(
              'destination_id', td.destination_id,
              'name', d.name,
              'order_index', td.order_index,
              'estimated_time', td.estimated_time,
              'note', td.note
            )
            ORDER BY td.order_index ASC, td.tour_destination_id ASC
          ) AS destinations
          FROM tour_destination td
          INNER JOIN travel_destination d ON d.destination_id = td.destination_id
          WHERE td.tour_id = t.tour_id
       ) destinations ON TRUE
       ${whereText}
       ORDER BY ${sortBy} ${sortOrder}
       LIMIT $${listValues.length - 1} OFFSET $${listValues.length}`,
      [...listValues, ACTIVE_BOOKING_STATUSES]
    );

    const total = countResult.rows[0].total;
    return {
      items: listResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findDetailForAdminView(id) {
    const result = await db.query(
      `SELECT
          t.tour_id,
          t.name,
          t.description,
          t.price::float AS price,
          t.schedule,
          t.capacity,
          t.thumbnail,
          COALESCE(slot_stats.booked_slots, 0)::int AS booked_slots,
          (COALESCE(t.capacity, 0) - COALESCE(slot_stats.booked_slots, 0))::int AS available_slots,
          t.status,
          CASE
            WHEN tc.tour_category_id IS NULL THEN NULL
            ELSE json_build_object(
              'tour_category_id', tc.tour_category_id,
              'name', tc.name
            )
          END AS tour_category,
          COALESCE(destinations.destinations, '[]'::json) AS destinations,
          json_build_object(
            'total_bookings', COALESCE(booking_stats.total_bookings, 0)::int,
            'revenue', COALESCE(payment_stats.revenue, 0)::float
          ) AS statistics,
          t.created_at,
          t.updated_at
       FROM tour t
       LEFT JOIN tour_category tc ON tc.tour_category_id = t.tour_category_id
       LEFT JOIN (
          SELECT
            b.tour_id,
            COUNT(bd.booking_detail_id)::int AS booked_slots
          FROM booking b
          INNER JOIN booking_detail bd ON bd.booking_id = b.booking_id
          WHERE b.status = ANY($2)
          GROUP BY b.tour_id
       ) slot_stats ON slot_stats.tour_id = t.tour_id
       LEFT JOIN (
          SELECT tour_id, COUNT(*)::int AS total_bookings
          FROM booking
          GROUP BY tour_id
       ) booking_stats ON booking_stats.tour_id = t.tour_id
       LEFT JOIN (
          SELECT b.tour_id, SUM(p.amount) AS revenue
          FROM booking b
          INNER JOIN payment p ON p.booking_id = b.booking_id
          WHERE p.status = 'paid'
          GROUP BY b.tour_id
       ) payment_stats ON payment_stats.tour_id = t.tour_id
       LEFT JOIN LATERAL (
          SELECT json_agg(
            json_build_object(
              'destination_id', td.destination_id,
              'name', d.name,
              'order_index', td.order_index,
              'estimated_time', td.estimated_time,
              'note', td.note,
              'locations_count', COALESCE(location_stats.locations_count, 0)
            )
            ORDER BY td.order_index ASC, td.tour_destination_id ASC
          ) AS destinations
          FROM tour_destination td
          INNER JOIN travel_destination d ON d.destination_id = td.destination_id
          LEFT JOIN LATERAL (
            SELECT COUNT(*)::int AS locations_count
            FROM location l
            WHERE l.destination_id = d.destination_id
              AND COALESCE(l.is_deleted, FALSE) = FALSE
              AND l.deleted_at IS NULL
          ) location_stats ON TRUE
          WHERE td.tour_id = t.tour_id
       ) destinations ON TRUE
       WHERE t.tour_id = $1
         AND t.deleted_at IS NULL`,
      [id, ACTIVE_BOOKING_STATUSES]
    );

    return result.rows[0] || null;
  }

  async findRawById(id, client = db) {
    const result = await client.query(
      `SELECT *
       FROM tour
       WHERE tour_id = $1
         AND deleted_at IS NULL`,
      [id]
    );

    return result.rows[0] || null;
  }

  async findForUpdate(id, client) {
    const result = await client.query(
      `SELECT *
       FROM tour
       WHERE tour_id = $1
         AND deleted_at IS NULL
       FOR UPDATE`,
      [id]
    );
    return result.rows[0] || null;
  }

  async findByName(name, excludeTourId, client = db) {
    const values = [name];
    const excludeClause = excludeTourId ? 'AND tour_id <> $2' : '';
    if (excludeTourId) values.push(excludeTourId);

    const result = await client.query(
      `SELECT tour_id
       FROM tour
       WHERE LOWER(name) = LOWER($1)
         AND deleted_at IS NULL
         ${excludeClause}
       LIMIT 1`,
      values
    );

    return result.rows[0] || null;
  }

  async createTour(payload, client) {
    const result = await client.query(
      `INSERT INTO tour (
          tour_category_id, name, description, price, schedule, capacity, thumbnail, status
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, 'active'))
       RETURNING tour_id`,
      [
        payload.tour_category_id,
        payload.name,
        payload.description || null,
        payload.price,
        payload.schedule,
        payload.capacity,
        payload.thumbnail || null,
        payload.status || 'active',
      ]
    );

    return result.rows[0];
  }

  async updateTour(id, payload, client) {
    const fields = ['tour_category_id', 'name', 'description', 'price', 'schedule', 'capacity', 'thumbnail', 'status'];
    const keys = fields.filter((field) => payload[field] !== undefined);

    if (!keys.length) {
      return this.findRawById(id, client);
    }

    const values = keys.map((field) => payload[field]);
    values.push(id);
    const assignments = keys.map((field, index) => `${field} = $${index + 1}`);

    const result = await client.query(
      `UPDATE tour
       SET ${assignments.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE tour_id = $${values.length}
         AND deleted_at IS NULL
       RETURNING tour_id`,
      values
    );

    return result.rows[0] || null;
  }

  async softDelete(id, client) {
    const result = await client.query(
      `UPDATE tour
       SET deleted_at = CURRENT_TIMESTAMP,
           status = 'deleted',
           updated_at = CURRENT_TIMESTAMP
       WHERE tour_id = $1
         AND deleted_at IS NULL
       RETURNING tour_id`,
      [id]
    );

    return result.rows[0] || null;
  }

  async countBookedSlots(id, client = db) {
    const result = await client.query(
      `SELECT COUNT(bd.booking_detail_id)::int AS booked_slots
       FROM booking b
       INNER JOIN booking_detail bd ON bd.booking_id = b.booking_id
       WHERE b.tour_id = $1
         AND b.status = ANY($2)`,
      [id, ACTIVE_BOOKING_STATUSES]
    );

    return result.rows[0].booked_slots;
  }

  async countActiveBookings(id, client = db) {
    const result = await client.query(
      `SELECT COUNT(*)::int AS total
       FROM booking
       WHERE tour_id = $1
         AND status = ANY($2)`,
      [id, ACTIVE_BOOKING_STATUSES]
    );

    return result.rows[0].total;
  }

  getClient() {
    return db.getClient();
  }
}

module.exports = new TourModel();
