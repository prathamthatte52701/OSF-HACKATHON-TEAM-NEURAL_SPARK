import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import ThemeToggle from '../components/shared/ThemeToggle'
import AuthRobot from '../components/shared/AuthRobot'
import { validateSignup, getPasswordStrength } from '../utils/validators'

const getAuthErrorMessage = (err) => {
  if (err.response?.data?.message) return err.response.data.message
  if (err.code === 'ERR_NETWORK') return 'Cannot reach server. Make sure backend is running on port 5000.'
  return err.message || 'Signup failed. Please try again.'
}

export default function Signup() {
  const { colors } = useTheme()
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [form, setForm]               = useState({ name: '', email: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [showPass, setShowPass]       = useState(false)
  const [serverError, setServerError] = useState('')
  const [loading, setLoading]         = useState(false)
  const [successMsg, setSuccessMsg]   = useState('')

  const strength = getPasswordStrength(form.password)
  const strengthColors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981']

  const inputStyle = {
    width: '100%',
    padding: '12px 16px 12px 44px',
    background: colors.surface,
    color: colors.text,
    fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'Poppins, sans-serif',
  }

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (fieldErrors[field]) setFieldErrors(prev => ({ ...prev, [field]: '' }))
    setServerError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { errors } = validateSignup(form.name, form.email, form.password)
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return }

    setLoading(true)
    setServerError('')
    try {
      await signup(form.name, form.email, form.password)
      setSuccessMsg('Account created! Please login.')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setServerError(getAuthErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'Poppins, sans-serif' }}>
      <div style={{ position: 'fixed', top: 20, right: 20 }}><ThemeToggle /></div>

      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <AuthRobot alt="ZenithLearn signup robot" />
          <h1 style={{ color: colors.text, margin: 0, fontSize: 28, fontWeight: 700 }}>ZenithLearn</h1>
          <p style={{ color: colors.textMuted, margin: '8px 0 0', fontSize: 14 }}>Bilingual Code Learning Platform</p>
        </div>

        <div className="hud-border-default" style={{ background: colors.surface, padding: 32 }}>
          <h2 style={{ color: colors.text, margin: '0 0 24px', fontSize: 22, fontWeight: 600 }}>Create Account 🚀</h2>

          {successMsg && (
            <div style={{ background: '#052e16', border: '1px solid #10b981', color: '#10b981', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
              ✅ {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Name */}
            <div>
              <div style={{ position: 'relative' }}>
                <User size={18} color={colors.textMuted} style={{ position: 'absolute', left: 14, top: 14 }} />
                <input
                  className={fieldErrors.name ? 'hud-input hud-input-error' : 'hud-input'}
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange('name')}
                  style={inputStyle}
                />
              </div>
              {fieldErrors.name && <p style={{ color: colors.error, margin: '4px 0 0', fontSize: 12 }}>⚠️ {fieldErrors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color={colors.textMuted} style={{ position: 'absolute', left: 14, top: 14 }} />
                <input
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleChange('email')}
                  className={fieldErrors.email ? 'hud-input hud-input-error' : 'hud-input'}
                  style={inputStyle}
                />
              </div>
              {fieldErrors.email && <p style={{ color: colors.error, margin: '4px 0 0', fontSize: 12 }}>⚠️ {fieldErrors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color={colors.textMuted} style={{ position: 'absolute', left: 14, top: 14 }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Password (8+ chars, A-Z, a-z, 0-9, !@#)"
                  value={form.password}
                  onChange={handleChange('password')}
                  className={fieldErrors.password ? 'hud-input hud-input-error' : 'hud-input'}
                  style={{ ...inputStyle, paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 14, top: 14, background: 'none', border: 'none', cursor: 'pointer', color: colors.textMuted }}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {form.password && (
                <div style={{ marginTop: 6 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                    {[1,2,3,4,5].map(i => (
                      <div key={i} style={{
                        flex: 1, height: 4, borderRadius: 2,
                        background: i <= strength.score ? strengthColors[strength.score] : colors.border,
                        transition: 'background 0.3s',
                      }} />
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: strengthColors[strength.score] || colors.textMuted, margin: 0 }}>
                    {strength.label}
                  </p>
                </div>
              )}
              {fieldErrors.password && <p style={{ color: colors.error, margin: '4px 0 0', fontSize: 12 }}>⚠️ {fieldErrors.password}</p>}
            </div>

            {serverError && (
              <div className="hud-border-pink" style={{ background: `${colors.error}15`, padding: '10px 14px', color: colors.error, fontSize: 13 }}>
                ⚠️ {serverError}
              </div>
            )}

            <button type="submit" disabled={loading} className="hud-btn" style={{
              background: colors.accent,
              color: '#fff',
              padding: '13px', fontSize: 16, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, transition: 'all 0.2s',
              fontFamily: 'Poppins, sans-serif',
            }}>
              {loading ? 'Creating account...' : 'Get Started →'}
            </button>
          </form>

          <p style={{ color: colors.textMuted, textAlign: 'center', marginTop: 20, fontSize: 14 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: colors.accent, textDecoration: 'none', fontWeight: 600 }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
