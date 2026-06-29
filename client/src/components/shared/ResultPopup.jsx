import { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function ResultPopup({ visible, correct, onHide }) {
  const { colors } = useTheme();
  const [phase, setPhase] = useState('hidden');

  useEffect(() => {
    if (!visible) return;
    setPhase('entering');
    const toVisible = setTimeout(() => setPhase('visible'), 50);
    const toLeave   = setTimeout(() => setPhase('leaving'), 2000);
    const toHide    = setTimeout(() => { setPhase('hidden'); onHide && onHide(); }, 2350);
    return () => { clearTimeout(toVisible); clearTimeout(toLeave); clearTimeout(toHide); };
  }, [visible]); // eslint-disable-line

  if (phase === 'hidden') return null;

  const isEntering = phase === 'entering';
  const isLeaving  = phase === 'leaving';
  const opacity    = (isEntering || isLeaving) ? 0 : 1;
  const scale      = isEntering ? 0.85 : isLeaving ? 0.9 : 1;

  return (
    <>
      <style>{`
        @keyframes rp-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes rp-pulse-ring {
          0%   { transform: scale(0.85); opacity: 0.7; }
          100% { transform: scale(1.25); opacity: 0; }
        }
      `}</style>

      <div style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px',
        opacity, transition: 'opacity 0.3s ease', pointerEvents: 'none',
      }}>
        <div style={{
          width: '100%', maxWidth: 460,
          background: colors.surface,
          border: `2px solid ${correct ? 'var(--pixel-green)' : 'var(--pixel-pink)'}`,
          borderRadius: 4,
          boxShadow: correct ? colors.glowGreen : colors.glowPink,
          padding: '36px 32px 32px', textAlign: 'center',
          transform: `scale(${scale})`,
          transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: correct
              ? 'linear-gradient(90deg, #43F26C, #B46CFF)'
              : 'linear-gradient(90deg, #FF5FA8, #FF5FA8)',
            borderRadius: '4px 4px 0 0',
          }} />

          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
            <div style={{
              position: 'absolute', inset: '-12px', borderRadius: '50%',
              background: correct
                ? 'radial-gradient(circle, rgba(0,214,143,0.25) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(255,68,68,0.2) 0%, transparent 70%)',
              animation: 'rp-pulse-ring 1.4s ease-out infinite',
            }} />
            <img
              src={correct ? '/robot-happy.png' : '/robot-sad.png'}
              alt={correct ? 'Happy Robot' : 'Sad Robot'}
              style={{
                height: 100, width: 'auto', objectFit: 'contain', display: 'block',
                position: 'relative',
                animation: 'rp-float 2.5s ease-in-out infinite',
                filter: correct
                  ? 'drop-shadow(0 4px 18px rgba(0,214,143,0.4))'
                  : 'drop-shadow(0 4px 18px rgba(255,68,68,0.35))',
              }}
            />
          </div>

          <div style={{
            fontSize: 22, fontWeight: 800,
            color: correct ? '#00D68F' : '#FF4444',
            marginBottom: 8, letterSpacing: '-0.3px',
            fontFamily: 'Poppins, Inter, sans-serif',
          }}>
            {correct ? '✅ Correct!' : '❌ Incorrect'}
          </div>

          <p style={{ fontSize: 14, color: colors.textMuted, margin: 0, lineHeight: 1.6, fontFamily: 'Inter, sans-serif' }}>
            {correct ? 'Great job! Keep it up.' : "Don't worry, try again."}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 20 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%',
                background: correct ? '#00D68F' : '#FF4444',
                opacity: 0.3 + i * 0.25,
              }} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
