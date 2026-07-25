const axios = require('axios');
const db = require('../config/db');
const { logger } = require('../config');

class AiRecommendationService {
  /**
   * Get recommendations from Python FastAPI service and map them to DB records
   * @param {Object} preferences { cust_segment, tour_type, pax, budget_per_person_vnd }
   */
  async getRecommendations(preferences) {
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8001';
    const aiServiceToken = process.env.AI_SERVICE_TOKEN || 'your-secret-token-here';
    const aiServiceTimeout = parseInt(process.env.AI_SERVICE_TIMEOUT_MS) || 60000;

    // 1. Call FastAPI to get Top-20 destination IDs
    let aiResponse;
    let modelVersion = "unknown";
    try {
      const payload = {
        cust_segment: preferences.cust_segment,
        tour_type: preferences.tour_type,
        pax: parseInt(preferences.pax),
        budget_per_person_vnd: parseFloat(preferences.budget_per_person_vnd)
      };

      const res = await axios.post(`${aiServiceUrl}/recommend`, payload, {
        headers: {
          'X-Internal-Token': aiServiceToken,
          'Content-Type': 'application/json'
        },
        timeout: aiServiceTimeout
      });
      aiResponse = res.data.destinations; // Array of { destination_id, score }
      modelVersion = res.data.model_version;
    } catch (error) {
      logger.error('Failed to call FastAPI AI Service', { error: error.message });
      throw new Error('AI Service is currently unavailable. Please try again later.');
    }

    if (!aiResponse || aiResponse.length === 0) {
      return { model_version: modelVersion, recommendations: [] };
    }

    // 2. Extract IDs
    const destIds = aiResponse.map(d => parseInt(d.destination_id)).filter(id => !isNaN(id));

    if (destIds.length === 0) {
      return { model_version: modelVersion, recommendations: [] };
    }

    // 3. Query PostgreSQL for active Tours linked to the recommended destination IDs
    // Use subquery to pick the best available thumbnail per tour:
    //   1st priority: tour's own thumbnail
    //   2nd priority: destination thumbnail from the matched destination
    const query = `
      SELECT DISTINCT ON (t.tour_id)
        t.tour_id,
        t.name,
        t.short_description,
        t.description,
        t.thumbnail AS tour_thumbnail,
        td.thumbnail AS dest_thumbnail,
        t.price,
        t.child_price,
        tc.name AS tour_category,
        tdest.destination_id
      FROM tour t
      JOIN tour_destination tdest ON t.tour_id = tdest.tour_id
      LEFT JOIN travel_destination td ON td.destination_id = tdest.destination_id
      LEFT JOIN tour_category tc ON tc.tour_category_id = t.tour_category_id
      WHERE tdest.destination_id = ANY($1)
        AND t.status = 'active'
        AND t.deleted_at IS NULL
      ORDER BY t.tour_id ASC
    `;

    const { rows } = await db.query(query, [destIds]);

    const destScoreMap = new Map();
    aiResponse.forEach(item => destScoreMap.set(parseInt(item.destination_id), parseFloat(item.score) || 0.1));

    const budget = parseFloat(preferences.budget_per_person_vnd) || 0;

    // Track used thumbnails to avoid visual duplicates
    const usedThumbnails = new Set();

    const mappedResults = rows
      .map(tour => {
        const aiScore = destScoreMap.get(tour.destination_id) || 0.15;
        const price = parseFloat(tour.price) || 0;
        const finalScore = Math.min(0.99, Math.max(0.01, Math.round(aiScore * 100) / 100));

        // Choose thumbnail: prefer tour's own, then destination's
        let thumbnail = tour.tour_thumbnail || tour.dest_thumbnail || null;

        // If this thumbnail is already used by another tour, try the alternate source
        if (thumbnail && usedThumbnails.has(thumbnail)) {
          const alternate = tour.tour_thumbnail && tour.tour_thumbnail !== thumbnail
            ? tour.tour_thumbnail
            : tour.dest_thumbnail && tour.dest_thumbnail !== thumbnail
              ? tour.dest_thumbnail
              : null;
          if (alternate && !usedThumbnails.has(alternate)) {
            thumbnail = alternate;
          }
          // If still duplicate, keep it (better than no image) but don't block
        }

        if (thumbnail) {
          usedThumbnails.add(thumbnail);
        }

        return {
          tour_id: tour.tour_id,
          destination_id: tour.destination_id,
          name: tour.name,
          description: tour.short_description || tour.description || 'Tour trải nghiệm tuyệt vời dành cho bạn.',
          thumbnail,
          price: price,
          starting_price: price,
          suggested_tour_type: tour.tour_category || 'Tour du lịch',
          score: finalScore,
          detail_link: `/tours/${tour.tour_id}`
        };
      })
      .filter(Boolean);

    let finalResults = [];
    let noticeMessage = null;

    if (budget > 0) {
      // Find tours strictly within budget (price > 0 && price <= budget)
      const withinBudget = mappedResults.filter(item => item.price > 0 && item.price <= budget);

      if (withinBudget.length > 0) {
        withinBudget.sort((a, b) => b.score - a.score);
        finalResults = withinBudget.slice(0, 10);
      } else {
        // No tour within budget! Find closest higher price range tours
        let alternatives = [...mappedResults];

        // Fallback: If candidates from AI don't have enough cheap tour options, fetch cheapest active tours in DB
        if (alternatives.length < 5) {
          const fallbackQuery = `
            SELECT DISTINCT ON (t.tour_id)
              t.tour_id,
              t.name,
              t.short_description,
              t.description,
              t.thumbnail AS tour_thumbnail,
              td.thumbnail AS dest_thumbnail,
              t.price,
              t.child_price,
              tc.name AS tour_category
            FROM tour t
            LEFT JOIN tour_destination tdest ON t.tour_id = tdest.tour_id
            LEFT JOIN travel_destination td ON td.destination_id = tdest.destination_id
            LEFT JOIN tour_category tc ON tc.tour_category_id = t.tour_category_id
            WHERE t.status = 'active'
              AND t.deleted_at IS NULL
            ORDER BY t.tour_id ASC, t.price ASC
            LIMIT 10
          `;
          try {
            const fallbackRows = await db.query(fallbackQuery);
            const existingTourIds = new Set(alternatives.map(t => t.tour_id));
            // Collect thumbnails already used by existing alternatives
            alternatives.forEach(t => { if (t.thumbnail) usedThumbnails.add(t.thumbnail); });
            fallbackRows.rows.forEach(t => {
              if (!existingTourIds.has(t.tour_id)) {
                let fbThumb = t.tour_thumbnail || t.dest_thumbnail || null;
                if (fbThumb && usedThumbnails.has(fbThumb)) {
                  const alt = t.tour_thumbnail && t.tour_thumbnail !== fbThumb
                    ? t.tour_thumbnail
                    : t.dest_thumbnail && t.dest_thumbnail !== fbThumb
                      ? t.dest_thumbnail : null;
                  if (alt && !usedThumbnails.has(alt)) fbThumb = alt;
                }
                if (fbThumb) usedThumbnails.add(fbThumb);

                alternatives.push({
                  tour_id: t.tour_id,
                  name: t.name,
                  description: t.short_description || t.description,
                  thumbnail: fbThumb,
                  price: parseFloat(t.price) || 0,
                  starting_price: parseFloat(t.price) || 0,
                  suggested_tour_type: t.tour_category || 'Tour du lịch',
                  score: 0.15,
                  detail_link: `/tours/${t.tour_id}`
                });
              }
            });
          } catch (e) {
            logger.error('Failed fallback query for low price tours', e);
          }
        }

        // Sort alternatives by price ascending (closest to budget first!)
        alternatives.sort((a, b) => a.price - b.price);

        finalResults = alternatives.slice(0, 10);

        const formattedBudget = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(budget);
        noticeMessage = `Hiện tại hệ thống không có tour nào nằm trong khoảng ngân sách ${formattedBudget} cho mỗi người. Dưới đây là các gợi ý tour du lịch có mức giá gần nhất phù hợp cho bạn:`;
      }
    } else {
      mappedResults.sort((a, b) => b.score - a.score);
      finalResults = mappedResults.slice(0, 10);
    }

    return {
      model_version: modelVersion,
      notice_message: noticeMessage,
      recommendations: finalResults
    };
  }
}

module.exports = new AiRecommendationService();
