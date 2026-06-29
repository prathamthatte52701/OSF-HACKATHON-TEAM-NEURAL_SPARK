const express                       = require('express')
const protect                       = require('../middleware/auth')
const { checkAndAwardBadges, BADGES } = require('../utils/badgeChecker')
const User                          = require('../models/User')

const router = express.Router()

// GET /api/badge — get user's current badges
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('badges')
    res.json({ badges: user.badges })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch badges' })
  }
})

// POST /api/badge/check — check + award any newly earned badges
router.post('/check', protect, async (req, res) => {
  try {
    const { session } = req.body || {}
    const newBadges = await checkAndAwardBadges(req.user._id, session)
    const user = await User.findById(req.user._id).select('badges')
    res.json({ newBadges, badges: user.badges })
  } catch (err) {
    console.error('Badge check error:', err)
    res.status(500).json({ message: 'Failed to check badges' })
  }
})

module.exports = router
