const collection = 'data_stats';

async function getStatsForAd({
 startDate, endDate, adId: ad_id, sort, skip, limit// eslint-disable-line camelcase
}, db) {
  const pipeline = [
    {
      $facet: {
        stats: [
          {
            $match: {
              date: {$gt: startDate, $lt: endDate},
              ad_id// eslint-disable-line camelcase
            }
          },
          {
            $project: {
              date: 1,
              impressions: 1,
              cost: 1,
              clicks: 1,
              cost_per_click: {$divide: ['$cost', '$clicks']}// eslint-disable-line camelcase
            }
          }
        ],
        total: [
          {
            $match: {
              date: {$gt: startDate, $lt: endDate},
              ad_id// eslint-disable-line camelcase
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: 1 }
            }
          },
          {
            $project: {
              total: 1
            }
          }
        ]
      }
    }
  ];

  if (sort) {
    pipeline[0].$facet.stats.push(
      {
        $sort: { [sort]: 1 }
      }
    )
  }

  if (skip) {
    pipeline[0].$facet.stats.push(
      {
        $skip: parseInt(skip, 10)
      }
    )
  }

  if (limit) {
    pipeline[0].$facet.stats.push(
      {
        $limit: parseInt(limit, 10)
      }
    )
  }

  const result = await db.collection(collection).aggregate(pipeline).toArray();

  return {
    stats: result[0].stats,
    total: result[0].total[0] ? result[0].total[0].total: 0
  };
}

module.exports = {
  getStatsForAd
}