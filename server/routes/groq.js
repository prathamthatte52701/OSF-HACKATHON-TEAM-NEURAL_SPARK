const express          = require('express')
const protect          = require('../middleware/auth')
const { groqQuestion, groqAnswer, groqChallenge, groqCall } = require('../config/groq')
const { getQuestionType } = require('../utils/adaptive')
const Topic            = require('../models/Topic')
const hobbyStemMap     = require('../constants/hobbyStemMap')
const feedbackMessages = require('../constants/feedbackMessages')
const pythonNotes      = require('../data/pythonNotes')

const router = express.Router()
const optionalProtect = protect.optional
const VALID_LANGUAGES   = new Set(['english', 'hindi', 'tamil', 'malayalam'])
const normalizeLanguage = (language) => VALID_LANGUAGES.has(language) ? language : 'english'
const normalizeHobby    = (hobby) => hobby || 'cricket'
const langLabel = (lang) => ({ english: 'English', hindi: 'Hindi', tamil: 'Tamil', malayalam: 'Malayalam' })[lang] || 'English'
const langInstruction = (lang) => ({
  english:   'Write in English.',
  hindi:     'Write in Hindi. Keep all Python code in English.',
  tamil:     'Write in Tamil (தமிழ்). Keep all Python code and keywords (print, def, if, for, while, return, True, False, None) in English.',
  malayalam: 'Write in Malayalam (മലയാളം). Keep all Python code and keywords in English.',
})[lang] || 'Write in English.'
const questionRateLimit = new Map()

const getRequesterId = (req) => req.user?._id?.toString?.() || req.ip || 'anonymous'

const isQuestionRateLimited = (req) => {
  const key = getRequesterId(req)
  const now = Date.now()
  const last = questionRateLimit.get(key) || 0
  questionRateLimit.set(key, now)
  if (questionRateLimit.size > 1000) {
    for (const [id, timestamp] of questionRateLimit) {
      if (now - timestamp > 60000) questionRateLimit.delete(id)
    }
  }
  return now - last < 2000
}

