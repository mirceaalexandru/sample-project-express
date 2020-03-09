const {executeClean, executePopulate} = require('./../../scripts/dbHelper');
const {init} = require('../../lib/server');
const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const {
  init: initDb
} = require('./../../lib/db');
const {
  campaign1,
  config,
  wrongCampaignId,
  updatedAd
} = require('./testData');

describe('API tests for ads', () => {
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

  it('return 400 for invalid campaign id', done => {
    request(server)
      .get(`/v1/campaigns/123/ads`)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(400);
        done();
      });
  });

  it('return 404 for campaign id that doesn\'t exist', done => {
    request(server)
      .get(`/v1/campaigns/${wrongCampaignId}/ads`)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(404);
        done()
      });
  });

  it('return 200 with a campaign', done => {
    request(server)
      .get(`/v1/campaigns/${campaign1.id}/ads`)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.ok;
        expect(res.body.ads.length).to.be.equal(15);
        done();
      });
  });

  it('return 200 when updating an ad', done => {
    const {id, ad_group_id, ...update} = updatedAd;
    request(server)
      .put(`/v1/ads/${id}`)
      .send(update)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.ok;
        expect(res.body).to.deep.equal(updatedAd);

        // get the updated value to make sure is actually updated
        request(server)
          .get(`/v1/campaigns/${campaign1.id}/ads`)
          .end(function(err, res) {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.ok;
            expect(res.body.ads[0]).to.deep.equal(updatedAd);
            done();
          });
      });
  });
});
