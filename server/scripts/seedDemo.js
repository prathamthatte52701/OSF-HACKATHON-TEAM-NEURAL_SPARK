require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const User = require('../models/User')
const Progress = require('../models/Progress')

const DEMO_EMAIL = 'demo@stembhasha.com'
const DEMO_PASSWORD = 'Demo@1234'

const levelData = (completed = false, type = 'MCQ') => ({
  completed,
  questionsAttempted: completed ? 5 : 0,
  correctAnswers: completed ? 5 : 0,
  currentDifficulty: completed ? 'HARD' : 'EASY',
  last3Answers: completed ? [true, true, true] : [],
  last3Times: completed ? [12, 10, 9] : [],
  speedModeUsed: false,
  currentBatchCorrect: 0,
  currentBatchCount: 0,
  failCount: 0,
  levelType: type,
  theoryNeeded: false,
})

const run = async () => {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI missing')
  await mongoose.connect(process.env.MONGODB_URI)

  await User.deleteOne({ email: DEMO_EMAIL })

  const user = await User.create({
    name: 'Demo User',
    email: DEMO_EMAIL,
    password: await bcrypt.hash(DEMO_PASSWORD, 12),
    onboardingComplete: true,
    hobby: 'cricket',
    language: 'english',
    streak: 7,
    longestStreak: 7,
    totalPoints: 2500,
    weeklyPoints: 2500,
    dailyPoints: 2500,
    badges: ['first_step', 'on_fire', 'week_warrior'],
    speedModeEnabled: false,
  })

  await Progress.findOneAndUpdate(
    { userId: user._id, topicId: 'variables' },
    {
      userId: user._id,
      topicId: 'variables',
      currentLevel: 5,
      levels: {
        1: levelData(true, 'MCQ'),
        2: levelData(true, 'MCQ'),
        3: levelData(true, 'FILL'),
        4: levelData(true, 'FILL'),
        5: levelData(true, 'IDE'),
      },
      topicCompleted: true,
      completedAt: new Date(),
      aiChallengeUnlocked: true,
      aiChallengeCompleted: false,
      aiChallengeScore: 0,
      wrongAnswers: [],
      consecutiveCorrect: 10,
      updatedAt: new Date(),
    },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  )

  console.log(JSON.stringify({ demoEmail: DEMO_EMAIL, users: await User.countDocuments(), progress: await Progress.countDocuments() }, null, 2))
  await mongoose.disconnect()
}

run().catch(async err => {
  console.error(err.message)
  try { await mongoose.disconnect() } catch {}
  process.exit(1)
})
