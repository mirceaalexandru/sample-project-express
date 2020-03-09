const {
  getById,
  getByStatus,
  update
} = require('./../../../models/campaigns');

// remove the _id from response as this is internal db id
// and should not be exposed.
function normalize(obj) {
  const {_id, ...res} = obj;
  return res;
}

async function getCampaignsById(req, res) {
  const {
    params: {id}
  } = req;

  const campaign = await getById({id}, req.app.get('db').db);
  if (campaign) {
    return res.json(normalize(campaign))
  }
  return res.sendStatus(404);
}

async function getCampaignsByStatus(req, res) {
  const {
    params: {status}
  } = req;

  const campaigns = await getByStatus({status}, req.app.get('db').db);
  // should return object as returning array is a bad approach
  // if returning array then the response cannot be extended with some other values
  // like pagination information, total number of items and others like this.
  return res.json({campaigns: campaigns.map(campaign => normalize(campaign))});
}

async function putCampaign(req, res) {
  const {
    body: {status, goal, total_budget, name},// eslint-disable-line camelcase
    params: {id}
  } = req;

  await update({id, status, goal, total_budget, name}, req.app.get('db').db);// eslint-disable-line camelcase
  return getCampaignsById(req, res);
}

module.exports = {
  getCampaignsById,
  getCampaignsByStatus,
  putCampaign
};
