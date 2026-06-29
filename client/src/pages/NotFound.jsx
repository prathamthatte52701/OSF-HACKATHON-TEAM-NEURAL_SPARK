import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

export default function NotFound() {
  const { colors } = useTheme()
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: colors.bg, fontFamily: 'Poppins, sans-serif',
      gap: 16, textAlign: 'center', padding: 24,
    }}>
      <img src="/logo.png" style={{ width: 80, height: 80, objectFit: 'contain' }} alt="ZenithLearn" />
      <h1 style={{ fontSize: 48, fontWeight: 700, color: colors.accent, margin: 0 }}>404</h1>
      <p style={{ fontSize: 18, color: colors.text, margin: 0 }}>Yeh page nahi mila bhai</p>
      <p style={{ fontSize: 14, color: colors.textMuted, margin: 0 }}>This page doesn't exist</p>
      <button
        onClick={() => navigate('/home')}
        style={{
          marginTop: 16, padding: '12px 32px', borderRadius: 12,
          background: colors.accent, color: '#fff', border: 'none',
          fontFamily: 'Poppins, sans-serif', fontSize: 16, fontWeight: 600, cursor: 'pointer',
        }}
      >
        Go Home
      </button>
    </div>
  )
}
