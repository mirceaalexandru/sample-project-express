const collection = 'data_ads';
const {
  getAdGroupsIdsForCId
} = require('./adGroups');

async function getByCampaignId({campaignId}, db) {
  return (await db.collection(collection).find({
    ad_group_id: {$in: (await getAdGroupsIdsForCId({campaignId}, db)).map(({id}) => id)}// eslint-disable-line camelcase
  })).toArray();
}

function update({id, ...payload}, db) {
  return db.collection(collection).updateOne({id}, {
    $set: payload
  });
}

function getById ({id}, db) {
  return db.collection(collection).findOne(
    {id}
  );
}

module.exports = {
  getByCampaignId,
  update,
  getById
}