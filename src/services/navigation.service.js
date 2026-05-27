const db = require('../config/db');
const ApiError = require('../utils/ApiError');
const { httpStatus } = require('../constants');

const toRadians = (value) => (Number(value) * Math.PI) / 180;

const calculateDistanceKm = (from, to) => {
  if (
    from.latitude === null ||
    from.longitude === null ||
    to.latitude === null ||
    to.longitude === null
  ) {
    return null;
  }

  const earthRadiusKm = 6371;
  const latDelta = toRadians(to.latitude - from.latitude);
  const lngDelta = toRadians(to.longitude - from.longitude);
  const fromLat = toRadians(from.latitude);
  const toLat = toRadians(to.latitude);

  const haversine =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(lngDelta / 2) ** 2;

  return Number((earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))).toFixed(2));
};

class NavigationService {
  async getRoute(tourId) {
    const tourResult = await db.query(
      `SELECT tour_id, name
       FROM tour
       WHERE tour_id = $1
         AND deleted_at IS NULL`,
      [tourId]
    );

    const tour = tourResult.rows[0];
    if (!tour) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Tour Not Found');
    }

    const destinationsResult = await db.query(
      `SELECT
          td.tour_destination_id,
          td.destination_id,
          d.name,
          d.description,
          d.thumbnail,
          d.latitude,
          d.longitude,
          td.order_index,
          td.estimated_time,
          td.note
       FROM tour_destination td
       INNER JOIN travel_destination d ON d.destination_id = td.destination_id
       WHERE td.tour_id = $1
         AND d.deleted_at IS NULL
       ORDER BY td.order_index ASC, td.tour_destination_id ASC`,
      [tourId]
    );

    const destinations = destinationsResult.rows.map((destination) => ({
      ...destination,
      latitude: destination.latitude === null ? null : Number(destination.latitude),
      longitude: destination.longitude === null ? null : Number(destination.longitude),
    }));

    const steps = [];
    let totalDistanceKm = 0;

    for (let index = 0; index < destinations.length - 1; index += 1) {
      const from = destinations[index];
      const to = destinations[index + 1];
      const distanceKm = calculateDistanceKm(from, to);

      if (distanceKm !== null) {
        totalDistanceKm += distanceKm;
      }

      steps.push({
        from_destination_id: from.destination_id,
        from_name: from.name,
        to_destination_id: to.destination_id,
        to_name: to.name,
        order_index: to.order_index,
        distance_km: distanceKm,
        estimated_time: to.estimated_time,
        note: to.note,
      });
    }

    return {
      tour_id: tour.tour_id,
      tour_name: tour.name,
      route: destinations,
      polyline: destinations
        .filter((destination) => destination.latitude !== null && destination.longitude !== null)
        .map((destination) => [destination.latitude, destination.longitude]),
      steps,
      summary: {
        total_destinations: destinations.length,
        total_distance_km: Number(totalDistanceKm.toFixed(2)),
      },
    };
  }
}

module.exports = new NavigationService();
