import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { PROFILE_AVATARS, getAvatarStorageKey } from '../../utils/avatarAssets'
import { useTheme } from '../../context/ThemeContext'

export default function ProfileAvatarSection({ user, isHindi, currentAvatar, onAvatarChange }) {
  const { colors } = useTheme()
  const storageKey = getAvatarStorageKey(user)
  const [selectedAvatar, setSelectedAvatar] = useState(() =>
    currentAvatar || localStorage.getItem(storageKey) || PROFILE_AVATARS[0].src
  )

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    setSelectedAvatar(currentAvatar || saved || PROFILE_AVATARS[0].src)
  }, [storageKey, currentAvatar])

  const selectAvatar = (src) => {
    localStorage.setItem(storageKey, src)
    setSelectedAvatar(src)
    onAvatarChange?.(src)
  }

  return (
    <div style={{
      background: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
    }}>
      <h3 style={{ color: colors.text, margin: '0 0 14px', fontSize: 16, fontWeight: 700 }}>
        {isHindi ? 'Avatar Chuno' : 'Choose Avatar'}
      </h3>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {PROFILE_AVATARS.map(avatar => {
          const active = selectedAvatar === avatar.src
          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => selectAvatar(avatar.src)}
              aria-label={avatar.label}
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                padding: 3,
                border: `2px solid ${active ? colors.accent : colors.border}`,
                background: active ? `${colors.accent}18` : colors.bg,
                cursor: 'pointer',
                position: 'relative',
                boxShadow: active ? `0 0 18px ${colors.accent}55` : 'none',
                transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              <img
                src={avatar.src}
                alt=""
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', display: 'block' }}
              />
              {active && (
                <span style={{
                  position: 'absolute',
                  right: -2,
                  bottom: -2,
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: colors.accent,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px solid ${colors.surface}`,
                }}>
                  <Check size={13} />
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
