const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

function init(app) {
  const config = app.get('config');
  const options = {
    definition: {
      info: {
        title: config.projectName,
        version: config.service.version
      },
    },
    // Path to the API docs
    apis: ['lib/routes/api/v1/*.js'],
  };

  // Initialize swagger-jsdoc -> returns validated swagger spec in json format
  const swaggerSpec = swaggerJSDoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = {
  init
}