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
  updatedCampaign
} = require('./testData');

describe('API tests for campaigns', () => {
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
      .get(`/v1/campaigns/123`)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(400);
        done();
      });
  });

  it('return 404 for campaign id that doesn\'t exist', done => {
    request(server)
      .get(`/v1/campaigns/${wrongCampaignId}`)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(404);
        done()
      });
  });

  it('return 200 with a campaign', done => {
    request(server)
      .get(`/v1/campaigns/${campaign1.id}`)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.ok;
        expect(res.body).to.deep.equal(campaign1);
        done();
      });
  });

  it('return 400 for invalid status', done => {
    request(server)
      .get(`/v1/campaigns/status/INVALID`)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(400);
        done();
      });
  });

  it('return 200 for valid status', done => {
    request(server)
      .get(`/v1/campaigns/status/Pending`)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.ok;
        expect(res.body.campaigns.length).to.be.equal(37);
        done();
      });
  });

  it('return 200 when updating a campaign', done => {
    const {id, ...update} = updatedCampaign
    request(server)
      .put(`/v1/campaigns/${id}`)
      .send(update)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.ok;
        expect(res.body).to.deep.equal(updatedCampaign);

        // get the updated value to make sure is actually updated
        request(server)
          .get(`/v1/campaigns/${id}`)
          .end(function(err, res) {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.ok;
            expect(res.body).to.deep.equal(updatedCampaign);
            done();
          });
      });
  });
});
