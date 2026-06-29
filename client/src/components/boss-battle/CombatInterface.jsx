import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MCQQuestion from '../question/MCQQuestion'
import FillQuestion from '../question/FillQuestion'
import IDEQuestion from '../question/IDEQuestion'
import { getBossConfig } from '../../utils/bossConfig'

export default function CombatInterface({
  currentQuestion,
  index,
  total,
  onAnswer,
  isHindi,
  userLanguage,
  userHobby,
  topicId = 'variables',
  battleLog,
  lastDamage,
}) {
  const [answered,       setAnswered]       = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [feedbackType,   setFeedbackType]   = useState(null) // 'hit' | 'damage' | null

  const config = getBossConfig(topicId)
  const { primaryColor } = config

  const handleAnswer = (answer) => {
    if (answered) return
    setAnswered(true)
    setSelectedAnswer(answer)

    const expected =
      currentQuestion.type === 'CODE'
        ? (currentQuestion.expectedOutput || currentQuestion.correctAnswer || '')
        : (currentQuestion.correctAnswer || '')

    const isCorrect =
      String(answer).trim().toLowerCase() === String(expected).trim().toLowerCase()

    setFeedbackType(isCorrect ? 'hit' : 'damage')
    onAnswer(isCorrect)

    setTimeout(() => {
      setAnswered(false)
      setSelectedAnswer('')
      setFeedbackType(null)
    }, 1100)
  }

  if (!currentQuestion) return null

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '28px 5% 24px',
        background: 'linear-gradient(to top, rgba(4,6,16,0.97) 55%, rgba(4,6,16,0.7) 85%, transparent)',
        borderTop: `1px solid ${primaryColor}25`,
        zIndex: 30,
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 260px',
        gap: '28px',
      }}
    >
      {/* ── Question Panel ─────────────────────────────────── */}
      <div style={{ position: 'relative' }}>
        {/* Progress indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 10,
        }}>
          <span style={{
            color: primaryColor,
            fontWeight: 900,
            fontSize: 10,
            letterSpacing: 2.5,
            textTransform: 'uppercase',
          }}>
            Question {index + 1} / {total}
          </span>
          <div style={{ flex: 1, height: 2, background: 'rgba(255,255,255,0.07)', borderRadius: 1, overflow: 'hidden' }}>
            <motion.div
              style={{ height: '100%', background: primaryColor, borderRadius: 1 }}
              animate={{ width: `${((index + 1) / total) * 100}%` }}
              transition={{ type: 'spring', stiffness: 60 }}
            />
          </div>
          {/* Feedback flash label */}
          <AnimatePresence>
            {feedbackType === 'hit' && (
              <motion.span
                key="hit"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ color: '#34d399', fontWeight: 900, fontSize: 11, letterSpacing: 1 }}
              >
                HIT! ⚡
              </motion.span>
            )}
            {feedbackType === 'damage' && (
              <motion.span
                key="dmg"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ color: '#f87171', fontWeight: 900, fontSize: 11, letterSpacing: 1 }}
              >
                BREACH ✗
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Question text */}
        <AnimatePresence mode="wait">
          <motion.h2
            key={index}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ color: '#f1f5f9', fontSize: 18, margin: '0 0 16px', lineHeight: 1.5, fontWeight: 700 }}
          >
            {isHindi && currentQuestion.questionHindi
              ? currentQuestion.questionHindi
              : currentQuestion.question}
          </motion.h2>
        </AnimatePresence>

        {/* Code block */}
        {currentQuestion.code && (
          <pre style={{
            background: 'rgba(0,0,0,0.6)',
            border: `1px solid ${primaryColor}30`,
            color: '#34d399',
            padding: '14px 18px',
            borderRadius: 8,
            fontFamily: 'monospace',
            fontSize: 13,
            marginBottom: 16,
            overflowX: 'auto',
            lineHeight: 1.6,
          }}>
            {currentQuestion.code}
          </pre>
        )}

        {/* Answer component */}
        <div style={{ opacity: answered ? 0.6 : 1, transition: 'opacity 0.2s', pointerEvents: answered ? 'none' : 'auto' }}>
          {(currentQuestion.type === 'MCQ' || currentQuestion.type === 'OUTPUT') && (
            <MCQQuestion
              options={currentQuestion.options || []}
              correctAnswer={currentQuestion.correctAnswer}
              selectedAnswer={selectedAnswer}
              answered={answered}
              onAnswer={handleAnswer}
            />
          )}
          {currentQuestion.type === 'FILL' && (
            <FillQuestion
              question={currentQuestion.code || currentQuestion.question}
              correctAnswer={currentQuestion.correctAnswer}
              answered={answered}
              onAnswer={handleAnswer}
              language={userLanguage}
            />
          )}
          {currentQuestion.type === 'CODE' && (
            <IDEQuestion
              problem={currentQuestion.question}
              expectedOutput={currentQuestion.expectedOutput || currentQuestion.correctAnswer}
              answered={answered}
              onAnswer={handleAnswer}
              language={userLanguage}
              hobby={userHobby}
              topicId={topicId}
            />
          )}
        </div>
      </div>

      {/* ── Battle Log ──────────────────────────────────────── */}
      <div style={{
        background: 'rgba(0,0,0,0.5)',
        borderLeft: `1px solid ${primaryColor}30`,
        borderRadius: '0 0 0 8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 240,
        overflow: 'hidden',
      }}>
        <div style={{
          color: primaryColor,
          fontWeight: 900,
          fontSize: 10,
          letterSpacing: 2,
          marginBottom: 12,
          textTransform: 'uppercase',
        }}>
          System Log
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {battleLog.length === 0 && (
            <span style={{ color: '#334155', fontSize: 12, fontFamily: 'monospace' }}>Awaiting input...</span>
          )}
          <AnimatePresence>
            {battleLog.map((entry, i) => {
              const logEntry = typeof entry === 'string' ? { message: entry, type: 'info' } : entry
              return (
                <motion.div
                  key={logEntry.id || `${i}-${logEntry.message}`}
                  initial={{ x: 16, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 - i * 0.18 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    color:
                      logEntry.type === 'hit'    ? '#34d399'
                      : logEntry.type === 'damage' ? '#f87171'
                      : logEntry.type === 'system' ? primaryColor
                      : '#94a3b8',
                    fontSize: 11,
                    fontFamily: 'monospace',
                    lineHeight: 1.4,
                  }}
                >
                  {'> '}{logEntry.message || logEntry}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
