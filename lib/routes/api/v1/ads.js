const joi = require('@hapi/joi');
const express = require('express');
const router = express.Router();
const {
  getByCampaignId,
  putAd
} = require('./../../handlers/v1/ads');
const {
  validate
} = require('./../../validate');

/**
 * @swagger
 *
 * definitions:
 *   Ad:
 *     type: object
 *     required:
 *       - description
 *       - ad_group_id
 *       - url
 *       - image
 *       - header
 *       - id
 *     properties:
 *       id:
 *         type: string
 *       description:
 *         type: string
 *       ad_group_id:
 *         type: string
 *       url:
 *         type: string
 *       image:
 *         type: string
 *       header:
 *         type: string
 */

/**
 * @swagger
 *
 * /v1/campaigns/:campaignId/ads:
 *    get:
 *      description: Get ads for campaign id
 *      tags: [Ads]
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
 *              - ads
 *            properties:
 *              ads:
 *                type: array
 *                items:
 *                  $ref: '#/definitions/Ad'
 *        500:
 *          description: Internal server error
 */
router.get('/campaigns/:campaignId/ads', [
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
 * /v1/ads/:id:
 *    put:
 *      description: Update an ad
 *      tags: [Ads]
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: body
 *          name: ad
 *          description: The ad group data to update
 *          schema:
 *            type: object
 *            required:
 *              - description
 *              - ad_group_id
 *              - url
 *              - image
 *              - header
 *            properties:
 *              id:
 *                type: string
 *              description:
 *                type: string
 *              ad_group_id:
 *                type: string
 *              url:
 *                type: string
 *              image:
 *                type: string
 *              header:
 *                type: string
 *        - name: id
 *          description: Campaign id
 *          in: path
 *          required: true
 *          type: string
 *      responses:
 *        200:
 *          description: Updated ad group
 *          schema:
 *            $ref: '#/definitions/Ad'
 *        404:
 *          description: Not found
 *        500:
 *          description: Internal server error
 */
router.put('/ads/:id', [
  validate(
    joi.object().keys({
      params: joi.object().keys({
        id: joi.string().length(36).required()
      }).required(),
      body: joi.object().keys({
        description: joi.string().min(1).required(),
        url: joi.string().min(1).required(),
        image: joi.string().min(1).required(),
        header: joi.string().min(1).required(),
      }).required()
    }).required().unknown()
  ),
  putAd
]);

module.exports = router;
