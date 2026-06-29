import { normalizeLanguage } from './i18n';

const SPEECH_LANG = {
  english: 'en-IN',
  hindi: 'hi-IN',
  tamil: 'ta-IN',
  malayalam: 'ml-IN',
};

const VOICE_MATCHERS = {
  english: /english|en-in|en-/i,
  hindi: /hindi|hi-in|hi_/i,
  tamil: /tamil|ta-in|ta_/i,
  malayalam: /malayalam|ml-in|ml_/i,
};

export const getSpeechLang = (language = 'english') =>
  SPEECH_LANG[normalizeLanguage(language)] || SPEECH_LANG.english;

const cleanTextForSpeech = (text) =>
  String(text || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#*_`>~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const loadVoices = () => new Promise(resolve => {
  if (!window.speechSynthesis) return resolve([]);

  const voices = window.speechSynthesis.getVoices();
  if (voices.length) return resolve(voices);

  let settled = false;
  let fallbackTimer = null;
  const finish = () => {
    if (settled) return;
    settled = true;
    if (fallbackTimer) clearTimeout(fallbackTimer);
    window.speechSynthesis.removeEventListener?.('voiceschanged', finish);
    if (window.speechSynthesis.onvoiceschanged === finish) {
      window.speechSynthesis.onvoiceschanged = null;
    }
    resolve(window.speechSynthesis.getVoices());
  };

  if (window.speechSynthesis.addEventListener) {
    window.speechSynthesis.addEventListener('voiceschanged', finish, { once: true });
  } else {
    window.speechSynthesis.onvoiceschanged = finish;
  }
  fallbackTimer = setTimeout(finish, 800);
});

const chooseVoice = (voices, language) => {
  const safeLanguage = normalizeLanguage(language);
  const speechLang = getSpeechLang(language);
  const langPrefix = speechLang.split('-')[0];
  const matching = voices.filter(voice => (voice.lang || '').toLowerCase().startsWith(langPrefix));
  const voiceText = (voice) => `${voice.name || ''} ${voice.lang || ''}`;

  return matching.find(voice => voice.lang === speechLang)
    || matching.find(voice => VOICE_MATCHERS[safeLanguage]?.test(voiceText(voice)))
    || matching[0]
    || voices.find(voice => VOICE_MATCHERS[safeLanguage]?.test(voiceText(voice)))
    || null;
};

export const speak = async (text, language = 'english', handlers = {}) => {
  if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return null;

  const speechText = cleanTextForSpeech(text);
  if (!speechText) return null;

  window.speechSynthesis.cancel();

  const safeLanguage = normalizeLanguage(language);
  const utterance = new SpeechSynthesisUtterance(speechText);
  const voices = await loadVoices();
  const voice = chooseVoice(voices, safeLanguage);

  utterance.lang = voice?.lang || getSpeechLang(safeLanguage);
  utterance.voice = voice;
  utterance.rate = safeLanguage === 'english' ? 0.9 : 0.85;
  utterance.pitch = 1;

  utterance.onstart = handlers.onStart || null;
  utterance.onend = handlers.onEnd || null;
  utterance.onerror = handlers.onError || handlers.onEnd || null;

  window.speechSynthesis.speak(utterance);
  return utterance;
};

export const stopSpeaking = () => {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
};
