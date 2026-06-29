const express      = require('express')
const Topic        = require('../models/Topic')
const protect      = require('../middleware/auth')
const { groqTheory, groqCall } = require('../config/groq')
const hobbyStemMap = require('../constants/hobbyStemMap')
const topicsData   = require('../constants/topics')
const pythonNotes  = require('../data/pythonNotes')

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
  malayalam: 'Write in Malayalam (മലയാളം). Keep all Python code and keywords (print, def, if, for, while, return, True, False, None) in English.',
})[lang] || 'Write in English.'

const fallbackTheory = (topicName, language = 'english') => {
  const msgs = {
    hindi:     `## ${topicName}\n\nAbhi AI theory load nahi ho paayi. Is concept ko samajhne ke liye code examples dekho.\n\n## Key Takeaways\n- Python concept ko small examples se samjho.\n- Code ko line by line trace karo.`,
    tamil:     `## ${topicName}\n\nAI theory இப்போது ஏற்றப்படவில்லை. Code examples பாருங்கள்.\n\n## Key Takeaways\n- Python concept-ஐ சிறிய examples மூலம் புரிந்துகொள்ளுங்கள்.\n- Code-ஐ வரிவரியாக trace செய்யுங்கள்.`,
    malayalam: `## ${topicName}\n\nAI theory ഇപ്പോൾ ലോഡ് ചെയ്തില്ല. Code examples നോക്കൂ.\n\n## Key Takeaways\n- Python concept ചെറിയ examples വഴി മനസ്സിലാക്കൂ.\n- Code line by line trace ചെയ്യൂ.`,
    english:   `## ${topicName}\n\nAI theory could not load right now. Review small code examples and continue with practice questions.\n\n## Key Takeaways\n- Learn the Python concept through small examples.\n- Trace code line by line.`,
  }
  return msgs[normalizeLanguage(language)] || msgs.english
}

// Seed topics on startup
const seedTopics = async () => {
  for (const t of topicsData) {
    await Topic.findOneAndUpdate({ topicId: t.topicId }, t, { upsert: true, setDefaultsOnInsert: true })
  }
  console.log('Topics seeded ✅')
}
seedTopics().catch(err => console.error('Topic seed failed:', err.message))

// GET /api/topics/all
router.get('/all', optionalProtect, async (req, res) => {
  try {
    const topics = await Topic.find().sort('order')
    res.json(topics)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch topics' })
  }
})

// GET /api/topics/:topicId/theory
router.get('/:topicId/theory', optionalProtect, async (req, res) => {
  try {
    const { topicId }      = req.params
    const { language = 'english', refresh = 'false', hobby: requestedHobby } = req.query
    const user             = req.user || {}
    const safeLanguage     = normalizeLanguage(language)
    const safeHobby        = normalizeHobby(requestedHobby || user.hobby)
    const shouldRefresh    = refresh === 'true'

    const topic = await Topic.findOne({ topicId })
    if (!topic) return res.status(404).json({ message: 'Topic not found' })

    // Cache hit
    if (!shouldRefresh && topic.cachedTheory?.[safeLanguage]) {
      return res.status(200).json({ theory: topic.cachedTheory[safeLanguage], cached: true })
    }

    // Generate with GROQ_KEY_1
    const notes       = pythonNotes[topicId] || {}
    const stemSubject = topic.stemContext?.subject || 'Science'
    const stemConn    = topic.stemContext?.connection || 'programming fundamentals'
    const hobbyMap    = hobbyStemMap[safeHobby]?.[topicId]
    const hobbyEx     = hobbyMap?.example || `${safeHobby} example`
    const hobbySTEM   = hobbyMap?.stemConnection || `${safeHobby} data`

    const prompt = `You are a STEM teacher explaining Python to an Indian student. Your mission: make them see that ${stemSubject} professionals use Python to solve real problems — and their hobby (${safeHobby}) is the perfect lens to understand it.

STUDENT PROFILE:
- Concept: ${topic.name}
- Hobby: ${safeHobby}
- STEM Subject: ${stemSubject}
- STEM Application: "${stemConn}"
- Hobby code example: ${hobbyEx}
- Hobby STEM scenario: ${hobbySTEM}
- Language: ${langLabel(safeLanguage)}

PYTHON REFERENCE NOTES (use for accuracy, do NOT copy verbatim):
Key concepts: ${JSON.stringify(notes.concepts?.slice(0, 6) || [])}
Code examples: ${notes.code_examples?.slice(0, 2).join('\n') || ''}
Common mistakes: ${JSON.stringify(notes.common_mistakes?.slice(0, 4) || [])}

Write a structured theory with EXACTLY these sections and headings:

## What is ${topic.name}?
2-3 paragraphs. Start with: "Imagine a ${stemSubject.toLowerCase()} professional working in ${safeHobby}..." — show how ${stemConn} applies to ${hobbySTEM}. Then define the Python concept clearly using the reference notes.

## How Does It Work?
Minimum 4 steps. Each step: one sentence explanation + one Python code example. Use variable names from ${safeHobby} world. Show output for each example. Base code on the reference examples above.

## Common Mistakes
List every mistake from the reference notes. For each: show ❌ wrong code, then ✅ correct code, then one sentence why.

## Real World STEM Connection
2 complete examples. Each example MUST: (1) use ${safeHobby} as the scenario, (2) involve actual ${stemSubject} thinking (measurement/formula/analysis/model), (3) show runnable Python code with output.

## Key Takeaways
5-6 bullet points. Each: one clear sentence. Last bullet: connect ${topic.name} to ${stemSubject} career.

RULES:
- Use ## for headings exactly as shown
- Use \`\`\` for all code blocks
- Minimum 400 words
- Variable names must reflect ${safeHobby} + ${stemSubject} world (not generic a, b, x, y)
- ${langInstruction(safeLanguage)}
- Return only the content, no preamble`

    const theory = await groqCall(groqTheory, [{ role: 'user', content: prompt }], 2000)

    // Save to cache
    await Topic.findOneAndUpdate(
      { topicId },
      {
        [`cachedTheory.${safeLanguage}`]: theory,
        'cachedTheory.generatedAt': new Date(),
      }
    )

    res.status(200).json({ theory, cached: false, refreshed: shouldRefresh })

  } catch (err) {
    console.error('Theory Error:', err)
    const safeLanguage = normalizeLanguage(req.query?.language)
    res.status(200).json({
      theory: fallbackTheory(req.params.topicId, safeLanguage),
      cached: false,
      fallback: true,
    })
  }
})

