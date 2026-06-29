import { Brain, Lock, Swords, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { TOPICS } from '../../utils/constants'

const getProgressAccuracy = (topicProgress) => {
  let attempted = 0
  let correct = 0
  const levels = topicProgress?.levels || {}
  for (let level = 1; level <= 5; level += 1) {
    const data = levels[String(level)] || {}
    attempted += data.questionsAttempted || 0
    correct += data.correctAnswers || 0
  }
  return attempted > 0 ? correct / attempted : 0
}

export default function ChallengeAccessCards({ progress = [], language = 'english' }) {
  const { colors } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  const safeProgress = Array.isArray(progress) ? progress : []
  const isHindi = language === 'hindi'
  const isDeveloper = Boolean(user?.isDeveloper)
  const isGuest = Boolean(user?.isGuest)

  const completedProgress = safeProgress.find(p => p?.topicCompleted)
  const currentProgress = safeProgress.find(p => !p?.topicCompleted)
  const targetTopicId = completedProgress?.topicId || currentProgress?.topicId || 'variables'
  const targetTopic = TOPICS.find(t => t.id === targetTopicId) || TOPICS[0]
  const targetProgress = safeProgress.find(p => p?.topicId === targetTopicId)

  const aiUnlocked = isDeveloper || (!isGuest && (
    (user?.streak || 0) >= 7 ||
    Boolean(targetProgress?.aiChallengeUnlocked && targetProgress?.topicCompleted)
  ))
  const bossAccuracy = getProgressAccuracy(targetProgress)
  const bossUnlocked = isDeveloper || (!isGuest && Boolean(targetProgress?.topicCompleted && bossAccuracy >= 0.6))

  const cards = [
    {
      key: 'ai',
      icon: <Brain size={22} />,
      title: isHindi ? 'AI Challenge' : 'AI Challenge',
      subtitle: isHindi
        ? `${targetTopic?.nameHindi || targetTopicId} ke liye interview mode`
        : `Interview mode for ${targetTopic?.name || targetTopicId}`,
      lockedText: isGuest
        ? (isHindi ? 'Login required' : 'Login required')
        : (isHindi ? '7-day streak / topic complete' : '7-day streak or topic completion'),
      unlocked: aiUnlocked,
      route: `/challenge/${targetTopicId}`,
      accent: '#7C3AED',
      cta: isHindi ? 'Open' : 'Open',
    },
    {
      key: 'boss',
      icon: <Swords size={22} />,
      title: isHindi ? 'Boss Battle' : 'Boss Battle',
      subtitle: isHindi
        ? `${targetTopic?.nameHindi || targetTopicId} ka final game mode`
        : `Final game mode for ${targetTopic?.name || targetTopicId}`,
      lockedText: isGuest
        ? (isHindi ? 'Login required' : 'Login required')
        : (isHindi ? 'Topic complete + 60% accuracy' : 'Complete topic with 60% accuracy'),
      unlocked: bossUnlocked,
      route: `/boss-ai/${targetTopicId}`,
      accent: '#d946ef',
      cta: isHindi ? 'Fight' : 'Fight',
    },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
      {cards.map(card => (
        <button
          key={card.key}
          type="button"
          onClick={() => card.unlocked && navigate(card.route)}
          disabled={!card.unlocked}
          style={{
            border: `1px solid ${card.unlocked ? `${card.accent}66` : colors.border}`,
            borderRadius: 14,
            padding: 16,
            background: card.key === 'boss'
              ? `linear-gradient(135deg, ${card.accent}22, ${colors.surface})`
              : colors.surface,
            color: colors.text,
            cursor: card.unlocked ? 'pointer' : 'not-allowed',
            opacity: card.unlocked ? 1 : 0.68,
            textAlign: 'left',
            fontFamily: 'Poppins, sans-serif',
            boxShadow: card.unlocked ? `0 0 18px ${card.accent}24` : 'none',
            transition: 'transform 0.18s ease, box-shadow 0.18s ease',
          }}
          onMouseEnter={(e) => {
            if (card.unlocked) e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              display: 'grid',
              placeItems: 'center',
              color: '#fff',
              background: card.unlocked ? card.accent : colors.border,
            }}>
              {card.unlocked ? card.icon : <Lock size={20} />}
            </div>
            <span style={{
              color: card.unlocked ? card.accent : colors.textMuted,
              fontSize: 11,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}>
              {card.unlocked ? <><Zap size={13} /> {card.cta}</> : card.lockedText}
            </span>
          </div>
          <div style={{ color: colors.text, fontWeight: 800, fontSize: 16, marginBottom: 5 }}>{card.title}</div>
          <div style={{ color: colors.textMuted, fontSize: 12, lineHeight: 1.45 }}>{card.subtitle}</div>
        </button>
      ))}
    </div>
  )
}
