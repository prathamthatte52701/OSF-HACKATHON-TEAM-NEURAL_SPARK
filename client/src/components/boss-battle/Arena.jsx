import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { getBossConfig } from '../../utils/bossConfig'

// ─── Particle factories per arena type ───────────────────────────────────────
function useParticles(count) {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: 20 + Math.random() * 70,
        size: Math.random() * 3 + 1.5,
        duration: Math.random() * 8 + 8,
        delay: Math.random() * 6,
        drift: (Math.random() - 0.5) * 30,
      })),
    []
  )
}

// ─── Arena: Memory Vault (variables) ─────────────────────────────────────────
function VaultArena({ phase, color, glowColor }) {
  const cells = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: 5 + (i % 6) * 16,
        y: 10 + Math.floor(i / 6) * 28,
        label: ['x', 'y', 'z', 'n', 'val', 'tmp', 'i', 'j', 'k', 'count', 'sum', 'max', 'min', 'name', 'num', 'data', 'ptr', 'ref'][i],
        delay: i * 0.15,
        opacity: 0.15 + Math.random() * 0.35,
      })),
    []
  )
  const particles = useParticles(25)

  return (
    <>
      {/* Floating memory cells */}
      {cells.map(cell => (
        <motion.div
          key={cell.id}
          style={{
            position: 'absolute',
            left: `${cell.x}%`,
            top: `${cell.y}%`,
            border: `1px solid ${color}`,
            borderRadius: 4,
            padding: '4px 10px',
            fontSize: 11,
            fontFamily: 'monospace',
            color: color,
            opacity: cell.opacity,
            background: `${color}08`,
            letterSpacing: 1,
          }}
          animate={{ y: [-6, 6, -6], opacity: [cell.opacity, cell.opacity * 1.8, cell.opacity] }}
          transition={{ duration: 4 + cell.id * 0.3, repeat: Infinity, delay: cell.delay, ease: 'easeInOut' }}
        >
          {cell.label}
        </motion.div>
      ))}
      {/* Binary rain */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: 0,
            fontSize: p.size * 4,
            fontFamily: 'monospace',
            color: color,
            opacity: 0,
          }}
          animate={{ y: ['0vh', '110vh'], opacity: [0, 0.5, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'linear' }}
        >
          {p.id % 2 === 0 ? '0' : '1'}
        </motion.div>
      ))}
    </>
  )
}

