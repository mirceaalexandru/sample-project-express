var express = require('express');
var router = express.Router();

/**
 * @swagger
 *
 * /v1/health:
 *    get:
 *      description: Verify app health
 *      produces:
 *        - application/json
 *      tags: [Health]
 *      responses:
 *        200:
 *          description: app is healthy
 */
router.get('/health', (req, res) => {
  res.json({
    ok: new Date()
  });
});

module.exports = router;
