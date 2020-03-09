const {
  getByCampaignId: getByCampaignIdModel,
  update,
  getById: getByIdModel
} = require('./../../../models/ads');
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
  return res.json({ads: groups.map(group => normalize(group))})
}

async function getById(req, res) {
  const {
    params: {id}
  } = req;

  const ad = await getByIdModel({id}, req.app.get('db').db);
  return res.json(normalize(ad));
}

async function putAd(req, res) {
  const {
    body: {description, url, image, header},
    params: {id}
  } = req;

  await update(
    {id, description, url, image, header},
    req.app.get('db').db
  );
  return getById(req, res);
}

module.exports = {
  getByCampaignId,
  putAd
};
