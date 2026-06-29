const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/update', authMiddleware, async (req, res) => {
  try {
    const { hobby, language, speedMode } = req.body;
    const update = {};
    if (hobby) update.hobby = hobby;
    if (language) update.language = language;
    if (speedMode !== undefined) update.speedMode = speedMode;

    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/streak', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const today = new Date().toDateString();
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate).toDateString() : null;
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (lastActive === today) {
      return res.json({ streak: user.streak, message: 'Already updated today' });
    }

    if (lastActive === yesterday) {
      user.streak += 1;
    } else if (lastActive && lastActive !== today) {
      if (user.streakFreeze) {
        user.streakFreeze = false;
      } else {
        user.streak = 1;
      }
    } else {
      user.streak = 1;
    }

    user.lastActiveDate = new Date();

    // Unlock streak freeze at 7-day streak
    if (user.streak === 7 && !user.streakFreeze) {
      user.streakFreeze = true;
    }

    await user.save();
    res.json({ streak: user.streak, streakFreeze: user.streakFreeze });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/onboarding', authMiddleware, async (req, res) => {
  try {
    const { hobby, language } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { hobby, language, onboardingComplete: true },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
