module.exports = {
  config: {
    service: {},
    env: 'test',
    db: {
      conn: 'mongodb://localhost:27017',
      // using a different database than the database used for development
      // as this one will be deleted and populated each time the tests are executed
      dbName: 'challenge_test'
    }
  },
  campaign1: {
    status: 'Pending',
    goal: 'Sales',
    total_budget: 89,
    id: '2c4b12d4-84a1-4698-a9f2-3a436728110e',
    name: 'Campaign67db978c-a19d-4590-91f0-9d112b0916e1'
  },
  updatedCampaign: {
    status: 'Pending',
    goal: 'Sales1',
    total_budget: 189,
    id: '2c4b12d4-84a1-4698-a9f2-3a436728110e',
    name: 'UpdatedCampaign'
  },
  wrongCampaignId: '2c4b12d4-84a1-4698-a9f2-3a436728110a',
  adGroupsForCampaign1: [
    {
      age_range: [ 20, 39 ],
      name: 'Ad group55e6eff5-173b-40ff-bdf7-5a38d9104d1e',
      locations: [ 'Zurich' ],
      campaign_id: '2c4b12d4-84a1-4698-a9f2-3a436728110e',
      keywords: [ 'Best football boots' ],
      genders: [ 'Male', 'Female' ],
      id: '2e04f341-8176-45cc-bc50-a6a65487f737'
    },
    {
      age_range: [ 20, 41 ],
      name: 'Ad group6dcc2922-4ad2-47f8-888f-0d613662522a',
      locations: [ 'Zurich' ],
      campaign_id: '2c4b12d4-84a1-4698-a9f2-3a436728110e',
      keywords: [ 'Best football boots' ],
      genders: [ 'Male', 'Female' ],
      id: '85eb49f9-b508-47f4-98e3-945bb8c6b451'
    },
    {
      age_range: [ 20, 22 ],
      name: 'Ad groupc7c23167-2070-492e-ac98-b723f85f4c4e',
      locations: [ 'Basel' ],
      campaign_id: '2c4b12d4-84a1-4698-a9f2-3a436728110e',
      keywords: [ 'Best shoes' ],
      genders: [ 'Male', 'Female' ],
      id: 'baad8b03-9880-4041-b3cf-90ab1911fc61'
    },
    {
      age_range: [ 20, 35 ],
      name: 'Ad groupe9737ba9-852e-4008-9f21-d1e7312c47a7',
      locations: [ 'Bern' ],
      campaign_id: '2c4b12d4-84a1-4698-a9f2-3a436728110e',
      keywords: [ 'Best football boots' ],
      genders: [ 'Male', 'Female' ],
      id: '25393b4c-da4a-49f1-91e9-d0e2890a476d'
    },
    { age_range: [ 20, 47 ],
      name: 'Ad groupd47c965e-d41c-470a-89f5-f106e1e70328',
      locations: [ 'Basel' ],
      campaign_id: '2c4b12d4-84a1-4698-a9f2-3a436728110e',
      keywords: [ 'Best shoes' ],
      genders: [ 'Male', 'Female' ],
      id: '1bfda269-269f-480e-abbd-eb9eda041083'
    }
  ],
  updatedAdGroup: {
    age_range: [ 12, 14 ],
    name: 'Ad group updated',
    locations: [ 'Paris' ],
    campaign_id: '2c4b12d4-84a1-4698-a9f2-3a436728110e',
    keywords: [ 'Best tenis boots' ],
    genders: [ 'Female' ],
    id: '2e04f341-8176-45cc-bc50-a6a65487f737'
  },
  updatedAd: {
    description: 'Description updated',
    ad_group_id: '2e04f341-8176-45cc-bc50-a6a65487f737',
    url: 'nanos.ai.updated',
    image: 'dummy_image_updated.jpg',
    header: 'Header updated',
    id: 'b8f2c15d-f046-4040-9291-7efab796440e'
  },
  statsStartDate: '2020-01-09T11:11:06.000Z',
  statsEndDate: '2020-01-20T11:11:06.000Z',
  correctAdId: 'b8f2c15d-f046-4040-9291-7efab796440e'
}