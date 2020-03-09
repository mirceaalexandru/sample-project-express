const joi = require('@hapi/joi');
const express = require('express');
const router = express.Router();
const {
  getStatsForAd
} = require('./../../handlers/v1/stats');
const {
  validate
} = require('./../../validate');

/**
 * @swagger
 *
 * definitions:
 *   Stats:
 *     type: object
 *     required:
 *       - clicks
 *       - cost
 *       - date
 *       - impressions
 *       - id
 *       - cost_per_click
 *     properties:
 *       clicks:
 *         type: number
 *       cost:
 *         type: number
 *       date:
 *         type: string
 *         format: date-time
 *       impressions:
 *         type: number
 *       cost_per_click:
 *         type: number
 *       id:
 *         type: string
 */

/**
 * @swagger
 *
 * /v1/ads/:adId/stats/startDate/:startDate/endDate/:endDate:
 *    get:
 *      description: Get ads for campaign id
 *      tags: [Ads, Stats]
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: startDate
 *          description: Start date
 *          in: path
 *          required: true
 *          type: string
 *          format: date-time
 *        - name: endDate
 *          description: End date
 *          in: path
 *          required: true
 *          type: string
 *          format: date-time
 *        - name: adId
 *          description: Ad id
 *          in: path
 *          required: true
 *          type: string
 *        - name: sort
 *          description: Sort by
 *          in: query
 *          required: false
 *          type: string
 *          enum: [date, clicks, cost, impressions, cost_per_click]
 *        - name: skip
 *          description: Number of skip items. Used for pagination
 *          in: query
 *          required: false
 *          type: number
 *        - name: limit
 *          description: Number of items returned. Used for pagination
 *          in: query
 *          required: false
 *          type: number
 *      responses:
 *        200:
 *          schema:
 *            type: object
 *            required:
 *              - stats
 *            properties:
 *              stats:
 *                type: array
 *                items:
 *                  $ref: '#/definitions/Stats'
 *              total:
 *                type: number
 *                description: Total number of items matching you criteria - to be used for pagination.
 *        500:
 *          description: Internal server error
 */
router.get('/ads/:adId/stats/startDate/:startDate/endDate/:endDate', [
  validate(
    joi.object().keys({
      params: joi.object().keys({
        adId: joi.string().length(36).required(),
        startDate: joi.string().required(),
        endDate: joi.string().required(),
      }).required(),
      query: joi.object().keys({
        // do not accept page size with more than 100 items
        // so adding a max 100 condition
        limit: joi.number().integer().positive().max(100).optional(),
        skip: joi.number().integer().min(0).default(0).optional(),
        sort: joi.string().valid('clicks', 'cost', 'date', 'impressions', 'cost_per_click').optional()
      }).optional()
    }).required().unknown()
  ),
  getStatsForAd
]);

module.exports = router;
