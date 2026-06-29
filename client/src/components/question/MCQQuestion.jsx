import { useTheme } from '../../context/ThemeContext';

export default function MCQQuestion({ options = [], correctAnswer, selectedAnswer, answered, onAnswer }) {
  const { colors } = useTheme();

  const getBg = (opt) => {
    if (!answered) return colors.surface;
    if (opt === correctAnswer) return `${colors.success}20`;
    if (opt === selectedAnswer && opt !== correctAnswer) return `${colors.error}20`;
    return colors.surface;
  };

  const getBorder = (opt) => {
    if (!answered) return selectedAnswer === opt ? colors.accent : colors.border;
    if (opt === correctAnswer) return colors.success;
    if (opt === selectedAnswer && opt !== correctAnswer) return colors.error;
    return colors.border;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {options.map((opt, i) => (
        <button
          key={i}
          onClick={() => !answered && onAnswer(opt)}
          disabled={answered}
          style={{
            background: getBg(opt),
            border: `2px solid ${getBorder(opt)}`,
            borderRadius: 10, padding: '12px 16px',
            cursor: answered ? 'default' : 'pointer',
            color: colors.text, textAlign: 'left', fontSize: 14,
            transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 12
          }}
        >
          <span style={{
            width: 28, height: 28, borderRadius: '50%',
            background: opt === correctAnswer && answered ? colors.success : colors.border,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: opt === correctAnswer && answered ? '#fff' : colors.textMuted,
            fontSize: 12, fontWeight: 700, flexShrink: 0
          }}>
            {answered && opt === correctAnswer ? '✓' : String.fromCharCode(65 + i)}
          </span>
          {opt}
        </button>
      ))}
    </div>
  );
}
