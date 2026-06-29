import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { getFactForTopic } from '../../assets/facts/didYouKnow';
import { useAuth } from '../../context/AuthContext';
import { getStoredLanguage, normalizeLanguage, onLanguageChange } from '../../utils/i18n';

const TITLE_TEXT = {
  english: 'Did You Know?',
  hindi: 'क्या आप जानते हैं?',
  tamil: 'உங்களுக்கு தெரியுமா?',
  malayalam: 'നിങ്ങൾക്കറിയാമോ?',
};

const NEXT_TEXT = {
  english: 'Tap for next',
  hindi: 'अगला देखें',
  tamil: 'அடுத்ததை காண்க',
  malayalam: 'അടുത്തത് കാണൂ',
};

const ARIA_TEXT = {
  english: 'Show next did you know fact',
  hindi: 'अगला तथ्य दिखाएं',
  tamil: 'அடுத்த தகவலை காண்பி',
  malayalam: 'അടുത്ത അറിവ് കാണിക്കുക',
};

const TOPIC_FACT_FALLBACKS = {
  tamil: {
    variables: 'Python variables என்பது values-ஐ நினைவில் வைத்துக் கொள்ள உதவும் பெயர்கள். நல்ல பெயர்கள் code-ஐ தெளிவாக படிக்க உதவும்.',
    'data-types': 'Python-ல் int, float, str, bool போன்ற data types சரியான வகையில் data-வை கையாள உதவுகின்றன.',
    conditions: 'if, elif, else மூலம் Python உங்கள் code-க்கு முடிவு எடுக்கும் திறனை கொடுக்கிறது.',
    loops: 'Loops ஒரே செயலை மீண்டும் மீண்டும் செய்ய உதவும். இதனால் பெரிய data-வை எளிதாக process செய்யலாம்.',
    functions: 'Functions code-ஐ சிறிய reusable blocks ஆக பிரித்து தெளிவாக வைத்திருக்க உதவும்.',
    lists: 'Python lists பல values-ஐ ஒரே இடத்தில் சேமிக்க உதவும் dynamic collection ஆகும்.',
    strings: 'Python strings Unicode-ஐ support செய்கின்றன, அதனால் இந்திய மொழிகளையும் emoji-களையும் கையாள முடியும்.',
    oop: 'OOP data மற்றும் behavior-ஐ objects ஆக அமைத்து பெரிய programs-ஐ ஒழுங்காக கட்ட உதவும்.',
    'error-handling': 'try மற்றும் except மூலம் errors வந்தாலும் program safe-ஆக handle செய்ய முடியும்.',
    algorithms: 'Algorithms என்பது ஒரு பிரச்சினையை தீர்க்கும் தெளிவான படிநிலை முறைகள்.',
  },
  malayalam: {
    variables: 'Python variables values-നെ ഓർമ്മിക്കാൻ സഹായിക്കുന്ന പേരുകളാണ്. നല്ല പേരുകൾ code വായിക്കാൻ എളുപ്പമാക്കും.',
    'data-types': 'Python-ൽ int, float, str, bool പോലുള്ള data types data ശരിയായി കൈകാര്യം ചെയ്യാൻ സഹായിക്കുന്നു.',
    conditions: 'if, elif, else ഉപയോഗിച്ച് Python code-ന് തീരുമാനങ്ങൾ എടുക്കാൻ കഴിയും.',
    loops: 'Loops ഒരേ പ്രവർത്തി പല തവണ ആവർത്തിക്കാൻ സഹായിക്കുന്നു. വലിയ data process ചെയ്യാൻ ഇത് ഉപകാരപ്പെടും.',
    functions: 'Functions code-നെ reusable ചെറിയ blocks ആക്കി വ്യക്തമായി സൂക്ഷിക്കാൻ സഹായിക്കുന്നു.',
    lists: 'Python lists പല values ഒരിടത്ത് സൂക്ഷിക്കാൻ സഹായിക്കുന്ന dynamic collection ആണ്.',
    strings: 'Python strings Unicode support ചെയ്യുന്നു, അതിനാൽ ഇന്ത്യൻ ഭാഷകളും emoji-കളും കൈകാര്യം ചെയ്യാം.',
    oop: 'OOP data-യും behavior-യും objects ആയി ക്രമപ്പെടുത്തി വലിയ programs നന്നായി നിർമ്മിക്കാൻ സഹായിക്കുന്നു.',
    'error-handling': 'try, except ഉപയോഗിച്ച് errors വന്നാലും program സുരക്ഷിതമായി handle ചെയ്യാം.',
    algorithms: 'Algorithms ഒരു പ്രശ്നം പരിഹരിക്കാൻ ഉപയോഗിക്കുന്ന വ്യക്തമായ ഘട്ടങ്ങളാണ്.',
  },
};

