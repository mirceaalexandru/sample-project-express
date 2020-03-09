const environment = require('./environment')
const schema = require('./schema')

const internals = {}

async function init() {
  // try to load using dotenv
  // in production dotenv will not be installed so this will not be used.
  // In this way we are sure that no .env file is loaded in production
  // and all configuration is retrieved from env
  try {
    // eslint-disable-next-line
    require('dotenv').config({path: '.env', silent: true})
  } catch (err) {
    // ignore this error for production
  }

  internals.config = await schema.validate(environment());
  console.log({config: internals.config}, 'Load using configuration'); // eslint-disable-line
  return get();
}

function get() {
  return internals.config.value;
}

module.exports = {
  init,
  get
}
