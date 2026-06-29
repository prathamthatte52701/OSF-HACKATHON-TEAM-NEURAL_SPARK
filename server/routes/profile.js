const express = require('express')
const User    = require('../models/User')
const protect = require('../middleware/auth')

const router = express.Router()

// GET /api/profile — get full user profile
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    res.json({ user })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile' })
  }
})

// PUT /api/profile/update — update hobby, language, speedMode, onboarding
router.put('/update', protect, async (req, res) => {
  try {
    const { hobby, language, speedModeEnabled, onboardingComplete, pointsDelta, avatar } = req.body
    const update = {}

    if (hobby !== undefined)             update.hobby = hobby
    if (language !== undefined)          update.language = language
    if (speedModeEnabled !== undefined)  update.speedModeEnabled = speedModeEnabled
    if (onboardingComplete !== undefined) update.onboardingComplete = onboardingComplete
    if (avatar !== undefined)            update.avatar = avatar

    let user = await User.findById(req.user._id).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })

    Object.assign(user, update)
    if (Number.isFinite(pointsDelta) && pointsDelta !== 0) {
      user.totalPoints = Math.max(0, (user.totalPoints || 0) + pointsDelta)
      user.weeklyPoints = Math.max(0, (user.weeklyPoints || 0) + pointsDelta)
      user.dailyPoints = Math.max(0, (user.dailyPoints || 0) + pointsDelta)
    }

    await user.save()
    res.json({ user })
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile' })
  }
})

module.exports = router
