const Groq = require('groq-sdk')

// STRICT: Each key has ONE job. Never swap.
;['GROQ_KEY_1', 'GROQ_KEY_2', 'GROQ_KEY_3', 'GROQ_KEY_4'].forEach(key => {
  if (!process.env[key]) console.error(`${key} is missing. Related AI calls will use fallbacks.`)
})

const groqTheory    = new Groq({ apiKey: process.env.GROQ_KEY_1 }) // Theory only
const groqQuestion  = new Groq({ apiKey: process.env.GROQ_KEY_2 }) // Questions only
const groqAnswer    = new Groq({ apiKey: process.env.GROQ_KEY_3 }) // Wrong summary + IDE check only
const groqChallenge = new Groq({ apiKey: process.env.GROQ_KEY_4 }) // AI Challenge only

const groqCall = async (client, messages, maxTokens = 512) => {
  try {
    const response = await client.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    })
    const content = response.choices?.[0]?.message?.content?.trim()
    if (!content) throw new Error('GROQ_FAILED')
    return content
  } catch (err) {
    console.error('Groq API Error:', err.message)
    throw new Error('GROQ_FAILED')
  }
}

module.exports = { groqTheory, groqQuestion, groqAnswer, groqChallenge, groqCall }
