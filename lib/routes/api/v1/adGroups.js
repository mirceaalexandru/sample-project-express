const joi = require('@hapi/joi');
const express = require('express');
const router = express.Router();
const {
  getByCampaignId,
  putGroup
} = require('./../../handlers/v1/adGroup');
const {
  validate
} = require('./../../validate');

/**
 * @swagger
 *
 * definitions:
 *   AdGroup:
 *     type: object
 *     required:
 *       - age_range
 *       - name
 *       - locations
 *       - campaign_id
 *       - keywords
 *       - genders
 *       - id
 *     properties:
 *       name:
 *         type: string
 *       age_range:
 *         type: array
 *         items:
 *          type: number
 *       locations:
 *         type: array
 *         items:
 *          type: string
 *       keywords:
 *         type: array
 *         items:
 *          type: string
 *       genders:
 *         type: array
 *         items:
 *          type: string
 *       campaign_id:
 *         type: string
 *       id:
 *         type: string
 */

/**
 * @swagger
 *
 * /v1/campaigns/:campaignId/adGroups:
 *    get:
 *      description: Get ad groups by campaign id
 *      tags: [AdGroups]
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: campaignId
 *          description: Campaign id
 *          in: path
 *          required: true
 *          type: string
 *      responses:
 *        200:
 *          schema:
 *            type: object
 *            required:
 *              - adGroups
 *            properties:
 *              adGroups:
 *                type: array
 *                items:
 *                  $ref: '#/definitions/AdGroup'
 *        500:
 *          description: Internal server error
 */
router.get('/campaigns/:campaignId/adGroups', [
  validate(
    joi.object().keys({
      params: joi.object().keys({
        campaignId: joi.string().length(36).required()
      }).required()
    }).required().unknown()
  ),
  getByCampaignId
]);

/**
 * @swagger
 *
 * /v1/adGroups/:id:
 *    put:
 *      description: Update ad group
 *      tags: [AdGroups]
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: body
 *          name: ad group
 *          description: The ad group data to update
 *          schema:
 *            type: object
 *            required:
 *              - age_range
 *              - name
 *              - locations
 *              - keywords
 *              - genders
 *            properties:
 *              name:
 *                type: string
 *              age_range:
 *                type: array
 *                items:
 *                  type: number
 *              locations:
 *                type: array
 *                items:
 *                  type: string
 *              keywords:
 *                type: array
 *                items:
 *                  type: string
 *              genders:
 *                type: array
 *                items:
 *                  type: string
 *        - name: id
 *          description: Campaign id
 *          in: path
 *          required: true
 *          type: string
 *      responses:
 *        200:
 *          description: Updated ad group
 *          schema:
 *            $ref: '#/definitions/AdGroup'
 *        404:
 *          description: Not found
 *        500:
 *          description: Internal server error
 */
router.put('/adGroups/:id', [
  validate(
    joi.object().keys({
      params: joi.object().keys({
        id: joi.string().length(36).required()
      }).required(),
      body: joi.object().keys({
        name: joi.string().min(1).required(),
        age_range: joi.array().items(// eslint-disable-line camelcase
          joi.number().positive()
        ).required(),
        locations: joi.array().items(
          joi.string().min(1)
        ).required(),
        keywords: joi.array().items(
          joi.string().min(1)
        ).required(),
        genders: joi.array().items(
          joi.string().min(1)
        ).required(),
      }).required()
    }).required().unknown()
  ),
  putGroup
]);

module.exports = router;
