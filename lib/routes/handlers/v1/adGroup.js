const {
  getByCampaignId: getByCampaignIdModel,
  update,
  getById: getByIdModel
} = require('./../../../models/adGroups');
const {
  getById: getCampaignById
} = require('./../../../models/campaigns');

// remove the _id from response as this is internal db id
// and should not be exposed.
function normalize(obj) {
  const {_id, ...res} = obj;
  return res;
}

async function getByCampaignId(req, res) {
  const {
    params: {campaignId}
  } = req;

  const campaign = await getCampaignById({id: campaignId}, req.app.get('db').db);
  if (!campaign) {
    return res.sendStatus(404);
  }
  const groups = await getByCampaignIdModel({campaignId}, req.app.get('db').db);
  // should return object as returning array is a bad approach
  // if returning array then the response cannot be extended with some other values
  // like pagination information, total number of items and others like this.
  return res.json({adGroups: groups.map(group => normalize(group))})
}

async function getById(req, res) {
  const {
    params: {id}
  } = req;

  const group = await getByIdModel({id}, req.app.get('db').db);
  return res.json(normalize(group));
}

async function putGroup(req, res) {
  const {
    params: {id},
    body: {name, age_range, locations, keywords, genders}// eslint-disable-line camelcase
  } = req;

  await update(
    {id, name, age_range, locations, keywords, genders},// eslint-disable-line camelcase
    req.app.get('db').db
  );

  return getById(req, res);
}

module.exports = {
  getByCampaignId,
  putGroup
};
