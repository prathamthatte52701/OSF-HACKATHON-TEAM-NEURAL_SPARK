import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import Navbar from '../components/shared/Navbar'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import ProfileAvatarSection from '../components/profile/ProfileAvatarSection'
import AvatarModal from '../components/profile/AvatarModal'
import UserAvatar from '../components/shared/UserAvatar'
import { LogOut, Edit2, Share2, Camera } from 'lucide-react'
import { HOBBIES, BADGES, TOPICS } from '../utils/constants'
import { setStoredLanguage, LANGUAGES, normalizeLanguage } from '../utils/i18n'
import { getAvatarStorageKey } from '../utils/avatarAssets'

export default function Profile() {
  const { colors } = useTheme()
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()

  const [progress,  setProgress]   = useState([])
  const [weakSpots, setWeakSpots]  = useState([])
  const [loading,   setLoading]    = useState(true)
  const [editing,         setEditing]         = useState(false)
  const [editHobby,       setEditHobby]       = useState(user?.hobby || '')
  const [editLanguage,    setEditLanguage]     = useState(user?.language || 'english')
  const [avatarModalOpen, setAvatarModalOpen] = useState(false)
  const [profileAvatar, setProfileAvatar] = useState(user?.avatar || null)

  const isHindi = user?.language === 'hindi'

  useEffect(() => {
    if (!user) return
    const savedAvatar = localStorage.getItem(getAvatarStorageKey(user))
    setProfileAvatar(user.avatar || savedAvatar || null)
  }, [user?._id, user?.id, user?.email, user?.avatar])

  useEffect(() => {
    if (!user) return
    const uid = user._id || user.id
    Promise.all([
      api.get(`/progress/${uid}`),
      api.get(`/progress/${uid}/weak-spots`).catch(() => ({ data: [] })),
    ]).then(([prog, weak]) => {
      setProgress(prog.data || [])
      setWeakSpots(weak.data?.weakSpots || weak.data || [])
    }).catch(console.error).finally(() => setLoading(false))
  }, [user?._id])

  const handleSaveEdit = async () => {
    try {
      await api.put('/profile/update', { hobby: editHobby, language: editLanguage })
      updateUser({ hobby: editHobby, language: editLanguage })
      if (editLanguage !== user?.language) {
        setStoredLanguage(editLanguage) // syncs localStorage and fires language-change event
      }
      setEditing(false)
    } catch {}
  }

  const handleSaveAvatar = async (newAvatarSrc) => {
    const storageKey = getAvatarStorageKey(user)
    if (newAvatarSrc) localStorage.setItem(storageKey, newAvatarSrc)
    else localStorage.removeItem(storageKey)
    setProfileAvatar(newAvatarSrc || null)
    updateUser({ avatar: newAvatarSrc || null })

    try {
      await api.put('/profile/update', { avatar: newAvatarSrc })
    } catch {}
  }

  const earnedBadges = user?.isDeveloper ? BADGES.map(b => b.id) : (user?.badges || [])
  const completed    = progress.filter(p => p.topicCompleted).length
  const aiDone       = progress.filter(p => p.aiChallengeScore > 0).length
  const hobbyEmoji   = HOBBIES.find(h => h.id === user?.hobby)?.emoji || '👤'
  const hobbyLabel   = HOBBIES.find(h => h.id === user?.hobby)?.[isHindi ? 'labelHindi' : 'label'] || user?.hobby

  if (!user) return null

  return (
    <div style={{ background: colors.bg, minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>
      <Navbar />
      {avatarModalOpen && (
        <AvatarModal
          currentAvatar={profileAvatar}
          onClose={() => setAvatarModalOpen(false)}
          onSave={handleSaveAvatar}
        />
      )}
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 16px' }}>

        {/* Header Card */}
        <div className="hud-border-default" style={{ background: colors.surface, padding: 24, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div
              onClick={() => setAvatarModalOpen(true)}
              style={{ position: 'relative', cursor: 'pointer', flexShrink: 0 }}
              title="Change avatar"
            >
              <UserAvatar avatar={profileAvatar} size={72} />
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                background: 'rgba(0,0,0,0.45)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: 0, transition: 'opacity 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0'}
              >
                <Camera size={22} color="#fff" />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ color: colors.text, margin: 0, fontSize: 20, fontWeight: 700 }}>{user.name}</h2>
              <p style={{ color: colors.textMuted, margin: '3px 0 0', fontSize: 13 }}>
                {hobbyLabel} • {LANGUAGES[normalizeLanguage(user?.language)]?.nativeLabel || 'English'}
                {user.streakFreeze && <span style={{ marginLeft: 8, color: '#a78bfa' }}>🧊 Freeze active</span>}
              </p>
              <p style={{ color: colors.textMuted, margin: '2px 0 0', fontSize: 11 }}>
                Longest streak: 🔥 {user.longestStreak || user.streak || 0} days
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setEditing(!editing)} style={{
                background: 'none', border: `1px solid ${colors.border}`,
                borderRadius: 8, padding: 7, cursor: 'pointer', color: colors.textMuted,
              }}>
                <Edit2 size={15} />
              </button>
              <button onClick={() => { logout(); navigate('/login') }} style={{
                background: 'none', border: '1px solid #ef444440',
                borderRadius: 8, padding: 7, cursor: 'pointer', color: '#ef4444',
              }}>
                <LogOut size={15} />
              </button>
            </div>
          </div>

          {editing && (
            <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: 16, marginTop: 4 }}>
              <p style={{ color: colors.text, fontSize: 13, marginBottom: 10, fontWeight: 600 }}>
                {isHindi ? 'Hobby Change Karo:' : 'Change Hobby:'}
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                {HOBBIES.map(h => (
                  <button key={h.id} onClick={() => setEditHobby(h.id)} style={{
                    background: editHobby === h.id ? colors.accent : colors.surface,
                    border: `1px solid ${editHobby === h.id ? colors.accent : colors.border}`,
                    borderRadius: 8, padding: '6px 12px', cursor: 'pointer',
                    color: editHobby === h.id ? '#fff' : colors.text,
                    fontSize: 13, fontFamily: 'Poppins, sans-serif',
                  }}>
                    {h.emoji} {isHindi ? h.labelHindi : h.label}
                  </button>
                ))}
              </div>
              <p style={{ color: colors.text, fontSize: 13, marginBottom: 10, fontWeight: 600 }}>
                Change Language:
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                {Object.values(LANGUAGES).map(lang => (
                  <button key={lang.id} onClick={() => setEditLanguage(lang.id)} style={{
                    background: editLanguage === lang.id ? colors.accent : colors.surface,
                    border: `1px solid ${editLanguage === lang.id ? colors.accent : colors.border}`,
                    borderRadius: 8, padding: '6px 12px', cursor: 'pointer',
                    color: editLanguage === lang.id ? '#fff' : colors.text,
                    fontSize: 13, fontFamily: 'inherit',
                  }}>
                    {lang.nativeLabel}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleSaveEdit} style={{
                  background: colors.accent, color: '#fff', border: 'none',
                  borderRadius: 8, padding: '8px 20px', cursor: 'pointer', fontWeight: 600,
                  fontFamily: 'Poppins, sans-serif',
                }}>
                  {isHindi ? 'Save Karo' : 'Save'}
                </button>
                <button onClick={() => setEditing(false)} style={{
                  background: 'none', border: `1px solid ${colors.border}`,
                  borderRadius: 8, padding: '8px 16px', cursor: 'pointer',
                  color: colors.textMuted, fontFamily: 'Poppins, sans-serif',
                }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <ProfileAvatarSection
          user={user}
          isHindi={isHindi}
          currentAvatar={profileAvatar}
          onAvatarChange={handleSaveAvatar}
        />

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: isHindi ? 'Total Points' : 'Total Points',      value: user.totalPoints || 0,         icon: '⭐', color: '#fbbf24' },
            { label: isHindi ? 'Streak'       : 'Current Streak',    value: `${user.streak || 0} days`,    icon: '🔥', color: '#ef4444' },
            { label: isHindi ? 'Topics Done'  : 'Topics Completed',  value: `${completed}/10`,             icon: '✅', color: '#10B981' },
            { label: isHindi ? 'AI Challenges': 'AI Challenges',     value: aiDone,                        icon: '🧠', color: colors.accent },
          ].map(s => (
            <div key={s.label} style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ color: s.color, fontWeight: 700, fontSize: 22 }}>{s.value}</div>
              <div style={{ color: colors.textMuted, fontSize: 12 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Weak Spots */}
        {weakSpots.length > 0 && (
          <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 20, marginBottom: 20 }}>
            <h3 style={{ color: colors.text, margin: '0 0 14px', fontSize: 16, fontWeight: 700 }}>
              🎯 {isHindi ? 'Weak Spots' : 'Weak Spots'}
            </h3>
            {weakSpots.slice(0, 3).map(w => {
              const topic = TOPICS.find(t => t.id === w._id) || { name: w._id }
              return (
                <div key={w._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div>
                    <span style={{ color: colors.text, fontSize: 14, fontWeight: 600 }}>
                      {isHindi ? topic.nameHindi || topic.name : topic.name}
                    </span>
                    <span style={{ color: '#ef4444', fontSize: 12, marginLeft: 8 }}>
                      {w.count} {isHindi ? 'galat jawab' : 'wrong answers'}
                    </span>
                  </div>
                  <button onClick={() => navigate(`/topic/${w._id}`)} style={{
                    background: '#ef4444', color: '#fff', border: 'none',
                    borderRadius: 8, padding: '6px 12px', cursor: 'pointer',
                    fontSize: 12, fontWeight: 600, fontFamily: 'Poppins, sans-serif',
                  }}>
                    Revise 📖
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Badges */}
        <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <h3 style={{ color: colors.text, margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>
            🏅 {isHindi ? 'Badges' : 'Badges'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {BADGES.map(badge => {
              const earned = earnedBadges.includes(badge.id)
              return (
                <div key={badge.id} style={{
                  background: earned ? `${colors.accent}15` : colors.bg,
                  border: `1px solid ${earned ? colors.accent : colors.border}`,
                  borderRadius: 10, padding: 12, textAlign: 'center',
                  opacity: earned ? 1 : 0.4,
                }}>
                  <div style={{ fontSize: 26, marginBottom: 6 }}>{badge.emoji}</div>
                  <div style={{ color: earned ? colors.text : colors.textMuted, fontSize: 10, fontWeight: 600, lineHeight: 1.3 }}>
                    {isHindi ? badge.nameHindi : badge.name}
                  </div>
                  {earned && <div style={{ color: '#10B981', fontSize: 9, marginTop: 4 }}>✅ Earned</div>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Share */}
        <button
          onClick={() => {
            const msg = `🚀 ZenithLearn par ${completed} topics complete kiye! ⭐ ${user.totalPoints || 0} points earn kiye. 🔥 ${user.streak || 0} day streak! Join me: zenithlearn.app`
            window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
          }}
          style={{
            width: '100%', background: '#25D366', color: '#fff', border: 'none',
            borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          <Share2 size={18} /> {isHindi ? 'WhatsApp pe Share Karo' : 'Share on WhatsApp'}
        </button>
      </div>
    </div>
  )
}
