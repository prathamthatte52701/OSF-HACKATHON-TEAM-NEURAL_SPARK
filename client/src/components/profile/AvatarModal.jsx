import { useState } from 'react';
import { X, Check, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const AVATAR_LIST = [
  '/avatar-1.png',
  '/avatar-2.png',
  '/avatar-3.png',
  '/avatar-4.png',
  '/avatar-5.png',
  null,
];

export default function AvatarModal({ currentAvatar, onClose, onSave }) {
  const { colors } = useTheme();
  const [selected, setSelected] = useState(currentAvatar || null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(selected);
    setSaving(false);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 5000,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div style={{
        width: '100%', maxWidth: 420,
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: 16,
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        padding: 32,
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <h3 style={{ color: colors.text, margin: 0, fontSize: 18, fontWeight: 700 }}>Choose Your Avatar</h3>
          <p style={{ color: colors.textMuted, margin: '6px 0 0', fontSize: 13 }}>Select an avatar for your profile</p>
        </div>

        {/* Close button */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16,
          background: 'none', border: 'none', cursor: 'pointer', color: colors.textMuted, padding: 4,
        }}>
          <X size={20} />
        </button>

        {/* Avatar grid — 3 columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, margin: '24px 0' }}>
          {AVATAR_LIST.map((src, i) => {
            const isSelected = selected === src;
            return (
              <button
                key={i}
                onClick={() => setSelected(src)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: 4,
                  position: 'relative',
                }}
              >
                <div style={{
                  width: 80, height: 80,
                  borderRadius: '50%',
                  border: isSelected ? `3px solid ${colors.accent}` : `2px solid ${colors.border}`,
                  boxShadow: isSelected ? `0 0 0 3px ${colors.accent}40` : 'none',
                  overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: src ? 'transparent' : `${colors.accent}15`,
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}>
                  {src ? (
                    <img src={src} alt={`Avatar ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <User size={32} color={colors.accent} />
                  )}
                </div>
                {isSelected && (
                  <div style={{
                    position: 'absolute', bottom: 4, right: 4,
                    background: colors.accent,
                    borderRadius: '50%', width: 20, height: 20,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `2px solid ${colors.surface}`,
                  }}>
                    <Check size={10} color="#fff" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '11px 16px', fontSize: 14,
              color: colors.text, background: colors.bg,
              border: `1px solid ${colors.border}`,
              borderRadius: 10, cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif', fontWeight: 500,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              flex: 2, padding: '11px 16px', fontSize: 14, fontWeight: 700,
              background: colors.accent, color: '#fff',
              border: 'none', borderRadius: 10, cursor: saving ? 'wait' : 'pointer',
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            {saving ? 'Saving...' : 'Save Avatar'}
          </button>
        </div>
      </div>
    </div>
  );
}
