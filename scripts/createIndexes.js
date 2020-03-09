const {
  init: configInit
} = require('./../config');
const {
  init: initDb,
  close: closeDb
} = require('./../lib/db');
const {
  indexes
} = require('./dbHelper');

function createIndex(indexDefinition, dbClient) {
  return dbClient.collection(indexDefinition.collection).createIndex(
    indexDefinition.index,
    {
      unique: indexDefinition.unique,
      sparse: indexDefinition.sparse
    }
  );
}

async function execute() {
  const config = await configInit();
  const {
    client,
    db
  } = await initDb(config);

  try{
    for (const indexDefinition of indexes) {
      await createIndex(indexDefinition, db);
    }
  } catch (err) {
    console.error('Error occurred while creating indexes', err);
  }

  await closeDb(client);
}

(
  async () => {await execute()}
)()