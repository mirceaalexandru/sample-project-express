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
  adGroupsForCampaign1,
  updatedAdGroup
} = require('./testData');

describe('API tests for ad groups', () => {
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
      .get(`/v1/campaigns/123/adGroups`)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(400);
        done();
      });
  });

  it('return 404 for campaign id that doesn\'t exist', done => {
    request(server)
      .get(`/v1/campaigns/${wrongCampaignId}/adGroups`)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(404);
        done()
      });
  });

  it('return 200 with a campaign', done => {
    request(server)
      .get(`/v1/campaigns/${campaign1.id}/adGroups`)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.ok;
        expect(res.body.adGroups).to.deep.equal(adGroupsForCampaign1);
        done();
      });
  });

  it('return 200 when updating a campaign', done => {
    const {id, campaign_id, ...update} = updatedAdGroup;
    request(server)
      .put(`/v1/adGroups/${id}`)
      .send(update)
      .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.ok;
        expect(res.body).to.deep.equal(updatedAdGroup);

        // get the updated value to make sure is actually updated
        request(server)
          .get(`/v1/campaigns/${campaign1.id}/adGroups`)
          .end(function(err, res) {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.ok;
            expect(res.body.adGroups[0]).to.deep.equal(updatedAdGroup);
            done();
          });
      });
  });
});