// ─── POST /api/groq/question — uses KEY_2 (groqQuestion) ─────────────────────
router.post('/question', optionalProtect, async (req, res) => {
  try {
    if (isQuestionRateLimited(req)) {
      return res.status(200).json({ useFallback: true, reason: 'rate_limited' })
    }

    const {
      topicId: _topicId, concept, level, difficulty, questionsAttempted,
      previousQuestion, previousQuestions, previousAnswer, language: requestedLanguage, hobby: requestedHobby,
    } = req.body || {}
    const topicId = _topicId || concept
    if (!topicId) return res.status(200).json({ useFallback: true, reason: 'missing_topic' })

    const user     = req.user || {}
    const topic    = await Topic.findOne({ topicId })
    if (!topic) return res.status(404).json({ message: 'Topic not found' })

    const hobby    = normalizeHobby(requestedHobby || user.hobby)
    const language = normalizeLanguage(requestedLanguage || user.language)
    const langInstr = langInstruction(language)
    const stemCtx  = topic.stemContext
    const hobbyMap = hobbyStemMap[hobby]?.[topicId]
    const qType    = getQuestionType(level, difficulty)

    const notes = pythonNotes[topicId]

    const stemSubject    = stemCtx?.subject || 'Science'
    const stemConnection = stemCtx?.connection || 'programming fundamentals'
    const hobbyExample   = hobbyMap?.example || `${hobby} scenario`
    const hobbySTEM      = hobbyMap?.stemConnection || `${hobby} data analysis`

    const prompt = `You are a STEM + Python question generator for Indian students. Your goal is to teach Python through real STEM applications using the student's hobby as the setting.

CORE IDENTITY OF EVERY QUESTION:
A ${stemSubject} professional is using Python to solve a real ${stemSubject} problem in the world of ${hobby}.
The hobby is the SETTING. ${stemSubject} is the PROBLEM being solved. Python is the TOOL.

STUDENT PROFILE:
- Python Concept: ${topic.name}
- Level: ${level}/5 | Difficulty: ${difficulty} | Question Type: ${qType}
- Hobby: ${hobby}
- STEM Subject: ${stemSubject}
- STEM Connection to this concept: "${stemConnection}"
- Hobby code example: ${hobbyExample}
- Hobby STEM scenario: ${hobbySTEM}
- Language: ${langLabel(language)}
- Questions asked so far: ${questionsAttempted || 0}
- Previous question: ${previousQuestion || 'None'}
- Previous questions this session: ${JSON.stringify(previousQuestions || [])}

PYTHON REFERENCE (use for accuracy):
Key concepts: ${notes?.concepts?.slice(0, 6).join(' | ') || 'core concepts'}
Code patterns: ${notes?.code_examples?.slice(0, 2).join('\n---\n') || 'standard patterns'}
Common mistakes: ${notes?.common_mistakes?.join(' | ') || 'none'}

HOW TO BUILD THE QUESTION (read carefully):

EASY difficulty:
- Scenario: A ${hobby} coach/player uses Python to track simple ${stemSubject} data
- The question tests ONE Python concept directly
- Variable names must come from ${hobby} + ${stemSubject} world
- Example frame: "A sports scientist tracking ${hobby} data writes: [simple code]. What is..."

MEDIUM difficulty:
- Scenario: A ${stemSubject} analyst is processing ${hobby} data using Python
- Requires applying the concept, not just recognizing it
- Must involve a small calculation or data transformation related to ${hobbySTEM}
- Example frame: "An engineer building a ${hobby} analytics tool writes: [code]. What happens when..."

HARD difficulty:
- Scenario: A ${stemSubject} researcher is building a Python system for ${hobby} — they hit a problem
- Student must debug or complete the solution using deep concept knowledge
- The problem must feel like a REAL ${stemSubject} challenge (measurements, statistics, models, formulas)
- Wrong options must trap students who know Python but miss the ${stemSubject} logic
- Example frame: "A data scientist analyzing ${hobby} performance metrics needs to [specific STEM task]. Write/fix the code that..."

QUESTION TYPE RULES:
MCQ: 4 options, 1 correct. Wrong options = plausible Python mistakes OR STEM reasoning errors. Never obviously wrong.
FILL_BLANK: Python code with exactly ONE ___ blank. Single keyword/value/operator. One correct answer only.
CODE: Clear STEM+hobby problem. Expected output must be exact — no trailing spaces or extra newlines.

ABSOLUTE RULES:
- NEVER repeat or resemble previous questions
- All Python code must be syntactically correct
- correctAnswer must exactly match Python output/accepted input
- Hints: hint1 = Python clue from knowledge base | hint2 = STEM+hobby analogy | hint3 = near-answer
- ${langInstr}

Return ONLY this JSON — no markdown, no explanation:
{
  "questionType": "${qType}",
  "question": "question text",
  "code": "code snippet or null",
  "options": ["A text", "B text", "C text", "D text"] or null,
  "correctAnswer": "exact correct answer",
  "expectedOutput": "exact output for CODE type or null",
  "hint1": "subtle clue from knowledge base",
  "hint2": "hobby-based example hint",
  "hint3": "almost the answer"
}`

    const raw = await groqCall(groqQuestion, [{ role: 'user', content: prompt }], 700)
    const clean = raw.replace(/```json|```/g, '').trim()
    let question
    try {
      question = JSON.parse(clean)
    } catch {
      return res.status(200).json({ useFallback: true, reason: 'bad_json' })
    }

    res.status(200).json({ question })

  } catch (err) {
    console.error('Question Generation Error:', err)
    res.status(200).json({ message: 'Question generation failed', useFallback: true })
  }
})

