const { MongoClient } = require('mongodb');

async function init(config) {
  const client = await MongoClient.connect(config.db.conn, {
    useUnifiedTopology: true,
    poolSize: 10// this should be a configuration parameter
  });
  return {
    client,
    db: client.db(config.db.dbName)
  }
}

async function close(client) {
  client.close();
}

module.exports = {
  init,
  close
}