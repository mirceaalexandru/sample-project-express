const {
  init: initDb
} = require('./lib/db');
const {
  init: initServer
} = require('./lib/server');
const {
  init: configInit
} = require('./config');

async function init() {
  const config = await configInit();
  const app = initServer(config);
  const dbClient = await initDb(config);
  // set db client in app for further usage for request handlers/models
  app.set('db', dbClient);

  app.listen(
    config.service.port,
    config.service.host
  )
}

init();