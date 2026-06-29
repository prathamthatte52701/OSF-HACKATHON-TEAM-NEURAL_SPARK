const express = require('express')
const User    = require('../models/User')
const protect = require('../middleware/auth')

const router = express.Router()

// GET /api/leaderboard/alltime
router.get('/alltime', protect, async (req, res) => {
  try {
    const top = await User.find({})
      .sort({ totalPoints: -1 })
      .limit(10)
      .select('name hobby totalPoints streak badges')
    res.json({ leaderboard: top })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch leaderboard' })
  }
})

// GET /api/leaderboard/weekly
router.get('/weekly', protect, async (req, res) => {
  try {
    const top = await User.find({})
      .sort({ weeklyPoints: -1 })
      .limit(10)
      .select('name hobby weeklyPoints streak')
    res.json({ leaderboard: top })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch leaderboard' })
  }
})

// GET /api/leaderboard/daily
router.get('/daily', protect, async (req, res) => {
  try {
    const top = await User.find({})
      .sort({ dailyPoints: -1 })
      .limit(10)
      .select('name hobby dailyPoints streak')
    res.json({ leaderboard: top })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch leaderboard' })
  }
})

// GET /api/leaderboard/aichallenge
router.get('/aichallenge', protect, async (req, res) => {
  try {
    const top = await User.find({ aiChallengePoints: { $gt: 0 } })
      .sort({ aiChallengePoints: -1 })
      .limit(10)
      .select('name hobby aiChallengePoints badges')
    res.json({ leaderboard: top })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch leaderboard' })
  }
})

module.exports = router
