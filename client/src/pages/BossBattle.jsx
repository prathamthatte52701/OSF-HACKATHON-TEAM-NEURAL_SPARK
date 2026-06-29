import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Shield, Swords, Trophy, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/shared/Navbar'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { TOPICS } from '../utils/constants'
import { dailyChallenges } from '../assets/challenges/dailyChallenges'
import api from '../utils/api'
import Arena from '../components/boss-battle/Arena'
import BossCharacter from '../components/boss-battle/BossCharacter'
import BattleHUD from '../components/boss-battle/BattleHUD'
import CombatInterface from '../components/boss-battle/CombatInterface'
import CodingDuel from '../components/boss-battle/CodingDuel'
import { useBossBattle, BOSS_NAMES } from '../hooks/useBossBattle'
import { audio } from '../components/boss-battle/AudioEngine'
import { getBossConfig, getBossDialogue } from '../utils/bossConfig'

const MAX_QUESTIONS = 10

const getBossQuestions = (topicId) => {
  const pool    = dailyChallenges.filter(item => item.topicId === topicId)
  const safePool = pool.length ? pool : dailyChallenges.filter(item => item.topicId === 'variables')
  const nonCode = safePool.filter(item => item.type !== 'CODE')
  const code    = safePool.find(item => item.type === 'CODE')
  const questions = []
  while (questions.length < MAX_QUESTIONS - 1) questions.push(...nonCode)
  return [...questions.slice(0, MAX_QUESTIONS - 1), code || safePool[0]].filter(Boolean)
}

function getProgressAccuracy(topicProgress) {
  let attempted = 0, correct = 0
  const levels = topicProgress?.levels || {}
  for (let level = 1; level <= 5; level++) {
    const data = levels[String(level)] || {}
    attempted += data.questionsAttempted || 0
    correct   += data.correctAnswers || 0
  }
  return attempted > 0 ? correct / attempted : 0
}

