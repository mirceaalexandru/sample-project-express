const {executeClean, executePopulate} = require('./../../scripts/dbHelper');
const {init} = require('../../lib/server');
const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const {
  init: initDb
} = require('./../../lib/db');
const {
  config,
  wrongCampaignId,
  statsStartDate,
  statsEndDate,
  correctAdId
} = require('./testData');

describe('API tests for stats', () => {
  let server;
  let dbClient;
  before(async () => {
   await executeClean(config);
   await executePopulate(config);

    server = await init(config);
    dbClient = await initDb(config);
    server.set('db', dbClient);
  });

  after(async () => {
    return dbClient.client.close();
  })

  it('return 400 for invalid adId', done => {
    request(server)
      .get(`/v1/ads/123/stats/startDate/${statsStartDate}/endDate/${statsEndDate}`)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(400);
        done();
      });
  });

  it('return 200 for adId that doesn\'t exist', done => {
    request(server)
      .get(`/v1/ads/${wrongCampaignId}/stats/startDate/${statsStartDate}/endDate/${statsEndDate}`)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.ok;
        expect(res.body.stats.length).to.be.equal(0);
        expect(res.body.total).to.be.equal(0);
        done()
      });
  });

  it('return 200 with an existing ad id', done => {
    request(server)
      .get(`/v1/ads/${correctAdId}/stats/startDate/${statsStartDate}/endDate/${statsEndDate}`)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.ok;
        expect(res.body.stats.length).to.be.equal(8);
        expect(res.body.total).to.be.equal(8);
        done();
      });
  });

  it('return 200 with an existing ad id with limit', done => {
    request(server)
      .get(`/v1/ads/${correctAdId}/stats/startDate/${statsStartDate}/endDate/${statsEndDate}?limit=2`)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.ok;
        expect(res.body.stats[0].clicks).to.be.equal(10);
        expect(res.body.stats.length).to.be.equal(2);
        expect(res.body.total).to.be.equal(8);
        done();
      });
  });

  it('return 200 with an existing ad id with limit', done => {
    request(server)
      .get(`/v1/ads/${correctAdId}/stats/startDate/${statsStartDate}/endDate/${statsEndDate}?limit=2&sort=cost_per_click`)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.ok;
        expect(res.body.stats[0].clicks).to.be.equal(30);
        expect(res.body.stats.length).to.be.equal(2);
        expect(res.body.total).to.be.equal(8);
        done();
      });
  });

  it('return 200 with an existing ad id with limit', done => {
    request(server)
      .get(`/v1/ads/${correctAdId}/stats/startDate/${statsStartDate}/endDate/${statsEndDate}?limit=2&sort=cost_per_click&skip=7`)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.ok;
        expect(res.body.stats[0].clicks).to.be.equal(1);
        expect(res.body.stats.length).to.be.equal(1);
        expect(res.body.total).to.be.equal(8);
        done();
      });
  });
});
