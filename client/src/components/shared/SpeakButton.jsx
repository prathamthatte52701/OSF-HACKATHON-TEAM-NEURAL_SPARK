import { Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { speak, stopSpeaking } from '../../utils/tts';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function SpeakButton({ text, style, language }) {
  const [speaking, setSpeaking] = useState(false);
  const { colors } = useTheme();
  const { user } = useAuth();
  const activeSpeech = useRef(null);
  const currentLanguage = language || user?.language || 'english';

  useEffect(() => {
    setSpeaking(false);
    activeSpeech.current = null;
  }, [text, currentLanguage]);

  const handleSpeak = async () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      activeSpeech.current = null;
    } else {
      const utterance = await speak(text, currentLanguage, {
        onStart: () => setSpeaking(true),
        onEnd: () => {
          setSpeaking(false);
          activeSpeech.current = null;
        },
        onError: () => {
          setSpeaking(false);
          activeSpeech.current = null;
        },
      });
      activeSpeech.current = utterance;
      if (!utterance) setSpeaking(false);
    }
  };

  return (
    <button
      onClick={handleSpeak}
      title={speaking ? 'Stop speaking' : 'Read aloud'}
      style={{
        background: speaking ? colors.accent : colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: 8,
        padding: '6px 12px',
        cursor: 'pointer',
        color: speaking ? '#fff' : colors.text,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 13,
        transition: 'all 0.2s',
        ...style
      }}
    >
      {speaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
      {speaking ? 'Stop' : 'Listen'}
    </button>
  );
}
