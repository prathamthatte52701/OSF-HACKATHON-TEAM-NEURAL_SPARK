import { useTheme } from '../../context/ThemeContext';

export default function LoadingSpinner({ size = 40, text = 'Loading...' }) {
  const { colors } = useTheme();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 40 }}>
      <div style={{
        width: size,
        height: size,
        border: `3px solid ${colors.border}`,
        borderTop: `3px solid ${colors.accent}`,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <span style={{ color: colors.textMuted, fontSize: 14 }}>{text}</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