// ─── POST /api/groq/wrong-summary — uses KEY_3 (groqAnswer) ─────────────────
router.post('/wrong-summary', optionalProtect, async (req, res) => {
  try {
    const { topicId, question, userAnswer, correctAnswer, questionType, isTimeout, isCorrect: answerWasCorrect, language: requestedLanguage } = req.body || {}
    const user     = req.user || {}
    const topic    = await Topic.findOne({ topicId })
    const notes    = pythonNotes[topicId]
    const lang     = langLabel(normalizeLanguage(requestedLanguage || user.language))
    const langInstr2 = langInstruction(normalizeLanguage(requestedLanguage || user.language))
    const hobby    = normalizeHobby(req.body.hobby || user.hobby)
    const hobbyMap = hobbyStemMap[hobby]?.[topicId]
    const hobbyEx  = hobbyMap?.example || `${hobby} example`

    const prompt = answerWasCorrect
      ? `You are an enthusiastic Python tutor. The student answered correctly — reinforce their understanding.

WHAT HAPPENED:
- Concept: ${topic?.name || topicId}
- Question: ${question}
- Student Answer: ${userAnswer} ✅ (Correct!)
- Correct Answer: ${correctAnswer}

STUDENT CONTEXT:
- Hobby: ${hobby}
- Hobby Example: ${hobbyEx}
- Language: ${lang}

PYTHON KNOWLEDGE BASE:
Key Facts: ${notes?.key_facts?.slice(0, 3).join(', ') || 'None'}
Code patterns: ${notes?.code_examples?.[0] || 'None'}

Write a short reinforcement with EXACTLY this structure:

✅ Why this is correct:
(1-2 lines — explain WHY this answer works, not just that it's right. Be specific to their answer.)

💡 Deeper insight:
(1 line — one extra fact about this concept they may not know, from knowledge base)

🏏 Real world use:
(1 line — connect to ${hobby}: how a ${hobby} enthusiast would use this in real Python code)

RULES:
- Maximum 5 lines total
- Celebrate their correct answer but focus on building deeper understanding
- Even if they guessed, they now learn WHY it's correct
- ${langInstr2}
- Return only the explanation — no JSON, no extra labels`
      : `You are a friendly Python tutor explaining a mistake.

WHAT HAPPENED:
- Concept: ${topic?.name || topicId}
- Question: ${question}
- Student Answer: ${userAnswer || (isTimeout ? 'Did not answer — time ran out' : 'Did not answer')}
- Correct Answer: ${correctAnswer}
- Question Type: ${questionType || 'Unknown'}

STUDENT CONTEXT:
- Hobby: ${hobby}
- Hobby Example: ${hobbyEx}
- Language: ${lang}

PYTHON KNOWLEDGE BASE:
Common Mistakes: ${notes?.common_mistakes?.join(', ') || 'None'}
Key Facts: ${notes?.key_facts?.slice(0, 3).join(', ') || 'None'}

Write explanation with EXACTLY this structure:

❌ What went wrong:
(1 line — specific, not vague. Reference their actual wrong answer.)

✅ Correct approach:
(1-2 lines — explain using hobby example from context above)
(If code question: show the correct 1-2 lines)

💡 Remember:
(1 line — key fact from knowledge base relevant to this mistake)

🔥 You've got this:
(1 encouraging line — reference their hobby)

RULES:
- Maximum 6 lines total
- Never say 'you are wrong' or anything discouraging
- Be specific — reference their actual answer
- Use hobby naturally — do not force it
- ${langInstr2}
- Return only the explanation — no JSON, no labels beyond the emoji headers`

    const summary = await groqCall(groqAnswer, [{ role: 'user', content: prompt }], 350)
    res.status(200).json({ summary })

  } catch (err) {
    console.error('Summary Error:', err)
    const fbLang = normalizeLanguage(req.body?.language || req.user?.language)
    const fallback = feedbackMessages.fallbackWrong[fbLang] || feedbackMessages.fallbackWrong.english
    res.status(200).json({ summary: fallback, fallback: true })
  }
})