const getLocalizedFact = (fact, topicId, language) => {
  if (!fact) return '';
  if (language === 'hindi') return fact.factHindi || fact.fact;
  if (language === 'tamil') return fact.factTamil || TOPIC_FACT_FALLBACKS.tamil[topicId] || fact.fact;
  if (language === 'malayalam') return fact.factMalayalam || TOPIC_FACT_FALLBACKS.malayalam[topicId] || fact.fact;
  return fact.fact;
};

export default function DidYouKnow({ topicId = 'variables', language }) {
  const { user } = useAuth();
  const effectiveTopicId = topicId || 'variables';
  const [activeLanguage, setActiveLanguage] = useState(() =>
    normalizeLanguage(language || user?.language || getStoredLanguage())
  );
  const effectiveLanguage = activeLanguage;
  const [shownIds, setShownIds] = useState([]);
  const [currentFact, setCurrentFact] = useState(() => getFactForTopic(effectiveTopicId, []));
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setActiveLanguage(normalizeLanguage(language || user?.language || getStoredLanguage()));
  }, [language, user?.language]);

  useEffect(() => onLanguageChange((nextLanguage) => {
    setActiveLanguage(normalizeLanguage(nextLanguage));
  }), []);

  useEffect(() => {
    setShownIds([]);
    setCurrentFact(getFactForTopic(effectiveTopicId, []));
    setVisible(true);
  }, [effectiveTopicId, effectiveLanguage]);

  const showNextFact = () => {
    setVisible(false);
    setTimeout(() => {
      const nextShownIds = currentFact?.id ? [...shownIds, currentFact.id] : shownIds;
      setCurrentFact(getFactForTopic(effectiveTopicId, nextShownIds));
      setShownIds(nextShownIds);
      setVisible(true);
    }, 200);
  };

  const factText = getLocalizedFact(currentFact, effectiveTopicId, effectiveLanguage);
  const titleText = TITLE_TEXT[effectiveLanguage] || TITLE_TEXT.english;
  const nextText = NEXT_TEXT[effectiveLanguage] || NEXT_TEXT.english;

  return (
    <button
      type="button"
      onClick={showNextFact}
      aria-label={ARIA_TEXT[effectiveLanguage] || ARIA_TEXT.english}
      style={{
        width: '100%',
        textAlign: 'left',
        border: '1px solid rgba(168, 85, 247, 0.46)',
        borderRadius: 16,
        padding: 0,
        marginBottom: 24,
        cursor: 'pointer',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #27184a 52%, #15151f 100%)',
        boxShadow: '0 18px 42px rgba(124, 58, 237, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      }}
    >
      <div
        style={{
          position: 'relative',
          minHeight: 172,
          padding: 20,
          background:
            'radial-gradient(circle at 88% 12%, rgba(216, 180, 254, 0.24), transparent 30%), radial-gradient(circle at 12% 90%, rgba(99, 102, 241, 0.18), transparent 34%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 34,
                height: 34,
                display: 'grid',
                placeItems: 'center',
                borderRadius: 10,
                color: '#FDE68A',
                background: 'rgba(124, 58, 237, 0.18)',
                border: '1px solid rgba(216, 180, 254, 0.28)',
              }}
            >
              <Sparkles size={18} />
            </span>
            <span style={{ color: '#F5E8FF', fontSize: 13, fontWeight: 800, letterSpacing: 1.1, textTransform: 'uppercase' }}>
              {titleText}
            </span>
          </div>

          <span style={{ color: '#D8B4FE', fontSize: 12, fontWeight: 700 }}>
            {nextText}
          </span>
        </div>

        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(4px)',
            transition: 'opacity 200ms ease, transform 200ms ease',
          }}
        >
          <div style={{ fontSize: 38, lineHeight: 1, marginBottom: 14 }}>
            {currentFact?.emoji || '✨'}
          </div>
          <p style={{ color: '#FFFFFF', fontSize: 15, lineHeight: 1.65, fontWeight: 600, margin: 0 }}>
            {factText}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 18 }}>
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              style={{
                width: dot === 0 ? 18 : 6,
                height: 6,
                borderRadius: 999,
                background: dot === 0 ? '#C084FC' : 'rgba(255, 255, 255, 0.28)',
                boxShadow: dot === 0 ? '0 0 14px rgba(192, 132, 252, 0.85)' : 'none',
              }}
            />
          ))}
        </div>
      </div>
    </button>
  );
}
