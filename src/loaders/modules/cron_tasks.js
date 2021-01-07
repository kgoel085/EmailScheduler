const cronTask = require('node-cron')
const { processSchedules } = require('./../../components/Schedule/api')

module.exports = async ({ app }) => {
  // Cron tasks
  cronTask.schedule('*/10 * * * * *', processSchedules) // Check for emails to be sent

  console.log('Cron tasks enabled')
}
