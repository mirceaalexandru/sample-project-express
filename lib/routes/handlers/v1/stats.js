const {
  getStatsForAd: getStatsForAdModel,
} = require('./../../../models/stats');

// remove the _id from response as this is internal db id
// and should not be exposed.
function normalize(obj) {
  const {_id, ...res} = obj;
  return res;
}

async function getStatsForAd(req, res) {
  const {
    params: {startDate, endDate, adId},
    query: {sort, limit, skip}
  } = req;

  const result = await getStatsForAdModel({
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    adId,
    sort, limit, skip
  }, req.app.get('db').db)
  return res.json(
    {
      stats: result.stats.map(stat => normalize(stat)),
      total: result.total
    }
  )
}

module.exports = {
  getStatsForAd
};
