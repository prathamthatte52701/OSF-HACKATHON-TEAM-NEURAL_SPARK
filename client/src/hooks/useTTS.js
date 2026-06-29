import { useState, useCallback } from 'react'
import { speak as speakText, stopSpeaking } from '../utils/tts'

const useTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const speak = useCallback((text, language = 'english') => {
    speakText(text, language, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    })
  }, [])

  const stop = useCallback(() => {
    stopSpeaking()
    setIsSpeaking(false)
  }, [])

  return { speak, stop, isSpeaking }
}

export default useTTS
