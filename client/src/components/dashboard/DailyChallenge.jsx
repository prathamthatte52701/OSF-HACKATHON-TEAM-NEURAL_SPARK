import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { getChallengeForTopic, getDailyChallengeSlotInfo } from '../../assets/challenges/dailyChallenges'
import {
  formatDailyChallengeTime,
  getLocalDailyChallengeSlots,
  isDailyChallengeSlotCompleted,
  mergeLocalDailyChallengeSlots,
} from '../../utils/dailyChallengeSlots'
import { getGuestProgress } from '../../utils/guestProgress'

export default function DailyChallenge({ language = 'english' }) {
  const { colors } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [topicId, setTopicId] = useState('variables')
  const [slotInfo, setSlotInfo] = useState(getDailyChallengeSlotInfo())
  const [challenge, setChallenge] = useState(getChallengeForTopic('variables', new Date()))
  const [completedSlots, setCompletedSlots] = useState([])
  const isHindi = language === 'hindi'
  const solved = !user?.isDeveloper && isDailyChallengeSlotCompleted(completedSlots, slotInfo)

  useEffect(() => {
    const uid = user?._id || user?.id
    if (!uid) {
      setTopicId('variables')
      return
    }

    if (user?.isGuest) {
      const current = (getGuestProgress() || []).find(p => !p.topicCompleted)
      setTopicId(current?.topicId || 'variables')
      return
    }

    api.get(`/progress/${uid}`)
      .then(res => {
        const current = (res.data || []).find(p => !p.topicCompleted)
        setTopicId(current?.topicId || 'variables')
      })
      .catch(() => setTopicId('variables'))
  }, [user?._id, user?.id, user?.isGuest])

  useEffect(() => {
    setChallenge(getChallengeForTopic(topicId, new Date()))
  }, [topicId, slotInfo.slotId])

  useEffect(() => {
    const refreshCompletedSlots = () => {
      const localSlots = getLocalDailyChallengeSlots(user, slotInfo.dateKey)
      setCompletedSlots(localSlots)

      if (!user || user?.isGuest || user?.isDeveloper) return

      api.get(`/challenge/daily-status?dateKey=${slotInfo.dateKey}`)
        .then(res => {
          setCompletedSlots(mergeLocalDailyChallengeSlots(user, slotInfo.dateKey, res.data?.completedSlots || []))
        })
        .catch(() => {})
    }

    refreshCompletedSlots()
    window.addEventListener('focus', refreshCompletedSlots)
    return () => window.removeEventListener('focus', refreshCompletedSlots)
  }, [user?._id, user?.id, user?.isGuest, user?.isDeveloper, slotInfo.dateKey])

  useEffect(() => {
    const onSolved = (event) => {
      const detail = event.detail || {}
      if (detail.dateKey !== slotInfo.dateKey || !detail.slotId) return
      setCompletedSlots(mergeLocalDailyChallengeSlots(user, slotInfo.dateKey, [detail.slotId]))
    }

    window.addEventListener('dailyChallengeSolved', onSolved)
    return () => window.removeEventListener('dailyChallengeSolved', onSolved)
  }, [user, slotInfo.dateKey])

  useEffect(() => {
    const timer = setInterval(() => setSlotInfo(getDailyChallengeSlotInfo()), 1000)
    return () => clearInterval(timer)
  }, [])

  const countdown = formatDailyChallengeTime(slotInfo.msUntilNextSlot)

  return (
    <div style={{
      background: `linear-gradient(135deg, #fbbf2420, ${colors.surface})`,
      border: `1px solid #fbbf2440`,
      borderRadius: 16, padding: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Zap size={18} color="#fbbf24" />
        <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>
          {isHindi ? 'दैनिक Challenge' : 'Daily Challenge'}
        </span>
        <span style={{
          background: '#fbbf24', color: '#000', padding: '2px 10px',
          borderRadius: 20, fontSize: 11, fontWeight: 700, marginLeft: 'auto',
        }}>
          +{challenge.bonusPoints} pts
        </span>
      </div>

      {solved ? (
        <div>
          <div style={{
            background: '#052e16', border: '1px solid #10b981',
            borderRadius: 10, padding: '14px 16px', marginBottom: 12,
          }}>
            <p style={{ color: '#10b981', fontWeight: 600, margin: 0, fontSize: 15 }}>
              ✅ {isHindi ? 'Is slot ka challenge solve ho gaya!' : 'This slot challenge is solved!'}
            </p>
          </div>
          <p style={{ color: colors.textMuted, fontSize: 13, margin: 0 }}>
            ⏱ {isHindi ? 'Agla challenge:' : 'Next challenge in:'}{' '}
            <span style={{ color: colors.text, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
              {countdown}
            </span>
          </p>
        </div>
      ) : (
        <div>
          <p style={{ color: colors.text, fontSize: 15, margin: '0 0 10px', lineHeight: 1.6, fontWeight: 500, overflowWrap: 'anywhere' }}>
            {isHindi && challenge.questionHindi ? challenge.questionHindi : challenge.question}
          </p>
          <p style={{ color: colors.textMuted, fontSize: 12, margin: '0 0 14px', overflowWrap: 'anywhere' }}>
            💡 {isHindi && challenge.hintHindi ? challenge.hintHindi : challenge.hint}
          </p>
          <div className="daily-challenge-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ color: colors.textMuted, fontSize: 12 }}>
              ⏱ {countdown}
            </span>
            <button
              onClick={() => navigate('/daily-challenge')}
              className="daily-challenge-button"
              style={{
                background: colors.accent, color: '#fff', border: 'none',
                borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'Poppins, sans-serif', whiteSpace: 'nowrap',
              }}
            >
              {isHindi ? 'Solve Karo ⚡' : 'Solve Now ⚡'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
