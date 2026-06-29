import { Shield, Skull, Zap, Target } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getBossConfig } from '../../utils/bossConfig'

function HPBar({ label, current, max, color, icon, align = 'left' }) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100))
  const isLow = pct < 25
  const isMid = pct < 50

  const barColor = isLow ? '#ef4444' : isMid ? '#f59e0b' : color

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 220, maxWidth: 300 }}>
      <div style={{
        display: 'flex',
        justifyContent: align === 'right' ? 'flex-end' : 'space-between',
        alignItems: 'center',
        gap: 8,
      }}>
        {align === 'left' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ color, display: 'flex' }}>{icon}</div>
            <span style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase' }}>
              {label}
            </span>
          </div>
        )}
        <span style={{ color: '#94a3b8', fontSize: 12, fontWeight: 700, fontFamily: 'monospace' }}>
          {current}<span style={{ color: '#475569' }}>/{max}</span>
        </span>
        {align === 'right' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase' }}>
              {label}
            </span>
            <div style={{ color, display: 'flex' }}>{icon}</div>
          </div>
        )}
      </div>
      <div style={{
        height: 8,
        background: 'rgba(0,0,0,0.5)',
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.06)',
        ...(align === 'right' ? { transform: 'scaleX(-1)' } : {}),
      }}>
        <motion.div
          style={{
            height: '100%',
            background: `linear-gradient(to right, ${barColor}aa, ${barColor})`,
            boxShadow: `0 0 8px ${barColor}80`,
            borderRadius: 4,
          }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 40, damping: 12 }}
        />
      </div>
    </div>
  )
}

function PhaseTag({ phase, color }) {
  const labels = { phase1: 'PHASE I', phase2: 'PHASE II', phase3: 'PHASE III', duel: 'FINAL DUEL', execution: 'EXECUTION' }
  const label = labels[phase] || ''
  if (!label) return null
  return (
    <motion.div
      key={phase}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{
        background: 'rgba(0,0,0,0.6)',
        border: `1px solid ${color}50`,
        borderRadius: 6,
        padding: '3px 12px',
        fontSize: 10,
        fontWeight: 900,
        letterSpacing: 2,
        color: color,
        textTransform: 'uppercase',
      }}
    >
      {label}
    </motion.div>
  )
}

export default function BattleHUD({
  bossHp, playerHp, combo, ultimateMeter,
  bossName, executeUltimate, topicId = 'variables', phase,
}) {
  const config = getBossConfig(topicId)
  const { primaryColor, glowColor, abilities } = config
  const ultimateReady = ultimateMeter >= 100

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        zIndex: 20,
        pointerEvents: 'none',
        gap: 12,
      }}
    >
      {/* ── Left: Player ─────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <HPBar
          label="Player"
          current={playerHp}
          max={100}
          color="#22c55e"
          icon={<Shield size={14} />}
          align="left"
        />

        {/* Combo + Ultimate row */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', pointerEvents: 'auto' }}>
          {/* Combo */}
          <motion.div
            animate={combo > 3 ? { scale: [1, 1.12, 1] } : {}}
            transition={{ duration: 0.3 }}
            style={{
              background: 'rgba(0,0,0,0.55)',
              border: `1px solid ${combo > 0 ? 'rgba(56,189,248,0.5)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 8,
              padding: '7px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              backdropFilter: 'blur(6px)',
            }}
          >
            <Target size={14} color="#38bdf8" />
            <span style={{
              fontWeight: 900, fontSize: 14, color: combo > 3 ? '#fbbf24' : '#38bdf8',
              fontFamily: 'monospace',
              transition: 'color 0.2s',
            }}>
              ×{combo}
            </span>
            {combo > 0 && (
              <span style={{ fontSize: 9, color: '#64748b', letterSpacing: 1 }}>COMBO</span>
            )}
          </motion.div>

          {/* Ultimate */}
          <motion.button
            onClick={executeUltimate}
            disabled={!ultimateReady}
            whileHover={ultimateReady ? { scale: 1.05 } : {}}
            whileTap={ultimateReady ? { scale: 0.95 } : {}}
            animate={ultimateReady ? { boxShadow: ['0 0 12px rgba(245,158,11,0.4)', '0 0 24px rgba(245,158,11,0.8)', '0 0 12px rgba(245,158,11,0.4)'] } : {}}
            transition={{ duration: 1.2, repeat: Infinity }}
            style={{
              background: ultimateReady
                ? 'linear-gradient(135deg, rgba(245,158,11,0.9), rgba(239,68,68,0.9))'
                : 'rgba(0,0,0,0.55)',
              border: `1px solid ${ultimateReady ? '#f59e0b' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 8,
              padding: '7px 14px',
              color: ultimateReady ? '#fff' : '#475569',
              fontWeight: 900,
              fontSize: 12,
              cursor: ultimateReady ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              letterSpacing: 0.5,
              fontFamily: 'Poppins, sans-serif',
              backdropFilter: 'blur(6px)',
              transition: 'all 0.2s',
              pointerEvents: 'auto',
            }}
          >
            <Zap size={14} />
            {ultimateReady ? 'ULTIMATE' : `${ultimateMeter}%`}
          </motion.button>
        </div>

        {/* Ultimate fill bar */}
        <div style={{ width: 220 }}>
          <div style={{
            height: 3,
            background: 'rgba(0,0,0,0.4)',
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <motion.div
              style={{
                height: '100%',
                background: ultimateReady
                  ? 'linear-gradient(to right, #f59e0b, #ef4444)'
                  : 'rgba(245,158,11,0.6)',
                borderRadius: 2,
              }}
              animate={{ width: `${ultimateMeter}%` }}
              transition={{ type: 'spring', stiffness: 60, damping: 15 }}
            />
          </div>
        </div>
      </div>

      {/* ── Center: Phase tag ────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
        <AnimatePresence mode="wait">
          <PhaseTag key={phase} phase={phase} color={primaryColor} />
        </AnimatePresence>
      </div>

      {/* ── Right: Boss ──────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
        <HPBar
          label={bossName}
          current={bossHp}
          max={100}
          color={primaryColor}
          icon={<Skull size={14} />}
          align="right"
        />

        {/* Active ability hint */}
        {bossHp < 90 && abilities && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: 'rgba(0,0,0,0.5)',
              border: `1px solid ${primaryColor}30`,
              borderRadius: 6,
              padding: '4px 10px',
              fontSize: 10,
              color: primaryColor,
              fontWeight: 700,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
              backdropFilter: 'blur(6px)',
            }}
          >
            {bossHp < 40
              ? abilities[2]
              : bossHp < 70
              ? abilities[1]
              : abilities[0]}
          </motion.div>
        )}
      </div>
    </div>
  )
}
