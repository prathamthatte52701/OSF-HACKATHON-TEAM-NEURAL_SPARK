const express          = require('express')
const protect          = require('../middleware/auth')
const { updateStreak } = require('../utils/streakHandler')

const router = express.Router()

// POST /api/streak/update — call on every meaningful activity
router.post('/update', protect, async (req, res) => {
  try {
    const user = await updateStreak(req.user._id)
    res.json({
      streak: user.streak,
      longestStreak: user.longestStreak,
      streakFreeze: user.streakFreeze,
      lastActiveDate: user.lastActiveDate,
    })
  } catch (err) {
    console.error('Streak update error:', err)
    res.status(500).json({ message: 'Failed to update streak' })
  }
})

module.exports = router
