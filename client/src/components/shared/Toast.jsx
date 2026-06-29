import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

let toastFn = null;
export const showToast = (message, type = 'success') => toastFn && toastFn(message, type);

export default function Toast() {
  const { colors } = useTheme();
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastFn = (message, type) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };
    return () => { toastFn = null; };
  }, []);

  const borderColor = (type) => ({
    success: 'var(--pixel-green)',
    error:   'var(--pixel-pink)',
    warning: 'var(--pixel-gold)',
  }[type] || 'var(--pixel-primary)');

  const glowColor = (type) => ({
    success: colors.glowGreen,
    error:   colors.glowPink,
    warning: colors.glowGold,
  }[type] || colors.glowPrimary);

  const bgColor = (type) => ({
    success: colors.success,
    error:   colors.error,
    warning: colors.warning,
  }[type] || colors.accent);

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: colors.surface,
          color: colors.text,
          padding: '12px 20px',
          border: `2px solid ${borderColor(t.type)}`,
          borderRadius: 4,
          boxShadow: glowColor(t.type),
          fontWeight: 600,
          fontSize: 14,
          animation: 'slideIn 0.3s ease',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{ width: 4, height: 24, background: bgColor(t.type), borderRadius: 2, flexShrink: 0 }} />
          {t.message}
        </div>
      ))}
      <style>{`@keyframes slideIn { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </div>
  );
}