// ─── Arena: Time Chamber (loops) ─────────────────────────────────────────────
function TimeChamberArena({ phase, color }) {
  const rings = useMemo(
    () =>
      [600, 480, 360, 240].map((size, i) => ({
        size,
        duration: 8 + i * 4,
        dir: i % 2 === 0 ? 360 : -360,
        opacity: 0.12 + i * 0.06,
        dash: i % 2 === 0 ? '12 8' : '4 16',
      })),
    []
  )
  const particles = useParticles(30)

  return (
    <>
      {/* Concentric rotating rings */}
      {rings.map((ring, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: ring.size,
            height: ring.size,
            marginLeft: -ring.size / 2,
            marginTop: -ring.size / 2,
            borderRadius: '50%',
            border: `2px dashed ${color}`,
            opacity: ring.opacity,
          }}
          animate={{ rotate: ring.dir }}
          transition={{ duration: ring.duration, repeat: Infinity, ease: 'linear' }}
        />
      ))}
      {/* Spiral particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size * 2,
            height: p.size * 2,
            borderRadius: '50%',
            background: color,
            opacity: 0,
          }}
          animate={{
            x: [0, p.drift, 0, -p.drift, 0],
            y: [0, -30, -60, -90, -120],
            opacity: [0, 0.7, 0.5, 0.3, 0],
            scale: [0.5, 1, 0.8, 0.5, 0],
          }}
          transition={{ duration: p.duration * 0.7, repeat: Infinity, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
      {/* Loop counter display */}
      {[0, 1, 2, 3].map(i => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${8 + i * 24}%`,
            bottom: '15%',
            fontSize: 13,
            fontFamily: 'monospace',
            color: color,
            opacity: 0.25,
          }}
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
        >
          for i in range(∞):
        </motion.div>
      ))}
    </>
  )
}

// ─── Arena: Arcane Library (functions) ───────────────────────────────────────
function LibraryArena({ phase, color }) {
  const symbols = ['λ', 'ƒ', '∑', '∂', '→', '⟹', 'def', '()', 'return', 'yield']
  const particles = useParticles(20)

  return (
    <>
      {symbols.map((sym, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${8 + (i % 5) * 20}%`,
            top: `${15 + Math.floor(i / 5) * 40}%`,
            fontSize: sym.length > 2 ? 14 : 28,
            fontFamily: 'serif',
            color: color,
            opacity: 0.2,
            letterSpacing: 2,
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.12, 0.35, 0.12],
            rotate: [-5, 5, -5],
          }}
          transition={{ duration: 5 + i * 0.4, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
        >
          {sym}
        </motion.div>
      ))}
      {/* Upward spark particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            bottom: 0,
            width: p.size,
            height: p.size * 6,
            background: `linear-gradient(to top, ${color}, transparent)`,
            borderRadius: 2,
            opacity: 0,
          }}
          animate={{ y: [0, '-80vh'], opacity: [0, 0.6, 0] }}
          transition={{ duration: p.duration * 0.6, repeat: Infinity, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </>
  )
}

// ─── Arena: Data Ocean (lists) ────────────────────────────────────────────────
function OceanArena({ phase, color }) {
  const items = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        value: [42, 'hello', 3.14, 'True', 'None', 0, 'data', 7, '[1,2]', 99, 'x', 'False', -1, 100][i],
        delay: i * 0.2,
        y: 25 + (i % 3) * 22,
        x: 2 + i * 7,
      }))
      .filter(item => item.x < 96),
    []
  )
  const particles = useParticles(20)

  return (
    <>
      {/* Wave lines */}
      {[0, 1, 2].map(row => (
        <motion.div
          key={row}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${20 + row * 25}%`,
            height: 1,
            background: `linear-gradient(to right, transparent, ${color}40, transparent)`,
          }}
          animate={{ scaleX: [0.8, 1.05, 0.8], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3 + row, repeat: Infinity, delay: row * 0.8, ease: 'easeInOut' }}
        />
      ))}
      {/* Floating list elements */}
      {items.map(item => (
        <motion.div
          key={item.id}
          style={{
            position: 'absolute',
            left: `${item.x}%`,
            top: `${item.y}%`,
            border: `1px solid ${color}`,
            borderRadius: 3,
            padding: '3px 8px',
            fontSize: 11,
            fontFamily: 'monospace',
            color: color,
            opacity: 0.2,
            background: `${color}08`,
          }}
          animate={{ y: [-8, 8, -8], opacity: [0.1, 0.35, 0.1] }}
          transition={{ duration: 4 + item.id * 0.2, repeat: Infinity, delay: item.delay, ease: 'easeInOut' }}
        >
          {String(item.value)}
        </motion.div>
      ))}
      {particles.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size * 2,
            height: p.size * 2,
            borderRadius: '50%',
            background: color,
            opacity: 0,
          }}
          animate={{ x: [0, p.drift], y: [-20, -60], opacity: [0, 0.5, 0] }}
          transition={{ duration: p.duration * 0.5, repeat: Infinity, delay: p.delay }}
        />
      ))}
    </>
  )
}

// ─── Arena: Neon Cathedral (strings) ─────────────────────────────────────────
function CathedralArena({ phase, color }) {
  const chars = '"Hello"  f"..."  .split()  .join()  len()  .upper()  .find()  [::-1]  .replace()  str()'.split('  ')
  const particles = useParticles(24)

  return (
    <>
      {/* Streaming text columns */}
      {[10, 25, 42, 58, 74, 88].map((col, ci) => (
        <motion.div
          key={ci}
          style={{
            position: 'absolute',
            left: `${col}%`,
            top: '-5%',
            fontFamily: 'monospace',
            fontSize: 11,
            color: color,
            opacity: 0.18,
            whiteSpace: 'nowrap',
            letterSpacing: 1,
          }}
          animate={{ y: ['-5%', '110%'], opacity: [0, 0.22, 0.22, 0] }}
          transition={{ duration: 10 + ci * 1.5, repeat: Infinity, delay: ci * 1.2, ease: 'linear' }}
        >
          {chars.join('\n')}
        </motion.div>
      ))}
      {/* Cipher symbols */}
      {'ABCDEFGHIJKLM'.split('').map((ch, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${6 + i * 7}%`,
            top: `${30 + (i % 3) * 20}%`,
            fontSize: 20,
            fontFamily: 'monospace',
            color: color,
            opacity: 0.1,
          }}
          animate={{ opacity: [0.05, 0.25, 0.05], rotate: [-10, 10, -10] }}
          transition={{ duration: 3 + i * 0.2, repeat: Infinity, delay: i * 0.15 }}
        >
          {String.fromCharCode(65 + (i * 7) % 26)}
        </motion.div>
      ))}
      {particles.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: color,
            borderRadius: 1,
            opacity: 0,
          }}
          animate={{ x: [0, p.drift], y: [0, -50], opacity: [0, 0.6, 0] }}
          transition={{ duration: p.duration * 0.5, repeat: Infinity, delay: p.delay }}
        />
      ))}
    </>
  )
}

