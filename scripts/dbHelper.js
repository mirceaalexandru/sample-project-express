const {
  init: initDb,
  close: closeDb
} = require('./../lib/db');


// list with all collections in db
// each collection can have a modifier configuration that will be used to modify
// some of the data inserted into DB
// Example: `date` field should be an ISO date not string in 'stats' collection
const collections = {
  data_campaigns: null,
  data_ads: null,
  data_adgroups: null,
  data_stats: {
    date: 'date'// key: type modified configuration. Only date type is supported for now.
  }
};

const indexes = [
  {
    collection: 'data_stats',
    index: {id: 1},
    unique: true
  },
  {
    collection: 'data_stats',
    index: {ad_id: 1, date: 1},
    unique: true
  },
  {
    collection: 'data_adgroups',
    index: {id: 1},
    unique: true
  },
  {
    collection: 'data_campaigns',
    index: {id: 1},
    unique: true
  },
  {
    collection: 'data_campaigns',
    index: {status: 1},
    unique: false
  }
]

function cleanRecords({collection, data}, dbClient) {
  return dbClient.collection(collection).deleteMany(data);
}

async function executeClean(config) {
  const {
    client,
    db
  } = await initDb(config);

  try{
    for (const collection of Object.keys(collections)) {
      console.log(`Cleaning collection '${collection}'`);
      await cleanRecords({collection}, db);
    }
  } catch (err) {
    console.error('Error occurred while adding data', err)
  }

  await closeDb(client);
}

function createRecords({collection, data}, dbClient) {
  return dbClient.collection(collection).insertMany(data);
}

async function executePopulate(config) {
  const {
    client,
    db
  } = await initDb(config);

  try{
    for (const collection of Object.keys(collections)) {
      const data = getDataForCollection(collection);
      if (data) {
        console.log(`Populate collection '${collection}'`);
        await createRecords({collection, data}, db)
      } else {
        console.log(`Ignore collection '${collection}' because no data file is available`);
      }
    }
  } catch (err) {
    console.error('Error occurred while adding data', err)
  }

  await closeDb(client);
}

function getDataForCollection(collection) {
  try{
    let data = require(`./../data/${collection}`);

    // here I am changing some data before inserting to DB
    // for example the `date` field in data_stats should be of type date not string.
    if (collections[collection]) {
      Object.keys(collections[collection])
        .forEach(key => {
          data = data.map(
            info => ({
              ...info,
              [key]: collections[collection][key] === 'date' ?
                new Date(info[key]) :
                info[key]
            })
          )
        })
    }
    return data;
  } catch (ignored) {}
}

module.exports = {
  collections: Object.keys(collections),
  indexes,
  executeClean,
  executePopulate
}