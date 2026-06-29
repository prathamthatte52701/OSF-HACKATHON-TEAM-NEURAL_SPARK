import { useNavigate } from 'react-router-dom'
import { Trophy } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { HOBBIES } from '../../utils/constants'

const medals = ['🥇', '🥈', '🥉']

export default function LeaderboardSneak({ leaders = [], language = 'english' }) {
  const { colors } = useTheme()
  const navigate = useNavigate()
  const isHindi = language === 'hindi'

  const getHobbyEmoji = (hobby) => HOBBIES.find(h => h.id === hobby)?.emoji || '👤'

  return (
    <div style={{
      background: colors.surface, border: `1px solid ${colors.border}`,
      borderRadius: 14, padding: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Trophy size={18} color="#fbbf24" />
          <span style={{ color: colors.text, fontWeight: 700, fontSize: 15 }}>
            {isHindi ? 'Top Players' : 'Top Players'}
          </span>
        </div>
        <button onClick={() => navigate('/leaderboard')} style={{
          background: 'none', border: `1px solid ${colors.border}`, borderRadius: 8,
          padding: '4px 10px', cursor: 'pointer', color: colors.accent, fontSize: 12,
          fontFamily: 'Poppins, sans-serif',
        }}>
          View All →
        </button>
      </div>

      {leaders.length === 0 ? (
        <p style={{ color: colors.textMuted, textAlign: 'center', fontSize: 13, padding: '8px 0' }}>
          {isHindi ? 'Pehle leaderboard pe aao!' : 'Be the first on the leaderboard!'}
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {leaders.map((leader, i) => (
            <div key={leader._id || i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: colors.bg, borderRadius: 10, padding: '10px 12px',
            }}>
              <span style={{ fontSize: 18, width: 24 }}>{medals[i]}</span>
              <span style={{ fontSize: 16 }}>{getHobbyEmoji(leader.hobby)}</span>
              <span style={{ color: colors.text, fontWeight: 600, flex: 1, fontSize: 14 }}>{leader.name}</span>
              <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: 14 }}>
                ⭐ {leader.totalPoints || 0}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
