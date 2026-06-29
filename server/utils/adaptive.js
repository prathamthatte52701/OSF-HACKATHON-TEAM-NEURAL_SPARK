const TIMER_NORMAL = 60 // seconds
const TIMER_SPEED  = 30 // seconds

// ─── Difficulty Calculation ───────────────────────────────────────────────────
const getNextDifficulty = (last3Answers, last3Times, timerLimit = TIMER_NORMAL) => {
  if (last3Answers.length < 3) return 'EASY'

  const allCorrect = last3Answers.every(a => a === true)
  const allFast    = last3Times.every(t => t < timerLimit / 2)
  const twoWrong   = last3Answers.filter(a => a === false).length >= 2

  if (allCorrect && allFast) return 'HARD'
  if (twoWrong) return 'EASY'
  return 'MEDIUM'
}

// ─── Level Up Check ───────────────────────────────────────────────────────────
// Range: 5 (pro) to 20 (dumb) questions per level
// Pro path:  5–10q → HARD difficulty + >70% accuracy → level up fast
// Mid path: 10–15q → MEDIUM + >60% → level up
// Max-question retries are handled by the batch engine, which lowers difficulty
// and restarts the level instead of promoting without 60% mastery.
const shouldLevelUp = (levelData) => {
  const { questionsAttempted, correctAnswers, currentDifficulty } = levelData
  if (questionsAttempted < 5) return false

  const accuracy = (correctAnswers || 0) / questionsAttempted

  // Pro path: HARD difficulty, >70% accuracy, at least 5 questions
  if (currentDifficulty === 'HARD' && accuracy >= 0.7 && questionsAttempted >= 5) return true

  // Mid path: >60% accuracy, at least 10 questions
  if (accuracy >= 0.6 && questionsAttempted >= 10) return true

  return false
}

// ─── Question Type Selection ──────────────────────────────────────────────────
const getQuestionType = (level, difficulty) => {
  if (level === 1) {
    // Level 1: only MCQ (simplest)
    return 'MCQ'
  }
  if (level === 2) {
    // Level 2: MCQ or predict output
    return Math.random() > 0.4 ? 'MCQ' : 'OUTPUT_PREDICT'
  }
  if (level === 3) {
    // Level 3: MCQ or fill blank
    if (difficulty === 'EASY') return 'MCQ'
    return Math.random() > 0.5 ? 'FILL_BLANK' : 'MCQ'
  }
  if (level === 4) {
    // Level 4: fill blank or output predict
    if (difficulty === 'EASY') return 'MCQ'
    return Math.random() > 0.4 ? 'FILL_BLANK' : 'OUTPUT_PREDICT'
  }
  // Level 5: IDE/code challenge
  return 'CODE'
}

// ─── Points Calculation ───────────────────────────────────────────────────────
const calculatePoints = ({ isCorrect, timeTaken, level, streak, speedMode, timerLimit = TIMER_NORMAL }) => {
  if (!isCorrect) return 0

  const base        = 10
  const speedBonus  = timeTaken < timerLimit / 2 ? 5 : 0
  const levelBonus  = level * 5
  const streakBonus = Math.min((streak || 0) * 2, 20)
  const multiplier  = speedMode ? 2 : 1

  return (base + speedBonus + levelBonus + streakBonus) * multiplier
}

// ─── Batch System Helpers ─────────────────────────────────────────────────────

// Level type based on level number
const getLevelType = (level) => {
  if (level <= 2) return 'MCQ'
  if (level <= 4) return 'FILL'
  return 'IDE'
}

// Batch size per level type
const getBatchSize = (levelType) => {
  if (levelType === 'IDE') return 3
  return 5  // MCQ and FILL both use 5
}

// Per-topic question limits per level [L1, L2, L3, L4, L5]
const TOPIC_LEVEL_LIMITS = {
  'variables':      [15, 15, 11, 11,  8],
  'data-types':     [17, 17, 13, 13, 10],
  'conditions':     [22, 22, 18, 18, 10],
  'strings':        [22, 22, 18, 18, 10],
  'functions':      [22, 22, 18, 18, 10],
  'lists':          [22, 22, 18, 18, 10],
  'error-handling': [22, 22, 18, 18, 10],
  'loops':          [27, 27, 22, 22, 12],
  'oop':            [27, 27, 22, 22, 12],
  'algorithms':     [27, 27, 22, 22, 12],
}

// Max questions for a given topic and level (1-5)
const getMaxQuestions = (topicId, level) => {
  const limits = TOPIC_LEVEL_LIMITS[topicId] || TOPIC_LEVEL_LIMITS['conditions']
  return limits[(level || 1) - 1] || 20
}

// Check if a batch result passes (>= 60% correct)
const checkBatchResult = (correctInBatch, batchSize) => {
  return correctInBatch / batchSize >= 0.6
}

// Trigger theory review after 3 consecutive fails on same level
const shouldTriggerTheory = (failCount) => {
  return failCount >= 3
}

// Decrease difficulty one step (HARD→MEDIUM, MEDIUM→EASY, EASY stays)
const decreaseDifficulty = (current) => {
  if (current === 'HARD')   return 'MEDIUM'
  if (current === 'MEDIUM') return 'EASY'
  return 'EASY'
}

// Increase difficulty one step (EASY→MEDIUM, MEDIUM→HARD, HARD stays)
const increaseDifficulty = (current) => {
  if (current === 'EASY')   return 'MEDIUM'
  if (current === 'MEDIUM') return 'HARD'
  return 'HARD'
}

module.exports = {
  getNextDifficulty, shouldLevelUp, getQuestionType, calculatePoints,
  TIMER_NORMAL, TIMER_SPEED,
  getLevelType, getBatchSize, getMaxQuestions,
  checkBatchResult, shouldTriggerTheory, decreaseDifficulty, increaseDifficulty,
}
