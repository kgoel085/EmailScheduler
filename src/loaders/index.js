const expressLoader = require('./modules/express')
const databaseLoader = require('./modules/database')
const cronTaskLoader = require('./modules/cron_tasks')

module.exports = async ({ expressApp }) => {
  await databaseLoader({ app: expressApp }) // Initiate Database connection
  await expressLoader({ app: expressApp }) // Initiate Express server
  await cronTaskLoader({ app: expressApp }) // Cron tasks
}
