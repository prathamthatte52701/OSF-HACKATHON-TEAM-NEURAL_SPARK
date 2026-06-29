import { useState, useRef, useEffect, useCallback } from 'react'
import { getBossConfig, getBossDialogue } from '../utils/bossConfig'

const START_BOSS_HP   = 100
const START_PLAYER_HP = 100

// Phases: 'intro' | 'countdown' | 'phase1' | 'phase2' | 'phase3' | 'duel' | 'execution' | 'victory' | 'defeat'

export const BOSS_NAMES = {
  variables:        'Memory Titan',
  'data-types':     'The Shape Shifter',
  conditions:       'The Branch Warden',
  loops:            'Infinite Hydra',
  functions:        'The Function Architect',
  lists:            'List Leviathan',
  strings:          'Cipher Phantom',
  oop:              'Class Emperor',
  'error-handling': 'Corruption Core',
  algorithms:       'Algorithm Overlord',
}

export function useBossBattle(questionsCount, topicId = 'variables', language = 'english') {
  const config = getBossConfig(topicId)

  const [phase,                setPhase]                = useState('intro')
  const [bossHp,               setBossHp]               = useState(START_BOSS_HP)
  const [playerHp,             setPlayerHp]             = useState(START_PLAYER_HP)
  const [combo,                setCombo]                = useState(0)
  const [bestCombo,            setBestCombo]            = useState(0)
  const [ultimateMeter,        setUltimateMeter]        = useState(0)
  const [battleLog,            setBattleLog]            = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [shake,                setShake]                = useState(false)
  const [correctCount,         setCorrectCount]         = useState(0)
  const [bossDialogue,         setBossDialogue]         = useState('')
  const [lastDamage,           setLastDamage]           = useState(null) // { amount, type: 'hit'|'damage' }

  const startTime  = useRef(Date.now())
  const phaseRef   = useRef('intro')
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    let interval
    if (['phase1', 'phase2', 'phase3', 'duel'].includes(phase)) {
      interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime.current) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [phase])

  const addLog = useCallback((message, type = 'info') => {
    setBattleLog(prev => [{ message, type, id: Date.now() + Math.random() }, ...prev].slice(0, 6))
  }, [])

  const showDialogue = useCallback((key) => {
    const line = getBossDialogue(topicId, language, key)
    if (line) {
      setBossDialogue(line)
      setTimeout(() => setBossDialogue(''), 4000)
    }
  }, [topicId, language])

  const triggerShake = useCallback((duration = 300) => {
    setShake(true)
    setTimeout(() => setShake(false), duration)
  }, [])

  const startCountdown = useCallback(() => {
    setPhase('countdown')
    phaseRef.current = 'countdown'
    addLog('System online. Encounter imminent.', 'system')
  }, [addLog])

  const startGame = useCallback(() => {
    startTime.current = Date.now()
    setPhase('phase1')
    phaseRef.current = 'phase1'
    addLog('BATTLE INITIATED', 'system')
    setTimeout(() => showDialogue('intro'), 800)
  }, [addLog, showDialogue])

  const checkPhaseTransition = useCallback((hp, currentPhase) => {
    if (hp <= 10 && !['duel','execution','victory'].includes(currentPhase)) return 'duel'
    if (hp <= 40 && !['phase3','duel','execution','victory'].includes(currentPhase)) return 'phase3'
    if (hp <= 70 && !['phase2','phase3','duel','execution','victory'].includes(currentPhase)) return 'phase2'
    return null
  }, [])

  const submitAnswer = useCallback((isCorrect, damageOverride = 0) => {
    const currentPhase = phaseRef.current

    if (isCorrect) {
      const nextCombo   = combo + 1
      const baseDamage  = 12
      const comboBonus  = Math.min(nextCombo * 3, 16)
      const damage      = damageOverride || Math.min(30, baseDamage + comboBonus)
      const nextHp      = Math.max(0, bossHp - damage)

      setCombo(nextCombo)
      setBestCombo(prev => Math.max(prev, nextCombo))
      setCorrectCount(prev => prev + 1)
      setUltimateMeter(prev => Math.min(100, prev + 25))
      setBossHp(nextHp)
      setLastDamage({ amount: damage, type: 'hit' })
      triggerShake(180)
      addLog(`Critical Hit! −${damage} HP`, 'hit')

      if (nextCombo === 4) showDialogue('bigCombo')
      else if (nextCombo >= 7) showDialogue('playerWinning')

      const nextPhase = checkPhaseTransition(nextHp, currentPhase)

      if (nextHp <= 0) {
        setTimeout(() => {
          setPhase('execution')
          phaseRef.current = 'execution'
          addLog('TARGET NEUTRALIZED. INITIATING FINAL PROTOCOL.', 'system')
          setTimeout(() => {
            setPhase('victory')
            phaseRef.current = 'victory'
            showDialogue('victory')
          }, 3500)
        }, 1000)
      } else if (nextPhase === 'duel') {
        setTimeout(() => {
          setPhase('duel')
          phaseRef.current = 'duel'
          addLog('CRITICAL STATE. INITIATING FINAL DUEL.', 'system')
          showDialogue('phase3')
        }, 1000)
      } else if (nextPhase) {
        setPhase(nextPhase)
        phaseRef.current = nextPhase
        addLog(`ENTITY EVOLVED → ${nextPhase.toUpperCase()}`, 'system')
        showDialogue(nextPhase === 'phase3' ? 'phase3' : 'phase2')
        setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 1200)
      } else {
        if (currentQuestionIndex < questionsCount - 1) {
          setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 1200)
        } else {
          setTimeout(() => {
            setPhase(nextHp <= 0 ? 'execution' : 'defeat')
            phaseRef.current = nextHp <= 0 ? 'execution' : 'defeat'
          }, 1200)
        }
      }
    } else {
      const bossAttack = 18 + Math.floor(Math.random() * 8)
      const nextHp     = Math.max(0, playerHp - bossAttack)
      const ability    = config.abilities[bossHp < 40 ? 2 : bossHp < 70 ? 1 : 0]

      setCombo(0)
      setPlayerHp(nextHp)
      setLastDamage({ amount: bossAttack, type: 'damage' })
      triggerShake(450)
      addLog(`${ability}! −${bossAttack} HP`, 'damage')

      if (combo >= 3) showDialogue('comboBreak')
      else if (nextHp < 30) showDialogue('playerLosing')

      if (nextHp <= 0) {
        setTimeout(() => {
          setPhase('defeat')
          phaseRef.current = 'defeat'
          showDialogue('defeat')
        }, 1000)
      } else {
        if (currentQuestionIndex < questionsCount - 1) {
          setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 1000)
        } else {
          setTimeout(() => {
            setPhase('defeat')
            phaseRef.current = 'defeat'
          }, 1000)
        }
      }
    }
  }, [
    bossHp, playerHp, combo, triggerShake, addLog, showDialogue,
    checkPhaseTransition, currentQuestionIndex, questionsCount, config,
  ])

  const executeUltimate = useCallback(() => {
    if (ultimateMeter >= 100) {
      setUltimateMeter(0)
      addLog('ULTIMATE OVERRIDE! MASSIVE DAMAGE!', 'hit')
      submitAnswer(true, 48)
    }
  }, [ultimateMeter, submitAnswer, addLog])

  const reset = useCallback(() => {
    setPhase('intro')
    phaseRef.current = 'intro'
    setBossHp(START_BOSS_HP)
    setPlayerHp(START_PLAYER_HP)
    setCombo(0)
    setBestCombo(0)
    setUltimateMeter(0)
    setBattleLog([])
    setCurrentQuestionIndex(0)
    setCorrectCount(0)
    setTimeElapsed(0)
    setBossDialogue('')
    setLastDamage(null)
  }, [])

  return {
    phase,
    bossHp,
    playerHp,
    combo,
    bestCombo,
    correctCount,
    ultimateMeter,
    battleLog,
    currentQuestionIndex,
    shake,
    timeElapsed,
    bossDialogue,
    lastDamage,
    startCountdown,
    startGame,
    submitAnswer,
    executeUltimate,
    setPhase,
    reset,
    START_BOSS_HP,
    START_PLAYER_HP,
  }
}
