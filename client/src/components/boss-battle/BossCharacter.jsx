import { motion, AnimatePresence } from 'framer-motion'
import { getBossConfig } from '../../utils/bossConfig'

export default function BossCharacter({ phase, bossName, topicId = 'variables' }) {
  const config = getBossConfig(topicId)
  const { primaryColor, secondaryColor, glowColor } = config

  // Phase-aware ring config
  const rings = [
    { size: 580, duration: 12, dir: 360,  border: `2px solid ${primaryColor}25`,  top: `2px solid ${primaryColor}80` },
    { size: 480, duration: 18, dir: -360, border: `1px solid ${primaryColor}18`,  top: `1px solid ${glowColor}` },
    { size: 380, duration: 8,  dir: 360,  border: `1px dashed ${primaryColor}15`, top: `1px dashed ${primaryColor}60` },
  ]

  // Idle float — more alive in phase3
  const idleY     = phase === 'phase3' ? [-20, 20, -20] : [-12, 12, -12]
  const idleDur   = phase === 'phase3' ? 2 : 4
  const idleScale = phase === 'phase3' ? [1.04, 1.1, 1.04] : [1, 1.025, 1]

  const glowFrames =
    phase === 'phase3'
      ? [
          `drop-shadow(0 0 40px ${primaryColor}cc) hue-rotate(0deg)`,
          `drop-shadow(0 0 70px ${secondaryColor}ff) hue-rotate(60deg)`,
          `drop-shadow(0 0 40px ${primaryColor}cc) hue-rotate(0deg)`,
        ]
      : phase === 'phase2'
      ? [
          `drop-shadow(0 0 30px ${primaryColor}aa)`,
          `drop-shadow(0 0 55px ${primaryColor}dd)`,
          `drop-shadow(0 0 30px ${primaryColor}aa)`,
        ]
      : [
          `drop-shadow(0 0 18px ${primaryColor}60)`,
          `drop-shadow(0 0 36px ${primaryColor}99)`,
          `drop-shadow(0 0 18px ${primaryColor}60)`,
        ]

  const bossSize = phase === 'duel' ? 280 : 420

  // Orbit particles
  const orbits = [0, 60, 120, 180, 240, 300]

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      {/* Holographic rings — only during active battle */}
      {['phase1', 'phase2', 'phase3'].includes(phase) &&
        rings.map((ring, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: ring.size,
              height: ring.size,
              borderRadius: '50%',
              border: ring.border,
              borderTopColor: ring.top.split(' ').pop(),
              borderTopWidth: ring.top.split(' ')[0],
              borderTopStyle: ring.top.split(' ')[1],
            }}
            animate={{ rotate: ring.dir }}
            transition={{ duration: ring.duration, repeat: Infinity, ease: 'linear' }}
          />
        ))}

      {/* Orbiting particles — phase2/3 only */}
      {['phase2', 'phase3'].includes(phase) &&
        orbits.map((deg, i) => (
          <motion.div
            key={`orb-${i}`}
            style={{ position: 'absolute', width: 340, height: 340 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 5 + i * 0.4, repeat: Infinity, ease: 'linear', delay: i * 0.3 }}
          >
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                marginLeft: -4,
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: primaryColor,
                boxShadow: `0 0 10px ${primaryColor}`,
              }}
              animate={{ scale: [0.6, 1.4, 0.6], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.25 }}
            />
          </motion.div>
        ))}

      {/* Boss Image */}
      <AnimatePresence mode="wait">
        {phase !== 'victory' && phase !== 'defeat' && (
          <motion.div
            key="boss"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={
              phase === 'execution'
                ? {
                    scale: [1, 1.6, 0],
                    rotate: [0, 90, 720],
                    opacity: [1, 1, 0],
                    filter: [`drop-shadow(0 0 60px ${primaryColor})`, 'brightness(8) drop-shadow(0 0 120px #fff)', 'brightness(1)'],
                  }
                : phase === 'duel'
                ? {
                    scale: 0.75,
                    opacity: 0.55,
                    filter: `drop-shadow(0 0 12px rgba(16,185,129,0.5)) grayscale(80%)`,
                  }
                : {
                    y: idleY,
                    scale: idleScale,
                    filter: glowFrames,
                  }
            }
            exit={{ scale: 0, opacity: 0 }}
            transition={
              phase === 'execution'
                ? { duration: 3, ease: [0.36, 0, 0.66, -0.56] }
                : phase === 'duel'
                ? { duration: 1.8, ease: [0.25, 1, 0.5, 1] }
                : { duration: idleDur, repeat: Infinity, ease: 'easeInOut' }
            }
            style={{
              position: 'relative',
              width: bossSize,
              height: bossSize,
              maxWidth: '70vw',
              maxHeight: '50vh',
              borderRadius: '50%',
              overflow: 'hidden',
              background: '#000',
              boxShadow: `inset 0 0 60px rgba(0,0,0,0.9), 0 0 40px ${primaryColor}30`,
            }}
          >
            <img
              src="/boss-vs.jpeg"
              alt={bossName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: phase === 'phase3' ? 0.75 : 0.88,
                mixBlendMode: 'screen',
                filter: `hue-rotate(${
                  topicId === 'variables' ? '200deg'
                  : topicId === 'loops' ? '260deg'
                  : topicId === 'functions' ? '300deg'
                  : topicId === 'lists' ? '170deg'
                  : topicId === 'strings' ? '270deg'
                  : topicId === 'oop' ? '20deg'
                  : topicId === 'error-handling' ? '0deg'
                  : topicId === 'algorithms' ? '160deg'
                  : topicId === 'data-types' ? '30deg'
                  : '280deg'
                })`,
              }}
            />

            {/* Phase3 glitch overlay */}
            {phase === 'phase3' && (
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(45deg, ${primaryColor}30, ${secondaryColor}30)`,
                  mixBlendMode: 'color-burn',
                }}
                animate={{ x: [-3, 3, -2, 2, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.15, repeat: Infinity, repeatType: 'mirror' }}
              />
            )}

            {/* Inner glow ring at border */}
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              boxShadow: `inset 0 0 30px ${primaryColor}40`,
              pointerEvents: 'none',
            }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