// ─── Arena: Cyber Kingdom (oop) ───────────────────────────────────────────────
function KingdomArena({ phase, color }) {
  const particles = useParticles(20)

  return (
    <>
      {/* Pillars */}
      {[8, 20, 78, 90].map((x, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${x}%`,
            bottom: 0,
            width: 6,
            height: `${40 + i * 5}%`,
            background: `linear-gradient(to top, ${color}40, transparent)`,
            borderLeft: `1px solid ${color}30`,
            borderRight: `1px solid ${color}30`,
          }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}
      {/* Class hierarchy lines */}
      {['class Animal:', '  class Dog(Animal):', '    class Poodle(Dog):', 'class Emperor(Base):'].map((line, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${3 + i * 3}%`,
            top: `${15 + i * 18}%`,
            fontSize: 11,
            fontFamily: 'monospace',
            color: color,
            opacity: 0.18,
            letterSpacing: 0.5,
          }}
          animate={{ opacity: [0.08, 0.22, 0.08] }}
          transition={{ duration: 5, repeat: Infinity, delay: i * 0.7 }}
        >
          {line}
        </motion.div>
      ))}
      {particles.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size * 2,
            height: p.size * 2,
            background: color,
            opacity: 0,
            borderRadius: 2,
            rotate: 45,
          }}
          animate={{ y: [0, -40], opacity: [0, 0.5, 0], rotate: [45, 135] }}
          transition={{ duration: p.duration * 0.6, repeat: Infinity, delay: p.delay }}
        />
      ))}
    </>
  )
}

// ─── Arena: Broken Server Realm (error-handling) ──────────────────────────────
function BrokenServerArena({ phase, color }) {
  const particles = useParticles(20)
  const errors = ['TypeError', 'ValueError', 'KeyError', 'AttributeError', 'RuntimeError', 'IndexError']

  return (
    <>
      {/* Glitch scan lines */}
      {[15, 35, 55, 72, 88].map((y, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${y}%`,
            height: 2,
            background: `linear-gradient(to right, transparent, ${color}60, transparent)`,
            opacity: 0,
          }}
          animate={{ opacity: [0, 0.8, 0], scaleX: [0.2, 1, 0.2] }}
          transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 3 + i * 0.7, delay: i * 0.4 }}
        />
      ))}
      {/* Error traces */}
      {errors.map((err, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${5 + (i % 3) * 33}%`,
            top: `${20 + Math.floor(i / 3) * 35}%`,
            fontSize: 11,
            fontFamily: 'monospace',
            color: color,
            opacity: 0.15,
          }}
          animate={{ opacity: [0.05, 0.3, 0.05], x: [0, (i % 2 === 0 ? 3 : -3), 0] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
        >
          {err}
        </motion.div>
      ))}
      {particles.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size * 3,
            height: p.size,
            background: color,
            opacity: 0,
            borderRadius: 1,
          }}
          animate={{ x: [0, p.drift * 2], opacity: [0, 0.7, 0] }}
          transition={{ duration: p.duration * 0.3, repeat: Infinity, delay: p.delay }}
        />
      ))}
    </>
  )
}

