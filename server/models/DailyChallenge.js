const mongoose = require('mongoose');

const dailyChallengeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  day: { type: Number, required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  pointsEarned: { type: Number, default: 0 }
});

module.exports = mongoose.model('DailyChallenge', dailyChallengeSchema);
