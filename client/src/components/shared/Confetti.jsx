import { useEffect, useState } from 'react';

const COLORS = ['#6C63FF', '#00D68F', '#FFB800', '#FF4444', '#FF6B6B', '#4ECDC4'];

export default function Confetti({ active, onDone }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!active) return;
    const p = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.5,
      size: 6 + Math.random() * 8
    }));
    setParticles(p);
    const t = setTimeout(() => { setParticles([]); onDone && onDone(); }, 3000);
    return () => clearTimeout(t);
  }, [active]);

  if (!particles.length) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`,
          top: -20,
          width: p.size,
          height: p.size,
          background: p.color,
          borderRadius: Math.random() > 0.5 ? '50%' : 2,
          animation: `fall 2.5s ${p.delay}s ease-in forwards`
        }} />
      ))}
      <style>{`
        @keyframes fall {
          to { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