// GET /api/topics/:topicId/theory-detailed — long theory for struggling students (3 fails)
router.get('/:topicId/theory-detailed', optionalProtect, async (req, res) => {
  try {
    const { topicId } = req.params
    const { language = 'english', hobby: requestedHobby } = req.query
    const user = req.user || {}
    const safeLanguage = normalizeLanguage(language)
    const safeHobby = normalizeHobby(requestedHobby || user.hobby)

    const topic = await Topic.findOne({ topicId })
    if (!topic) return res.status(404).json({ message: 'Topic not found' })

    // Cache hit — return cached detailed theory
    if (topic.cachedDetailedTheory?.[safeLanguage]) {
      return res.status(200).json({ theory: topic.cachedDetailedTheory[safeLanguage], cached: true })
    }

    const hobbyMap2   = hobbyStemMap[safeHobby]?.[topicId]
    const notes       = pythonNotes[topicId]
    const stemSubject = topic.stemContext?.subject || 'Science'
    const stemConn    = topic.stemContext?.connection || 'programming fundamentals'
    const hobbySTEM   = hobbyMap2?.stemConnection || `${safeHobby} data analysis`

    const notesRef = notes ? `
PYTHON REFERENCE NOTES (authoritative — base all examples on these):
Concepts: ${notes.concepts.join(' | ')}
Code Examples:
${notes.code_examples.slice(0, 4).join('\n---\n')}
Common Mistakes: ${notes.common_mistakes.join(' | ')}
Key Facts: ${notes.key_facts.join(' | ')}
` : ''

    const prompt = `You are a STEM teacher. A student has failed 3 times on this Python concept. They need deep understanding — not just syntax, but WHY this concept matters in ${stemSubject} and how it applies to their world.

STUDENT PROFILE:
- Concept: ${topic.name}
- Hobby: ${safeHobby}
- STEM Subject: ${stemSubject}
- STEM Connection: "${stemConn}"
- Hobby STEM scenario: ${hobbySTEM}
- Language: ${langLabel(safeLanguage)}
${notesRef}

Write a DETAILED explanation with these exact sections:

# What is ${topic.name}?
3-4 paragraphs. Start with: a ${stemSubject} professional working in ${safeHobby} hitting a real problem that ${topic.name} solves. Build up from zero — assume they know nothing. End the section with a clear one-sentence definition.

# How Does It Work?
Minimum 5 steps. Each step: explain in plain language, then show a 3-5 line Python code example with output. Use variable names from ${safeHobby} + ${stemSubject} world. Base all code on the reference examples above.

# Common Mistakes Students Make
For EVERY mistake in the reference notes:
- ❌ Wrong code (label clearly)
- ✅ Correct code (label clearly)
- One sentence: why the wrong version fails in ${stemSubject} context

# Real World STEM Examples Using ${safeHobby}
3 complete runnable examples. Each MUST:
1. Frame a real ${stemSubject} problem in ${safeHobby} setting (${hobbySTEM})
2. Show complete Python code with inline comments
3. Show exact output
4. Explain the ${stemSubject} insight the code reveals

# Quick Summary
- List 6-8 key takeaways as bullet points
- Each bullet: one clear sentence
- End with one motivating line

RULES:
- Minimum 800 words total
- Use proper markdown: ## for sections, \`\`\`python for code blocks
- ${langInstruction(safeLanguage)}
- Be thorough. This student needs complete understanding, not a summary.
- Return ONLY the explanation. No preamble.`

    const theory = await groqCall(groqTheory, [{ role: 'user', content: prompt }], 4000)

    // Cache the detailed theory
    await Topic.findOneAndUpdate(
      { topicId },
      {
        [`cachedDetailedTheory.${safeLanguage}`]: theory,
        'cachedDetailedTheory.generatedAt': new Date(),
      }
    )

    res.status(200).json({ theory, cached: false })

  } catch (err) {
    console.error('Detailed Theory Error:', err)
    const safeLanguage = normalizeLanguage(req.query?.language)
    res.status(200).json({
      theory: fallbackTheory(req.params.topicId, safeLanguage),
      cached: false,
      fallback: true,
    })
  }
})

// POST /api/topics/clear-theory-cache — dev utility: clear cached theory to regenerate with notes
router.post('/clear-theory-cache', protect, async (req, res) => {
  try {
    await Topic.updateMany({}, { $unset: { cachedTheory: '', cachedDetailedTheory: '' } })
    res.json({ message: 'Theory cache cleared. Theories will regenerate with reference notes.' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear cache' })
  }
})

module.exports = router
