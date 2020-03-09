const healthRouter = require('./health');
const campaignsRouter = require('./campaigns');
const adGroups = require('./adGroups');
const stats = require('./stats');
const ads = require('./ads');

function registerAPI(server) {
  server.use('/v1', healthRouter);
  server.use('/v1', campaignsRouter);
  server.use('/v1', adGroups);
  server.use('/v1', ads);
  server.use('/v1', stats);
}

module.exports = {
  registerAPI
}