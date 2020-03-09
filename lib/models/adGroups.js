const collection = 'data_adgroups';

async function getByCampaignId({campaignId}, db) {
  const cursor = await db.collection(collection).find({campaign_id: campaignId});// eslint-disable-line camelcase

  return cursor.toArray();
}

async function getAdGroupsIdsForCId ({campaignId}, db) {
  const adGroupsCursor = await db.collection(collection).find(
    {campaign_id: campaignId},// eslint-disable-line camelcase
    {id: true}
  );
  return adGroupsCursor.toArray()
}

function getById ({id}, db) {
  return db.collection(collection).findOne(
    {id}
  );
}

function update({id, ...payload}, db) {
  return db.collection(collection).updateOne({id}, {
    $set: payload
  });
}

module.exports = {
  getByCampaignId,
  getAdGroupsIdsForCId,
  update,
  getById
}