import { useNavigate } from 'react-router-dom'
import { RotateCcw } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { TOPICS } from '../../utils/constants'

export default function RevisionCard({ topics = [], language = 'english' }) {
  const { colors } = useTheme()
  const navigate = useNavigate()

  if (!topics.length) return null

  const getTopicName = (topicId) => {
    const t = TOPICS.find(t => t.id === topicId)
    if (!t) return topicId
    return language === 'hindi' ? t.nameHindi : t.name
  }

  return (
    <div style={{
      background: '#fef3c720', border: '1px solid #fbbf2450',
      borderRadius: 14, padding: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <RotateCcw size={16} color="#fbbf24" />
        <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: 13 }}>
          {language === 'hindi' ? 'Revision Ka Time!' : 'Time to Revise!'}
        </span>
      </div>
      <p style={{ color: colors.textMuted, fontSize: 12, margin: '0 0 10px' }}>
        {language === 'hindi'
          ? `${topics.length} topic(s) 3 din se pending hain`
          : `${topics.length} topic${topics.length > 1 ? 's' : ''} need revision — 3+ days ago`}
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {topics.slice(0, 3).map(t => (
          <button key={t.topicId} onClick={() => navigate(`/topic/${t.topicId}`)} style={{
            background: '#fbbf24', color: '#000', border: 'none',
            borderRadius: 8, padding: '6px 12px', cursor: 'pointer',
            fontSize: 12, fontWeight: 600, fontFamily: 'Poppins, sans-serif',
          }}>
            📖 {getTopicName(t.topicId)}
          </button>
        ))}
      </div>
    </div>
  )
}
