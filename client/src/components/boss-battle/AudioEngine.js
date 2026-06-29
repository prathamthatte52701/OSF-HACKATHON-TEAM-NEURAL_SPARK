// Web Audio API synthesizer — cinematic sound design for boss battle
export class AudioEngine {
  constructor() {
    this.ctx      = null
    this.isMuted  = false
    this.masterVol = 0.7
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  toggleMute(muted) {
    this.isMuted = muted
  }

  // ── Core synth with ADSR envelope ──────────────────────────────────────────
  _playOsc({ freq = 440, type = 'sine', duration = 0.3, vol = 0.1,
              attack = 0.01, decay = 0.1, sustain = 0.6, release = 0.2,
              freqEnd = null, delay = 0, detune = 0 } = {}) {
    if (this.isMuted || !this.ctx) return
    try {
      const t   = this.ctx.currentTime + delay
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const vol2 = vol * this.masterVol

      osc.type = type
      osc.frequency.setValueAtTime(freq, t)
      if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, t + duration)
      if (detune) osc.detune.setValueAtTime(detune, t)

      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(vol2, t + attack)
      gain.gain.setValueAtTime(vol2 * sustain, t + attack + decay)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration + release)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(t)
      osc.stop(t + duration + release + 0.05)
    } catch {}
  }

  // ── Noise burst for impacts ─────────────────────────────────────────────────
  _noise(duration = 0.2, vol = 0.08, delay = 0) {
    if (this.isMuted || !this.ctx) return
    try {
      const t        = this.ctx.currentTime + delay
      const bufSize  = this.ctx.sampleRate * duration
      const buf      = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate)
      const data     = buf.getChannelData(0)
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1

      const src  = this.ctx.createBufferSource()
      const gain = this.ctx.createGain()
      const filt = this.ctx.createBiquadFilter()
      filt.type = 'bandpass'
      filt.frequency.value = 800

      src.buffer = buf
      gain.gain.setValueAtTime(vol * this.masterVol, t)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration)

      src.connect(filt)
      filt.connect(gain)
      gain.connect(this.ctx.destination)
      src.start(t)
      src.stop(t + duration)
    } catch {}
  }

  // ── Correct answer: sharp punchy hit + rising tone ─────────────────────────
  playHit() {
    this.init()
    this._noise(0.06, 0.12)
    this._playOsc({ freq: 220, freqEnd: 880, type: 'square', duration: 0.12, vol: 0.12, attack: 0.005, decay: 0.05, sustain: 0.4, release: 0.08 })
    this._playOsc({ freq: 660, type: 'sine', duration: 0.18, vol: 0.08, attack: 0.01, decay: 0.08, sustain: 0.3, release: 0.1, delay: 0.04 })
  }

  // ── Wrong answer: low thud + descending wail ───────────────────────────────
  playDamage() {
    this.init()
    this._noise(0.15, 0.18)
    this._playOsc({ freq: 180, freqEnd: 60, type: 'sawtooth', duration: 0.4, vol: 0.15, attack: 0.005, decay: 0.1, sustain: 0.5, release: 0.25 })
    this._playOsc({ freq: 90,  type: 'square', duration: 0.5, vol: 0.1, attack: 0.02, decay: 0.15, sustain: 0.4, release: 0.3, delay: 0.05 })
  }

  // ── Phase transition: rising siren choir ───────────────────────────────────
  playPhaseTransition() {
    this.init()
    if (this.isMuted || !this.ctx) return
    // Staggered harmonic sweep
    ;[1, 1.5, 2].forEach((mult, i) => {
      this._playOsc({
        freq: 100 * mult,
        freqEnd: 600 * mult,
        type: 'sine',
        duration: 1.8,
        vol: 0.08 / (i + 1),
        attack: 0.05,
        decay: 0.3,
        sustain: 0.7,
        release: 0.5,
        delay: i * 0.12,
      })
    })
    this._noise(0.4, 0.06, 0.1)
  }

  // ── Ultimate: massive layered impact ───────────────────────────────────────
  playUltimate() {
    this.init()
    // Wind-up
    this._playOsc({ freq: 80, freqEnd: 2000, type: 'sawtooth', duration: 0.6, vol: 0.12, attack: 0.02, decay: 0.2, sustain: 0.6, release: 0.3 })
    // Impact cluster
    ;[0, 100, 200, 400, 800].forEach((freq, i) => {
      this._playOsc({ freq: freq || 50, type: 'square', duration: 0.6 - i * 0.08, vol: 0.1 - i * 0.015, attack: 0.005, decay: 0.1, sustain: 0.5, release: 0.3, delay: 0.6 + i * 0.04 })
    })
    this._noise(0.5, 0.2, 0.55)
  }

  // ── Victory: triumphant ascending arpeggio ────────────────────────────────
  playVictory() {
    this.init()
    const notes = [261.63, 329.63, 392, 523.25, 659.25, 783.99]
    notes.forEach((freq, i) => {
      this._playOsc({ freq, type: 'square', duration: 0.45, vol: 0.09, attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.2, delay: i * 0.12 })
      this._playOsc({ freq: freq * 2, type: 'sine', duration: 0.3, vol: 0.04, attack: 0.02, decay: 0.08, sustain: 0.4, release: 0.15, delay: i * 0.12 + 0.02 })
    })
  }

  // ── Defeat: descending dirge ──────────────────────────────────────────────
  playDefeat() {
    this.init()
    const notes = [392, 349.23, 311.13, 261.63, 220, 174.61]
    notes.forEach((freq, i) => {
      this._playOsc({ freq, type: 'sawtooth', duration: 0.7, vol: 0.08, attack: 0.02, decay: 0.15, sustain: 0.5, release: 0.4, delay: i * 0.22 })
    })
    this._noise(0.8, 0.05, 0.3)
  }
}

export const audio = new AudioEngine()
