import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { normalizeLanguage, t } from '../../utils/i18n';

export default function FillQuestion({ question, correctAnswer, answered, onAnswer, language }) {
  const { colors } = useTheme();
  const [input, setInput] = useState('');
  const effectiveLanguage = normalizeLanguage(language);

  return (
    <div>
      <pre style={{
        background: colors.bg, border: `1px solid ${colors.border}`,
        borderRadius: 8, padding: 16, fontFamily: 'monospace', fontSize: 14,
        color: colors.text, overflowX: 'auto', marginBottom: 16, whiteSpace: 'pre-wrap'
      }}>
        {question.replace('_____', '______')}
      </pre>

      <div style={{ display: 'flex', gap: 10 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={answered}
          placeholder={t(effectiveLanguage, 'typeAnswer', 'Type your answer here...')}
          onKeyDown={e => e.key === 'Enter' && !answered && input.trim() && onAnswer(input.trim())}
          style={{
            flex: 1, padding: '10px 16px', background: colors.surface,
            border: `1px solid ${colors.border}`, borderRadius: 10,
            color: colors.text, fontSize: 14, outline: 'none', fontFamily: 'monospace'
          }}
        />
        {!answered && (
          <button
            onClick={() => input.trim() && onAnswer(input.trim())}
            disabled={!input.trim()}
            style={{
              background: colors.accent, color: '#fff', border: 'none',
              borderRadius: 10, padding: '10px 20px', cursor: 'pointer',
              fontWeight: 600, fontSize: 14
            }}
          >
            {t(effectiveLanguage, 'submitAnswer', 'Submit')}
          </button>
        )}
      </div>

      {answered && (
        <p style={{ color: colors.textMuted, fontSize: 13, marginTop: 8 }}>
          {t(effectiveLanguage, 'correctAnswer', 'Correct answer:')} <code style={{ color: colors.success }}>{correctAnswer}</code>
        </p>
      )}
    </div>
  );
}
