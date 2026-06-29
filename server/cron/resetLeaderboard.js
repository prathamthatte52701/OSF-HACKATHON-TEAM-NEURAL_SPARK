const cron = require('node-cron')
const User = require('../models/User')

const startCronJobs = () => {
  // Daily reset — every midnight (00:00)
  cron.schedule('0 0 * * *', async () => {
    console.log('[CRON] Daily points reset')
    await User.updateMany({}, { $set: { dailyPoints: 0 } })
  })

  // Weekly reset — Sunday at 12:01 AM
  cron.schedule('1 0 * * 0', async () => {
    console.log('[CRON] Weekly points reset')
    await User.updateMany({}, { $set: { weeklyPoints: 0 } })
  })

  console.log('[CRON] Leaderboard reset jobs scheduled ✅')
}

module.exports = startCronJobs
