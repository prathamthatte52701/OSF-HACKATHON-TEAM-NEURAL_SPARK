import { normalizeLanguage } from '../../utils/i18n'

const TEXT = {
  english: {
    correctTitle: 'Nice, correct!',
    wrongTitle: 'Not quite.',
    correctSubtitle: 'Now let the explanation load.',
    wrongSubtitle: 'The explanation will clear it up.',
  },
  hindi: {
    correctTitle: 'Sahi jawab!',
    wrongTitle: 'Not quite.',
    correctSubtitle: 'Ab explanation dekhte hain.',
    wrongSubtitle: 'Chalo explanation se clear karte hain.',
  },
  tamil: {
    correctTitle: 'சரியான பதில்!',
    wrongTitle: 'சரியாக இல்லை.',
    correctSubtitle: 'இப்போது explanation பார்க்கலாம்.',
    wrongSubtitle: 'Explanation இதை தெளிவாக புரிய வைக்கும்.',
  },
  malayalam: {
    correctTitle: 'ശരിയായ ഉത്തരം!',
    wrongTitle: 'ഇനിയും ശരിയായിട്ടില്ല.',
    correctSubtitle: 'ഇപ്പോൾ explanation നോക്കാം.',
    wrongSubtitle: 'Explanation ഇത് വ്യക്തമാക്കും.',
  },
}

export default function RobotReaction({ correct, language, colors }) {
  const labels = TEXT[normalizeLanguage(language)] || TEXT.english
  const title = correct ? labels.correctTitle : labels.wrongTitle
  const subtitle = correct ? labels.correctSubtitle : labels.wrongSubtitle

  return (
    <div style={{
      background: correct ? `${colors.success}12` : `${colors.error}12`,
      border: `1px solid ${correct ? colors.success : colors.error}40`,
      borderRadius: 14,
      padding: 16,
      marginBottom: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
    }}>
      <img
        src={correct ? '/robot-happy.png' : '/robot-sad.png'}
        alt={correct ? 'Happy robot reaction' : 'Sad robot reaction'}
        style={{
          width: 72,
          height: 72,
          objectFit: 'contain',
          flex: '0 0 auto',
          filter: correct
            ? 'drop-shadow(0 8px 18px rgba(16,185,129,0.28))'
            : 'drop-shadow(0 8px 18px rgba(239,68,68,0.24))',
        }}
      />
      <div>
        <div style={{
          color: correct ? colors.success : colors.error,
          fontWeight: 800,
          fontSize: 16,
          marginBottom: 4,
        }}>
          {title}
        </div>
        <p style={{ color: colors.textMuted, margin: 0, fontSize: 13, lineHeight: 1.5 }}>
          {subtitle}
        </p>
      </div>
    </div>
  )
}
