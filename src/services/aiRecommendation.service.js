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
    
    // 3. Query PostgreSQL using ANY($1)
    const query = `
      SELECT 
        td.destination_id,
        td.name,
        td.description,
        td.thumbnail,
        dc.name AS suggested_tour_type,
        (
          SELECT t.price 
          FROM tour_destination tdest
          JOIN tour t ON t.tour_id = tdest.tour_id
          WHERE tdest.destination_id = td.destination_id 
            AND t.status = 'active' 
            AND t.deleted_at IS NULL
          ORDER BY t.price ASC
          LIMIT 1
        ) AS starting_price
      FROM travel_destination td
      LEFT JOIN destination_category dc ON dc.destination_category_id = td.destination_category_id
      WHERE td.destination_id = ANY($1)
      AND td.deleted_at IS NULL
    `;

    const { rows } = await db.query(query, [destIds]);

    // 4. Map back to AI results to preserve score and order, then slice top 10
    const dbItemMap = new Map();
    rows.forEach(r => dbItemMap.set(r.destination_id, r));

    const finalResults = aiResponse
      .map(aiItem => {
        const id = parseInt(aiItem.destination_id);
        const dbItem = dbItemMap.get(id);
        if (dbItem) {
          return {
            ...dbItem,
            score: aiItem.score,
            detail_link: `/destinations/${dbItem.destination_id}`
          };
        }
        return null;
      })
      .filter(Boolean)
      .slice(0, 10);

    return {
      model_version: modelVersion,
      recommendations: finalResults
    };
  }
}

module.exports = new AiRecommendationService();
