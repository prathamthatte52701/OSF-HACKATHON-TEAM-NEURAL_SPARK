require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const mongoose = require('mongoose')

const User = require('../models/User')
const Progress = require('../models/Progress')
const Topic = require('../models/Topic')
const DailyChallenge = require('../models/DailyChallenge')
const topicsData = require('../constants/topics')

async function seedTopics() {
  for (const topic of topicsData) {
    await Topic.findOneAndUpdate(
      { topicId: topic.topicId },
      {
        ...topic,
        cachedTheory: { english: '', hindi: '' },
        cachedDetailedTheory: { english: '', hindi: '' },
      },
      { upsert: true, setDefaultsOnInsert: true, returnDocument: 'after' }
    )
  }

  await Topic.updateMany({}, {
    $set: {
      'cachedTheory.english': '',
      'cachedTheory.hindi': '',
      'cachedDetailedTheory.english': '',
      'cachedDetailedTheory.hindi': '',
    },
    $unset: {
      'cachedTheory.generatedAt': '',
      'cachedDetailedTheory.generatedAt': '',
    },
  })
}

async function clearDB() {
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
    family: 4,
    tls: true,
  })
  console.log('Connected')

  await Promise.all([
    User.deleteMany({}),
    Progress.deleteMany({}),
    Topic.deleteMany({}),
    DailyChallenge.deleteMany({}),
  ])
  console.log('Cleared users, progress, topics, and daily challenges')

  await seedTopics()
  console.log('Topics preserved/re-seeded and theory caches cleared')

  const [userCount, progressCount, topicCount, dailyChallengeCount] = await Promise.all([
    User.countDocuments(),
    Progress.countDocuments(),
    Topic.countDocuments(),
    DailyChallenge.countDocuments(),
  ])

  console.log(JSON.stringify({
    users: userCount,
    progress: progressCount,
    topics: topicCount,
    dailyChallenges: dailyChallengeCount,
  }, null, 2))

  if (userCount !== 0 || progressCount !== 0 || topicCount !== 10 || dailyChallengeCount !== 0) {
    throw new Error('Reset verification failed')
  }

  await mongoose.disconnect()
}

clearDB()
  .then(() => process.exit(0))
  .catch(async (err) => {
    console.error(err)
    try { await mongoose.disconnect() } catch {}
    process.exit(1)
  })
