import { useState, useEffect } from 'react'
import { Trophy } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import Navbar from '../components/shared/Navbar'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import { HOBBIES } from '../utils/constants'

const TABS     = ['All Time', 'Weekly', 'Daily', 'AI Challenge']
const ENDPOINTS = ['alltime', 'weekly', 'daily', 'aichallenge']
const medals   = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
  const { colors } = useTheme()
  const { user }   = useAuth()
  const [tab, setTab]   = useState(0)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const getEmoji = (hobby) => HOBBIES.find(h => h.id === hobby)?.emoji || '👤'
  const isHindi  = user?.language === 'hindi'

  useEffect(() => {
    setLoading(true)
    api.get(`/leaderboard/${ENDPOINTS[tab]}`)
      .then(res => setData(res.data?.leaderboard || []))
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }, [tab])

  return (
    <div style={{ background: colors.bg, minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 16px' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Trophy size={26} color="#fbbf24" />
          <h1 style={{ color: colors.text, margin: 0, fontSize: 22, fontWeight: 700 }}>
            {isHindi ? 'Leaderboard' : 'Leaderboard'}
          </h1>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', background: colors.surface,
          border: `1px solid ${colors.border}`, borderRadius: 12, padding: 4, marginBottom: 24,
        }}>
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} style={{
              flex: 1, padding: '9px 4px', border: 'none', borderRadius: 9,
              background: tab === i ? colors.accent : 'transparent',
              color: tab === i ? '#fff' : colors.textMuted,
              fontWeight: tab === i ? 700 : 400, fontSize: 12,
              cursor: 'pointer', transition: 'all 0.15s',
              fontFamily: 'Poppins, sans-serif',
            }}>
              {t}
            </button>
          ))}
        </div>

        {loading ? <LoadingSpinner text="Loading..." /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.map((entry, i) => {
              const isMe = entry._id === (user?._id || user?.id)
              return (
                <div key={entry._id || i} style={{
                  background: isMe ? `${colors.accent}15` : colors.surface,
                  border: `2px solid ${isMe ? colors.accent : colors.border}`,
                  borderRadius: 12, padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <span style={{ width: 32, textAlign: 'center', fontSize: i < 3 ? 22 : 14, fontWeight: 700, color: i >= 3 ? colors.textMuted : undefined }}>
                    {i < 3 ? medals[i] : `#${i + 1}`}
                  </span>
                  <span style={{ fontSize: 20 }}>{getEmoji(entry.hobby)}</span>
                  <span style={{ color: colors.text, fontWeight: isMe ? 700 : 500, flex: 1, fontSize: 14 }}>
                    {entry.name}
                    {isMe && <span style={{ color: colors.accent, fontSize: 11, marginLeft: 6 }}>({isHindi ? 'Aap' : 'You'})</span>}
                  </span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#fbbf24', fontWeight: 700, fontSize: 15 }}>
                      ⭐ {tab === 0 ? (entry.totalPoints || 0)
                          : tab === 1 ? (entry.weeklyPoints || 0)
                          : tab === 2 ? (entry.dailyPoints || 0)
                          : (entry.aiChallengePoints || 0)}
                    </div>
                    {entry.streak > 0 && (
                      <div style={{ color: colors.textMuted, fontSize: 11 }}>🔥 {entry.streak}</div>
                    )}
                  </div>
                </div>
              )
            })}
            {data.length === 0 && (
              <p style={{ color: colors.textMuted, textAlign: 'center', padding: '48px 0', fontSize: 15 }}>
                {isHindi ? 'Pehle leaderboard pe aao! 🚀' : 'Be the first on the leaderboard! 🚀'}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
