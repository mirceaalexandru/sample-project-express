const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser')
const {
  registerAPI: registerV1API
} = require('./../routes/api/v1');
const {
  init: initSwagger
} = require('./swagger');


function init(config) {
  const app = express();

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({extended: false}));
  app.use(bodyParser.json())

  app.set('config', config);
  registerV1API(app);
  if (config.env === 'development') {
    initSwagger(app);
  }
  return app;
}

module.exports = {
  init
};
