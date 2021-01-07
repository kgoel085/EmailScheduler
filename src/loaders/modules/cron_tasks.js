const cronTask = require('node-cron')
const { processSchedules } = require('./../../components/Schedule/api')

module.exports = async ({ app }) => {
  // Cron tasks
  const cronTimer = process.env.CRON_TASK_TIMER || '*/10 * * * * *'
  cronTask.schedule(cronTimer, () => {
    console.log('Cron task triggered: Process schedule emails')
    processSchedules()
  }) // Check for emails to be sent

  console.log('Cron tasks enabled')
}