// ─── Arena: Quantum Nexus (algorithms) ───────────────────────────────────────
function NexusArena({ phase, color }) {
  const nodes = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: 10 + (i % 4) * 24,
        y: 20 + Math.floor(i / 4) * 40,
        delay: i * 0.3,
      })),
    []
  )
  const particles = useParticles(18)

  return (
    <>
      {/* Graph nodes */}
      {nodes.map(node => (
        <motion.div
          key={node.id}
          style={{
            position: 'absolute',
            left: `${node.x}%`,
            top: `${node.y}%`,
            width: 12,
            height: 12,
            borderRadius: '50%',
            border: `2px solid ${color}`,
            background: `${color}20`,
            opacity: 0.35,
          }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, delay: node.delay }}
        />
      ))}
      {/* Flow arrows between nodes */}
      {nodes.slice(0, 4).map((node, i) => (
        <motion.div
          key={`edge-${i}`}
          style={{
            position: 'absolute',
            left: `${node.x + 1.2}%`,
            top: `${node.y + 3}%`,
            width: '20%',
            height: 1,
            background: `linear-gradient(to right, ${color}60, transparent)`,
            transformOrigin: 'left',
          }}
          animate={{ scaleX: [0, 1, 0], opacity: [0, 0.4, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}
      {/* Big O notation floating */}
      {['O(1)', 'O(n)', 'O(log n)', 'O(n²)'].map((notation, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${15 + i * 22}%`,
            bottom: `${12 + (i % 2) * 15}%`,
            fontSize: 13,
            fontFamily: 'monospace',
            color: color,
            opacity: 0.18,
          }}
          animate={{ y: [-5, 5, -5], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.6 }}
        >
          {notation}
        </motion.div>
      ))}
      {particles.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: color,
            opacity: 0,
          }}
          animate={{ x: [0, p.drift], opacity: [0, 0.6, 0] }}
          transition={{ duration: p.duration * 0.5, repeat: Infinity, delay: p.delay }}
        />
      ))}
    </>
  )
}

// ─── Arena: Forge (data-types) ────────────────────────────────────────────────
function ForgeArena({ phase, color }) {
  const shapes = ['●', '■', '▲', '◆', '★', '⬡']
  const particles = useParticles(22)

  return (
    <>
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${8 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            fontSize: 28,
            color: color,
            opacity: 0.15,
          }}
          animate={{
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8],
            opacity: [0.08, 0.25, 0.08],
          }}
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
        >
          {shape}
        </motion.div>
      ))}
      {['int', 'str', 'float', 'bool', 'list', 'dict', 'tuple', 'None'].map((t, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${5 + i * 12}%`,
            bottom: `${15 + (i % 3) * 12}%`,
            fontSize: 11,
            fontFamily: 'monospace',
            color: color,
            opacity: 0.18,
            border: `1px solid ${color}30`,
            padding: '2px 6px',
            borderRadius: 3,
          }}
          animate={{ y: [-4, 4, -4], opacity: [0.1, 0.28, 0.1] }}
          transition={{ duration: 3 + i * 0.3, repeat: Infinity, delay: i * 0.25 }}
        >
          {t}
        </motion.div>
      ))}
      {particles.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size * 2,
            height: p.size * 2,
            background: color,
            opacity: 0,
            borderRadius: p.id % 2 === 0 ? '50%' : 2,
          }}
          animate={{ y: [0, -40], opacity: [0, 0.5, 0], rotate: [0, 180] }}
          transition={{ duration: p.duration * 0.6, repeat: Infinity, delay: p.delay }}
        />
      ))}
    </>
  )
}

// ─── Arena: Labyrinth (conditions) ───────────────────────────────────────────
function LabyrinthArena({ phase, color }) {
  const particles = useParticles(20)

  return (
    <>
      {/* If/else branches */}
      {[
        { text: 'if x > 0:', x: 5, y: 15 },
        { text: '  return True', x: 10, y: 25 },
        { text: 'elif x == 0:', x: 5, y: 38 },
        { text: '  return None', x: 10, y: 48 },
        { text: 'else:', x: 5, y: 61 },
        { text: '  return False', x: 10, y: 71 },
      ].map((line, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${line.x}%`,
            top: `${line.y}%`,
            fontSize: 11,
            fontFamily: 'monospace',
            color: color,
            opacity: 0.18,
            letterSpacing: 0.5,
          }}
          animate={{ opacity: [0.08, 0.25, 0.08] }}
          transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
        >
          {line.text}
        </motion.div>
      ))}
      {/* Branch path indicators */}
      {[30, 55, 78].map((x, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${x}%`,
            top: '30%',
            width: 1,
            height: '40%',
            background: `linear-gradient(to bottom, transparent, ${color}50, transparent)`,
          }}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.6 }}
        />
      ))}
      {particles.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size * 2,
            height: p.size * 2,
            background: color,
            opacity: 0,
            borderRadius: '50%',
          }}
          animate={{ y: [0, -35], opacity: [0, 0.5, 0] }}
          transition={{ duration: p.duration * 0.6, repeat: Infinity, delay: p.delay }}
        />
      ))}
    </>
  )
}

