const User     = require('../models/User')
const Progress = require('../models/Progress')

const updateStreak = async (userId) => {
  const user       = await User.findById(userId)
  const today      = new Date().toDateString()
  const lastActive = user.lastActiveDate?.toDateString()
  const yesterday  = new Date(Date.now() - 86400000).toDateString()

  if (today === lastActive) return user // already active today

  if (lastActive === yesterday) {
    user.streak += 1
  } else if (lastActive && lastActive !== today) {
    if (user.streakFreeze) {
      user.streakFreeze = false // burn the freeze, streak stays
    } else {
      user.streak = 1 // reset to 1 (today counts)
    }
  } else {
    user.streak = 1 // first time ever
  }

  // Always update longestStreak after any streak change
  user.longestStreak = Math.max(user.longestStreak, user.streak)
  user.lastActiveDate = new Date()

  // 7-Day Streak Reward
  if (user.streak > 0 && user.streak % 7 === 0) {
    user.streakFreeze = true
    await Progress.updateMany(
      { userId, topicCompleted: true },
      { aiChallengeUnlocked: true }
    )
  }

  await user.save()
  return user
}

module.exports = { updateStreak }
