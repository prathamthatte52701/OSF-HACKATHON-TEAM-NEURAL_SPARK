const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
  // Identity
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [30, 'Name cannot exceed 30 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    maxlength: 64,
  },

  // Avatar
  avatar: { type: String, default: null },

  // Onboarding
  onboardingComplete: { type: Boolean, default: false },
  language: {
    type: String,
    enum: ['english', 'hindi', 'tamil', 'malayalam'],
    default: 'english',
  },
  hobby: {
    type: String,
    enum: ['cricket', 'football', 'badminton', 'kabaddi', 'basketball',
           'dance', 'music', 'gaming', 'cooking', 'art'],
    default: null,
  },

  // Streak
  streak: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: null },
  streakFreeze: { type: Boolean, default: false },
  longestStreak: { type: Number, default: 0 },

  // Points
  totalPoints: { type: Number, default: 0 },
  weeklyPoints: { type: Number, default: 0 },
  dailyPoints: { type: Number, default: 0 },
  aiChallengePoints: { type: Number, default: 0 },

  // Badges
  badges: { type: [String], default: [] },

  // Daily challenge slot completion tracking
  dailyChallengeCompletions: {
    type: [{
      slotId: { type: String, required: true },
      dateKey: { type: String, required: true },
      slotIndex: { type: Number, min: 0, max: 3 },
      challengeId: { type: Number },
      completedAt: { type: Date, default: Date.now },
    }],
    default: [],
  },

  // Settings
  speedModeEnabled: { type: Boolean, default: false },
  isDeveloper:      { type: Boolean, default: false },

  // Leaderboard reset tracking
  weeklyResetDate: { type: Date, default: null },
  dailyResetDate: { type: Date, default: null },

  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('User', userSchema)
