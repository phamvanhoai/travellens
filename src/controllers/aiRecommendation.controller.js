const aiRecommendationService = require('../services/aiRecommendation.service');
const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/responseHandler');
const db = require('../config/db');
const { parseTravelRequest } = require('../utils/travelRequestParser');
const { parseRequestSchema, recommendationSchema } = require('../validators/aiRecommendation.validator');

module.exports = {
  /**
   * POST /api/ai/parse-request
   */
  parseTravelRequest: asyncHandler(async (req, res) => {
    const { error, value } = parseRequestSchema.validate(req.body);
    if (error) {
      return response.error(res, error.details[0].message, 400);
    }
    const parsedResult = parseTravelRequest(value.travel_request);
    return res.status(200).json(parsedResult);
  }),

  /**
   * POST /api/ai/recommend
   */
  recommendDestinations: asyncHandler(async (req, res) => {
    const { error, value } = recommendationSchema.validate(req.body);
    if (error) {
      return response.error(res, error.details[0].message, 400);
    }
    const data = await aiRecommendationService.getRecommendations(value);
    return res.status(200).json({
      success: true,
      model_version: data.model_version || "unknown",
      notice_message: data.notice_message || null,
      recommendations: data.recommendations
    });
  }),

  /**
   * POST /api/ai/search
   * Combined: parse text → validate → call AI → query DB → return Top-10
   * Auto-save to history if user is logged in
   */
  searchByText: asyncHandler(async (req, res) => {
    const { error, value } = parseRequestSchema.validate(req.body);
    if (error) {
      return response.error(res, error.details[0].message, 400);
    }

    const parsed = parseTravelRequest(value.travel_request);

    if (parsed.missing_fields && parsed.missing_fields.length > 0) {
      return res.status(200).json({
        success: false,
        message: parsed.message,
        missing_fields: parsed.missing_fields,
        parsed_data: parsed.data,
        recommendations: []
      });
    }

    const { error: recError, value: recValue } = recommendationSchema.validate(parsed.data);
    if (recError) {
      return response.error(res, recError.details[0].message, 400);
    }

    const data = await aiRecommendationService.getRecommendations(recValue);

    // Auto-save to history if user is authenticated
    const userId = req.user?.sub;
    if (userId && data.recommendations && data.recommendations.length > 0) {
      try {
        await db.query(
          `INSERT INTO ai_search_history (user_id, travel_request, parsed_data, recommendations, model_version)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            userId,
            value.travel_request,
            JSON.stringify(parsed.data),
            JSON.stringify(data.recommendations),
            data.model_version || "unknown"
          ]
        );
      } catch (saveErr) {
        // Don't fail the request if history save fails
        console.error('Failed to save AI search history:', saveErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      model_version: data.model_version || "unknown",
      notice_message: data.notice_message || null,
      parsed_data: parsed.data,
      recommendations: data.recommendations
    });
  }),

  /**
   * GET /api/ai/history
   * Get search history for the authenticated user
   */
  getHistory: asyncHandler(async (req, res) => {
    const userId = req.user?.sub;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const { rows } = await db.query(
      `SELECT id, travel_request, parsed_data, recommendations, model_version, created_at
       FROM ai_search_history
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    return res.status(200).json({
      success: true,
      history: rows
    });
  }),

  /**
   * DELETE /api/ai/history/:id
   * Delete a specific history entry
   */
  deleteHistory: asyncHandler(async (req, res) => {
    const userId = req.user?.sub;
    const historyId = req.params.id;

    await db.query(
      `DELETE FROM ai_search_history WHERE id = $1 AND user_id = $2`,
      [historyId, userId]
    );

    return res.status(200).json({ success: true, message: 'History entry deleted' });
  })
};