// ─── POST /api/groq/ide-check — uses KEY_3 (groqAnswer) ─────────────────────
router.post('/ide-check', optionalProtect, async (req, res) => {
  try {
    const { code, expectedOutput, userOutput, topicId, language } = req.body || {}
    const topic = await Topic.findOne({ topicId })

    const prompt = `A student wrote Python code. Review it and explain what went wrong.

STUDENT CODE:
${code}

EXPECTED OUTPUT: ${expectedOutput}
ACTUAL OUTPUT: ${userOutput}
CONCEPT: ${topic?.name || topicId}
LANGUAGE: ${langLabel(normalizeLanguage(language))}

Instructions:
1. Line 1: What the code is doing wrong (specific)
2. Line 2: What needs to be fixed (clear direction)
3. Line 3: Encouragement

Rules:
- Maximum 3 lines
- No complete solution — guide only
- ${langInstruction(normalizeLanguage(language))}
- Return ONLY the feedback.`

    const feedback = await groqCall(groqAnswer, [{ role: 'user', content: prompt }], 250)
    res.status(200).json({ feedback })

  } catch (err) {
    const fbLang2 = normalizeLanguage(req.body?.language)
    res.status(200).json({
      feedback: feedbackMessages.ideFallback[fbLang2] || feedbackMessages.ideFallback.english,
    })
  }
})

// ─── POST /api/groq/challenge-question — uses KEY_4 (groqChallenge) ──────────
router.post('/challenge-question', protect, async (req, res) => {
  try {
    const { topicId, questionNum, previousQuestions, previousAnswers, language: requestedLanguage } = req.body || {}
    const user     = req.user
    const topic    = await Topic.findOne({ topicId })
    const hobbyMap = hobbyStemMap[user?.hobby]?.[topicId]

    const notes = pythonNotes[topicId]
    const challengeNotesCtx = notes ? `
REFERENCE KNOWLEDGE BASE (use to evaluate answers and frame questions):
Key Concepts: ${notes.concepts.join(' | ')}
Common Mistakes: ${notes.common_mistakes.join(' | ')}
Key Facts: ${notes.key_facts.join(' | ')}
Advanced (for Q7-Q10): ${notes.level_progression?.[4] || ''} | ${notes.level_progression?.[5] || ''}
` : ''

    const prompt = `You are a strict but fair technical interviewer conducting a Python concept interview.

INTERVIEW CONTEXT:
Topic: ${topic?.name || topicId}
Hobby Context: ${hobbyMap?.example || 'general programming'}
Language: ${langLabel(normalizeLanguage(requestedLanguage || user.language))}
Question Number: ${questionNum}/10
Previous Questions: ${JSON.stringify(previousQuestions || [])}
Previous Answers: ${JSON.stringify(previousAnswers || [])}
${challengeNotesCtx}
YOUR JOB:
- Evaluate the last answer (if any). Was it conceptually correct and complete?
- If YES and you are satisfied → respond EXACTLY with the single word: GREAT
- If NO or it's question 1 → ask the next interview question

QUESTION PROGRESSION:
- Q1-Q3: Basic understanding
- Q4-Q6: Application ("How would you use this in a real scenario?")
- Q7-Q9: Deep understanding ("What happens if... Why does...")
- Q10: Real hobby-based scenario question (hardest)

STRICT RULES:
1. NEVER repeat previous questions
2. NEVER be vague — ask specific, focused questions
3. Use the hobby context in Q7-Q10
4. If the answer is partially right, ask a clarifying follow-up
5. Be strict — do not accept vague answers
6. ${langInstruction(normalizeLanguage(requestedLanguage || user.language))}

RESPOND WITH:
- EXACTLY "GREAT" if satisfied (nothing else, no punctuation)
- OR the next interview question (one question only, no extra text)`

    const response = await groqCall(groqChallenge, [{ role: 'user', content: prompt }], 200)
    const isComplete = response.trim().toUpperCase() === 'GREAT'
    res.status(200).json({ question: response, isComplete })

  } catch (err) {
    console.error('Challenge Error:', err)
    res.status(200).json({
      question: {
        hindi:     'Chaliye ek simple Python concept se shuru karte hain. Is topic ka ek practical use batao.',
        tamil:     'ஒரு simple Python concept-இல் இருந்து தொடங்குவோம். இந்த topic-இன் ஒரு practical use சொல்லுங்கள்.',
        malayalam: 'ഒരു simple Python concept-ൽ നിന്ന് തുടങ്ങാം. ഈ topic-ന്റെ ഒരു practical use പറയൂ.',
      }[normalizeLanguage(req.body?.language || req.user?.language)] || 'Let us start with a simple Python concept. Tell me one practical use of this topic.',
      isComplete: false,
      fallback: true,
    })
  }
})

module.exports = router
