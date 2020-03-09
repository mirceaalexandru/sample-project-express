const collection = 'data_campaigns';

function getById({id}, db) {
  return db.collection(collection).findOne({id});
}

async function getByStatus({status}, db) {
  const cursor = await db.collection(collection).find({status});

  return cursor.toArray();
}

function update({id, ...payload}, db) {
  return db.collection(collection).updateOne({id}, {
    $set: payload
  });
}

module.exports = {
  getById,
  getByStatus,
  update
}