// ─── Default generic particle arena ──────────────────────────────────────────
function DefaultArena({ color }) {
  const particles = useParticles(35)
  return (
    <>
      {particles.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: color,
            borderRadius: '50%',
            opacity: 0,
          }}
          animate={{ y: [0, '-20vh'], opacity: [0, 0.7, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'linear' }}
        />
      ))}
    </>
  )
}

// ─── Phase-aware background gradient ──────────────────────────────────────────
function getBackground(phase, config) {
  if (phase === 'victory') return 'linear-gradient(135deg, #001a3d, #003d1a, #020617)'
  if (phase === 'defeat') return 'linear-gradient(135deg, #1a0000, #0d0000, #000000)'
  if (phase === 'phase3') return `linear-gradient(135deg, ${config.bgFrom}, ${config.bgMid}, ${config.bgTo})`
  if (phase === 'phase2') {
    const c = config.primaryColor
    return `linear-gradient(135deg, ${config.bgFrom}ee, ${config.bgMid}, ${config.bgTo}dd)`
  }
  return `linear-gradient(135deg, ${config.bgFrom}, ${config.bgMid}, ${config.bgTo})`
}

function getRadialGlow(phase, config) {
  if (phase === 'phase3') return config.glowColor.replace('0.7', '0.4').replace('0.8', '0.45')
  if (phase === 'phase2') return config.glowColor.replace('0.7', '0.25').replace('0.8', '0.3')
  if (phase === 'duel') return 'rgba(16, 185, 129, 0.2)'
  if (phase === 'victory') return 'rgba(34, 197, 94, 0.2)'
  if (phase === 'defeat') return 'rgba(239, 68, 68, 0.15)'
  return config.glowColor.replace('0.7', '0.18').replace('0.8', '0.2')
}

// ─── Main Arena Component ─────────────────────────────────────────────────────
export default function Arena({ phase, shake, topicId = 'variables' }) {
  const config = getBossConfig(topicId)
  const { primaryColor, arena } = config

  const renderThematicContent = () => {
    if (!['phase1', 'phase2', 'phase3', 'intro', 'countdown'].includes(phase)) return null
    switch (arena) {
      case 'vault':       return <VaultArena phase={phase} color={primaryColor} glowColor={config.glowColor} />
      case 'timechamber': return <TimeChamberArena phase={phase} color={primaryColor} />
      case 'library':     return <LibraryArena phase={phase} color={primaryColor} />
      case 'ocean':       return <OceanArena phase={phase} color={primaryColor} />
      case 'cathedral':   return <CathedralArena phase={phase} color={primaryColor} />
      case 'kingdom':     return <KingdomArena phase={phase} color={primaryColor} />
      case 'brokenserver':return <BrokenServerArena phase={phase} color={primaryColor} />
      case 'nexus':       return <NexusArena phase={phase} color={primaryColor} />
      case 'forge':       return <ForgeArena phase={phase} color={primaryColor} />
      case 'labyrinth':   return <LabyrinthArena phase={phase} color={primaryColor} />
      default:            return <DefaultArena color={primaryColor} />
    }
  }

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        background: getBackground(phase, config),
        transition: 'background 2.5s ease-in-out',
      }}
      animate={{ x: shake ? [-8, 8, -6, 6, -3, 3, 0] : 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {/* Radial ambient glow */}
      <motion.div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '140vw',
          height: '140vh',
          background: `radial-gradient(circle at 50% 40%, ${getRadialGlow(phase, config)}, transparent 60%)`,
          pointerEvents: 'none',
        }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Phase3 scanlines */}
      {phase === 'phase3' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.12), rgba(0,0,0,0.12) 1px, transparent 1px, transparent 3px)',
          pointerEvents: 'none',
          opacity: 0.4,
        }} />
      )}

      {/* Topic-specific content */}
      {renderThematicContent()}

      {/* Duel glow override */}
      {phase === 'duel' && (
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(16,185,129,0.15), transparent 70%)',
            pointerEvents: 'none',
          }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Bottom grid floor */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '35vh',
        background: `linear-gradient(transparent, ${primaryColor}08)`,
        borderTop: `1px solid ${primaryColor}18`,
        transform: 'perspective(600px) rotateX(55deg)',
        transformOrigin: 'bottom',
        pointerEvents: 'none',
      }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)',
        pointerEvents: 'none',
      }} />
    </motion.div>
  )
}
