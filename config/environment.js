const {
  version
} = require('./../package');

const config = () => {
  return {
    projectName: process.env.PROJECT_NAME,
    service: {
      port: process.env.SERVICE_PORT,
      host: process.env.SERVICE_HOST,
      version
    },
    env: process.env.NODE_ENV,
    db: {
      conn: process.env.DB_CONN,
      dbName: process.env.DB_NAME
    }
  }
}

module.exports = config