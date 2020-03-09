const joi = require('@hapi/joi');
const express = require('express');
const router = express.Router();
const {
  getCampaignsById,
  getCampaignsByStatus,
  putCampaign
} = require('./../../handlers/v1/campaigns');
const {
  validate
} = require('./../../validate');

/**
 * @swagger
 *
 * definitions:
 *   Campaign:
 *     type: object
 *     required:
 *       - id
 *       - status
 *       - goal
 *       - total_budget
 *       - name
 *     properties:
 *       id:
 *         type: string
 *       status:
 *         type: string
 *       goal:
 *         type: string
 *       total_budget:
 *         type: number
 *       name:
 *         type: string
 */

/**
 * @swagger
 *
 * /v1/campaigns/:id:
 *    put:
 *      description: Update campaign
 *      tags: [Campaigns]
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: body
 *          name: campaign
 *          description: The campaign data to update
 *          schema:
 *            type: object
 *            required:
 *              - status
 *              - goal
 *              - total_budget
 *              - name
 *            properties:
 *              status:
 *                type: string
 *              goal:
 *                type: string
 *              total_budget:
 *                type: number
 *              name:
 *                type: string
 *        - name: id
 *          description: Campaign id
 *          in: path
 *          required: true
 *          type: string
 *      responses:
 *        200:
 *          description: Updated campaign
 *          schema:
 *            $ref: '#/definitions/Campaign'
 *        404:
 *          description: Not found
 *        500:
 *          description: Internal server error
 */
router.put('/campaigns/:id', [
  validate(
    joi.object().keys({
      params: joi.object().keys({
        id: joi.string().length(36).required()
      }).required(),
      body: joi.object().keys({
        status: joi.string().valid('Pending', 'Delivering', 'Rejected').required(),
        goal: joi.string().required(),
        // do not accept page size with more than 100 items
        total_budget: joi.number().integer().positive().required(),// eslint-disable-line camelcase
        name: joi.string().required(),
      }).required()
    }).required().unknown()
  ),
  putCampaign
]);

/**
 * @swagger
 *
 * /v1/campaigns/:id:
 *    get:
 *      description: Get campaign by id
 *      tags: [Campaigns]
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: id
 *          description: Campaign id
 *          in: path
 *          required: true
 *          type: string
 *      responses:
 *        200:
 *          description: Found campaign
 *          schema:
 *            $ref: '#/definitions/Campaign'
 *        404:
 *          description: Not found
 *        500:
 *          description: Internal server error
 */
router.get('/campaigns/:id', [
  validate(
    joi.object().keys({
      params: joi.object().keys({
        id: joi.string().length(36).required()
      }).required()
    }).required().unknown()
  ),
  getCampaignsById
]);

/**
 * @swagger
 *
 * /v1/campaigns/status/:status:
 *    get:
 *      description: Get campaigns by status
 *      produces:
 *        - application/json
 *      tags: [Campaigns]
 *      parameters:
 *        - name: status
 *          description: Campaign status
 *          in: path
 *          required: true
 *          type: string
 *      responses:
 *        200:
 *          schema:
 *            type: object
 *            required:
 *              - campaigns
 *            properties:
 *              campaigns:
 *                type: array
 *                items:
 *                  $ref: '#/definitions/Campaign'
 *        500:
 *          description: Internal server error
 */
router.get('/campaigns/status/:status', [
  validate(
    joi.object().keys({
      params: joi.object().keys({
        status: joi.string().valid('Pending', 'Delivering', 'Rejected').required()
      }).required()
    }).required().unknown()
  ),
  getCampaignsByStatus
]);

module.exports = router;