// ─── Boss Dialogue Overlay ────────────────────────────────────────────────────
function BossDialogue({ text, color }) {
  return (
    <AnimatePresence>
      {text && (
        <motion.div
          key={text}
          initial={{ y: -20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -10, opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          style={{
            position: 'absolute',
            top: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 35,
            background: 'rgba(4,6,18,0.88)',
            border: `1px solid ${color}50`,
            borderRadius: 10,
            padding: '10px 20px',
            maxWidth: 440,
            width: 'max-content',
            textAlign: 'center',
            backdropFilter: 'blur(8px)',
            pointerEvents: 'none',
          }}
        >
          <span style={{
            color: color,
            fontSize: 13,
            fontStyle: 'italic',
            fontWeight: 600,
            letterSpacing: 0.3,
            lineHeight: 1.5,
          }}>
            {text}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Countdown Numbers ────────────────────────────────────────────────────────
function CountdownDisplay({ countdown, color }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={countdown}
        initial={{ scale: 2.5, opacity: 0, filter: `drop-shadow(0 0 0px ${color})` }}
        animate={{ scale: 1, opacity: 1, filter: `drop-shadow(0 0 60px ${color})` }}
        exit={{ scale: 0.4, opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontSize: 160,
          fontWeight: 900,
          color,
          lineHeight: 1,
        }}
      >
        {countdown}
      </motion.div>
    </AnimatePresence>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BossBattle() {
  const { topicId = 'variables' } = useParams()
  const { colors }  = useTheme()
  const { user }    = useAuth()
  const navigate    = useNavigate()

  const [accessChecked,    setAccessChecked]    = useState(false)
  const [accessDenied,     setAccessDenied]     = useState(false)
  const [requiredAccuracy, setRequiredAccuracy] = useState(0)
  const [countdown,        setCountdown]        = useState(3)

  const topic    = TOPICS.find(item => item.id === topicId) || TOPICS[0]
  const bossName = BOSS_NAMES[topicId] || 'Syntax Overlord'
  const config      = getBossConfig(topicId)
  const userLanguage = user?.language || 'english'
  const isHindi     = userLanguage === 'hindi'

  const questions = useMemo(() => getBossQuestions(topicId), [topicId])

  const battle = useBossBattle(questions.length, topicId, userLanguage)
  const {
    phase, bossHp, playerHp, combo, ultimateMeter,
    battleLog, currentQuestionIndex, shake, bossDialogue, lastDamage,
    correctCount, bestCombo, timeElapsed,
    startCountdown, startGame, submitAnswer, executeUltimate, reset,
  } = battle

  const currentQuestion = questions[currentQuestionIndex]
  const prevPhase = useRef(phase)

  // Access control
  useEffect(() => {
    const verify = async () => {
      if (!user) return
      if (user.isDeveloper) { setAccessChecked(true); return }
      if (user.isGuest)     { setAccessDenied(true); setAccessChecked(true); return }
      try {
        const uid = user._id || user.id
        const res = await api.get(`/progress/${uid}`)
        const topicProgress = (res.data || []).find(p => p.topicId === topicId)
        const acc = getProgressAccuracy(topicProgress)
        setRequiredAccuracy(acc)
        setAccessDenied(!(topicProgress?.topicCompleted && acc >= 0.6))
      } catch {
        setAccessDenied(true)
      } finally {
        setAccessChecked(true)
      }
    }
    verify()
  }, [topicId, user?._id, user?.id, user?.isDeveloper, user?.isGuest])

  // Countdown auto-advance
  useEffect(() => {
    if (phase !== 'countdown') return
    setCountdown(3)
    const t1 = setTimeout(() => setCountdown(2), 1000)
    const t2 = setTimeout(() => setCountdown(1), 2000)
    const t3 = setTimeout(() => startGame(), 3000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [phase])

  // Audio on phase change
  useEffect(() => {
    if (prevPhase.current === phase) return
    if (['phase2', 'phase3', 'duel'].includes(phase)) audio.playPhaseTransition()
    if (phase === 'victory') audio.playVictory()
    if (phase === 'defeat')  audio.playDefeat()
    prevPhase.current = phase
  }, [phase])

  const handleAnswer = (isCorrect) => {
    audio.init()
    if (isCorrect) audio.playHit()
    else           audio.playDamage()
    submitAnswer(isCorrect)
  }

  const handleUltimate = () => {
    audio.init()
    audio.playUltimate()
    executeUltimate()
  }

  if (!user) return null

  // ── Loading ───────────────────────────────────────────────────────────────
  if (!accessChecked) {
    return (
      <div style={{ background: '#060510', minHeight: '100vh', fontFamily: 'Poppins, sans-serif', color: '#fff' }}>
        <Navbar />
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '80px 16px', textAlign: 'center', color: config.primaryColor }}>
          Checking Boss Battle access...
        </div>
      </div>
    )
  }

  // ── Locked ────────────────────────────────────────────────────────────────
  if (accessDenied) {
    return (
      <div style={{ background: colors.bg, minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>
        <Navbar />
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '72px 16px', textAlign: 'center' }}>
          <Shield size={52} color={colors.textMuted} />
          <h1 style={{ color: colors.text, margin: '16px 0 8px', fontSize: 24 }}>Boss Battle Locked</h1>
          <p style={{ color: colors.textMuted, margin: '0 0 28px', lineHeight: 1.75 }}>
            {user.isGuest
              ? 'Create an account to unlock Boss Battles.'
              : `Complete ${topic.name} with at least 60% accuracy to enter this arena. Current: ${Math.round(requiredAccuracy * 100)}%.`}
          </p>
          <button
            onClick={() => navigate(user.isGuest ? '/home' : `/topic/${topicId}`)}
            style={{
              background: config.primaryColor, color: '#fff', border: 'none',
              borderRadius: 12, padding: '12px 28px', cursor: 'pointer',
              fontSize: 15, fontWeight: 700, fontFamily: 'Poppins, sans-serif',
            }}
          >
            {user.isGuest ? 'Back Home' : 'Back to Topic'}
          </button>
        </div>
      </div>
    )
  }

  // ── Intro ─────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div style={{ background: '#060510', minHeight: '100vh', fontFamily: 'Poppins, sans-serif', color: '#fff' }}>
        <Navbar />
        <div style={{ position: 'relative', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
          <Arena phase="intro" shake={false} topicId={topicId} />
          <div style={{
            position: 'relative', zIndex: 40,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', height: '100%', padding: '24px 5%', gap: 28,
          }}>
            {/* Back button */}
            <button
              onClick={() => navigate('/home')}
              style={{
                position: 'absolute', top: 16, left: 16,
                background: 'none', border: 'none',
                color: config.primaryColor, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 7,
                fontFamily: 'Poppins, sans-serif', fontSize: 13,
                opacity: 0.8,
              }}
            >
              <ArrowLeft size={15} /> {isHindi ? 'Home' : 'Back'}
            </button>

            <div style={{ textAlign: 'center', maxWidth: 560 }}>
              {/* Topic label */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                  display: 'inline-block',
                  background: `${config.primaryColor}20`,
                  border: `1px solid ${config.primaryColor}50`,
                  borderRadius: 20,
                  padding: '4px 16px',
                  fontSize: 11,
                  letterSpacing: 2.5,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: config.primaryColor,
                  marginBottom: 14,
                }}
              >
                {isHindi ? (topic?.nameHindi || topic?.name) : topic?.name} · Final Boss
              </motion.div>

              {/* Boss name */}
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: 1, scale: 1,
                  filter: [
                    `drop-shadow(0 0 20px ${config.primaryColor}80)`,
                    `drop-shadow(0 0 50px ${config.primaryColor}cc)`,
                    `drop-shadow(0 0 20px ${config.primaryColor}80)`,
                  ],
                }}
                transition={{ opacity: { delay: 0.2, duration: 0.5 }, filter: { duration: 3, repeat: Infinity } }}
                style={{ margin: '0 0 6px', fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 900, color: '#fff', lineHeight: 1.1 }}
              >
                {bossName}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                style={{ color: config.primaryColor, fontSize: 13, margin: '0 0 8px', fontStyle: 'italic', letterSpacing: 0.5 }}
              >
                {config.subtitle}
              </motion.p>

              {/* Intro dialogue */}
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                style={{ color: '#94a3b8', fontSize: 14, margin: '0 0 28px', lineHeight: 1.75, fontStyle: 'italic' }}
              >
                {getBossDialogue(topicId, userLanguage, 'intro')}
              </motion.p>

              {/* Abilities preview */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}
              >
                {config.abilities.map((ab, i) => (
                  <div
                    key={i}
                    style={{
                      background: `${config.primaryColor}15`,
                      border: `1px solid ${config.primaryColor}35`,
                      borderRadius: 20,
                      padding: '5px 14px',
                      fontSize: 11,
                      color: config.primaryColor,
                      fontWeight: 700,
                      letterSpacing: 0.5,
                    }}
                  >
                    <Zap size={10} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
                    {ab}
                  </div>
                ))}
              </motion.div>

              {/* Enter button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => { audio.init(); startCountdown() }}
                style={{
                  background: `linear-gradient(135deg, ${config.secondaryColor}, ${config.primaryColor})`,
                  color: '#fff', border: 'none', borderRadius: 14,
                  padding: '16px 40px', fontWeight: 900, cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif', fontSize: 17,
                  boxShadow: `0 12px 40px ${config.primaryColor}45`,
                  display: 'flex', alignItems: 'center', gap: 12, margin: '0 auto',
                }}
              >
                <Swords size={20} />
                {isHindi ? 'Arena Mein Daakhil Ho' : 'Enter the Arena'}
              </motion.button>
            </div>

            {/* Boss character preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
              style={{ position: 'relative' }}
            >
              <motion.div
                animate={{
                  boxShadow: [
                    `0 0 40px ${config.primaryColor}40`,
                    `0 0 80px ${config.primaryColor}70`,
                    `0 0 40px ${config.primaryColor}40`,
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: `2px solid ${config.primaryColor}50`,
                }}
              >
                <img
                  src="/boss-vs.jpeg"
                  alt={bossName}
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    mixBlendMode: 'screen',
                    filter: `hue-rotate(${
                      topicId === 'variables' ? '200deg'
                      : topicId === 'loops' ? '260deg'
                      : topicId === 'functions' ? '300deg'
                      : topicId === 'lists' ? '170deg'
                      : topicId === 'strings' ? '270deg'
                      : topicId === 'oop' ? '20deg'
                      : topicId === 'error-handling' ? '0deg'
                      : topicId === 'algorithms' ? '160deg'
                      : topicId === 'data-types' ? '30deg'
                      : '280deg'
                    })`,
                  }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  // ── Countdown ─────────────────────────────────────────────────────────────
  if (phase === 'countdown') {
    return (
      <div style={{ background: '#060510', minHeight: '100vh', fontFamily: 'Poppins, sans-serif', color: '#fff' }}>
        <Navbar />
        <div style={{ position: 'relative', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
          <Arena phase="intro" shake={false} topicId={topicId} />
          <div style={{
            position: 'relative', zIndex: 40,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16,
          }}>
            <div style={{ color: config.primaryColor, fontSize: 12, letterSpacing: 3, fontWeight: 800, textTransform: 'uppercase', marginBottom: 8 }}>
              Prepare yourself
            </div>
            <CountdownDisplay countdown={countdown} color={config.primaryColor} />
          </div>
        </div>
      </div>
    )
  }

  // ── Battle ────────────────────────────────────────────────────────────────
  const isBattleActive = ['phase1', 'phase2', 'phase3', 'duel', 'execution'].includes(phase)
  if (isBattleActive) {
    return (
      <div style={{ background: '#060510', minHeight: '100vh', fontFamily: 'Poppins, sans-serif', color: '#fff' }}>
        <Navbar />
        <div style={{ position: 'relative', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
          <Arena phase={phase} shake={shake} topicId={topicId} />
          <BossCharacter phase={phase} bossName={bossName} topicId={topicId} />
          <BattleHUD
            bossHp={bossHp}
            playerHp={playerHp}
            combo={combo}
            ultimateMeter={ultimateMeter}
            bossName={bossName}
            executeUltimate={handleUltimate}
            topicId={topicId}
            phase={phase}
          />
          <BossDialogue text={bossDialogue} color={config.primaryColor} />

          {!['duel', 'execution'].includes(phase) && (
            <CombatInterface
              key={currentQuestionIndex}
              currentQuestion={currentQuestion}
              index={currentQuestionIndex}
              total={questions.length}
              onAnswer={handleAnswer}
              isHindi={isHindi}
              userLanguage={user.language}
              userHobby={user.hobby}
              topicId={topicId}
              battleLog={battleLog}
              lastDamage={lastDamage}
            />
          )}
          {phase === 'duel' && (
            <CodingDuel topicId={topicId} onExecute={handleAnswer} />
          )}
        </div>
      </div>
    )
  }

  // ── End Screen ────────────────────────────────────────────────────────────
  const accuracy = Math.round((correctCount / Math.max(1, questions.length)) * 100)
  const isVictory = phase === 'victory'

  return (
    <div style={{ background: '#060510', minHeight: '100vh', fontFamily: 'Poppins, sans-serif', color: '#fff' }}>
      <Navbar />
      <div style={{ position: 'relative', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
        <Arena phase={phase} shake={false} topicId={topicId} />
        <div style={{
          position: 'relative', zIndex: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: '100%', padding: 24,
        }}>
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            style={{
              background: 'rgba(6,8,22,0.94)',
              border: `1px solid ${isVictory ? '#22c55e40' : '#ef444440'}`,
              borderRadius: 20,
              padding: '36px 32px',
              textAlign: 'center',
              maxWidth: 640,
              width: '100%',
              boxShadow: `0 0 60px ${isVictory ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'}`,
            }}
          >
            <Trophy size={52} color={isVictory ? '#fbbf24' : '#475569'} />
            <h1 style={{
              color: isVictory ? '#22c55e' : '#ef4444',
              margin: '14px 0 6px', fontSize: 34, fontWeight: 900,
            }}>
              {isVictory
                ? (isHindi ? 'Boss Defeated!' : 'Boss Defeated!')
                : (isHindi ? 'Haaro Mat!' : 'Battle Failed')}
            </h1>
            <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 24px', fontStyle: 'italic' }}>
              {getBossDialogue(topicId, userLanguage, isVictory ? 'victory' : 'defeat')}
            </p>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 10, margin: '0 0 28px',
            }}>
              {[
                ['Accuracy', `${accuracy}%`],
                ['Correct', correctCount],
                ['Best Combo', `×${bestCombo}`],
                ['Time', `${timeElapsed}s`],
              ].map(([label, value]) => (
                <div key={label} style={{
                  background: '#020617',
                  border: '1px solid rgba(148,163,184,0.12)',
                  borderRadius: 10,
                  padding: '12px 8px',
                }}>
                  <div style={{ fontWeight: 900, fontSize: 20, color: isVictory ? config.primaryColor : '#94a3b8' }}>
                    {value}
                  </div>
                  <div style={{ color: '#475569', fontSize: 11, marginTop: 3, letterSpacing: 0.5 }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={reset}
                style={{
                  background: `linear-gradient(135deg, ${config.secondaryColor}, ${config.primaryColor})`,
                  color: '#fff', border: 'none',
                  borderRadius: 12, padding: '13px 28px', cursor: 'pointer',
                  fontWeight: 900, fontFamily: 'Poppins, sans-serif', fontSize: 15,
                }}
              >
                {isHindi ? 'Phir Koshish Karo' : 'Try Again'}
              </motion.button>
              <button
                onClick={() => navigate('/home')}
                style={{
                  background: 'transparent',
                  color: '#94a3b8',
                  border: '1px solid rgba(148,163,184,0.25)',
                  borderRadius: 12, padding: '13px 28px', cursor: 'pointer',
                  fontWeight: 700, fontFamily: 'Poppins, sans-serif', fontSize: 15,
                }}
              >
                Home
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
