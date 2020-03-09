const {
  init: configInit
} = require('./../config');
const {
  executeClean: execute
} = require('./dbHelper');

async function runIt() {
  const config = await configInit();

  if (config.env !== 'development') {
    console.log('This script is not safe to run in any other environment than \'development\'. Abort...');
    return;
  }

  await execute(config);
}

(
  async () => {await runIt()}
)()
