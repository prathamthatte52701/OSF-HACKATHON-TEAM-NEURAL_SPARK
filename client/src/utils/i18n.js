export const LANGUAGES = {
  english:   { id: 'english',   htmlLang: 'en', shortLabel: 'EN',   label: 'English',    nativeLabel: 'English' },
  hindi:     { id: 'hindi',     htmlLang: 'hi', shortLabel: 'हिं',   label: 'Hindi',      nativeLabel: 'हिन्दी' },
  tamil:     { id: 'tamil',     htmlLang: 'ta', shortLabel: 'த',    label: 'Tamil',      nativeLabel: 'தமிழ்' },
  malayalam: { id: 'malayalam', htmlLang: 'ml', shortLabel: 'മ',    label: 'Malayalam',  nativeLabel: 'മലയാളം' },
}

const VALID_LANGUAGES = new Set(['english', 'hindi', 'tamil', 'malayalam'])
const LANGUAGE_CLASSES = {
  english: 'lang-en',
  hindi: 'lang-hi',
  tamil: 'lang-ta',
  malayalam: 'lang-ml',
}

const STORAGE_KEY     = 'preferredLanguage'
const LANGUAGE_EVENT  = 'stemlearn:language-change'

export const normalizeLanguage = (language) =>
  VALID_LANGUAGES.has(language) ? language : 'english'

export const isEnglish    = (lang) => normalizeLanguage(lang) === 'english'
export const isHindiLang  = (lang) => normalizeLanguage(lang) === 'hindi'
export const isTamilLang  = (lang) => normalizeLanguage(lang) === 'tamil'
export const isMalayalam  = (lang) => normalizeLanguage(lang) === 'malayalam'
export const isNonEnglish = (lang) => normalizeLanguage(lang) !== 'english'

export const getStoredLanguage = () => {
  if (typeof window === 'undefined') return 'english'
  return normalizeLanguage(localStorage.getItem(STORAGE_KEY))
}

export const setStoredLanguage = (language, { emit = true } = {}) => {
  const nextLanguage = normalizeLanguage(language)
  if (typeof window === 'undefined') return nextLanguage

  localStorage.setItem(STORAGE_KEY, nextLanguage)
  document.documentElement.lang = LANGUAGES[nextLanguage].htmlLang
  document.documentElement.classList.remove(...Object.values(LANGUAGE_CLASSES))
  document.documentElement.classList.add(LANGUAGE_CLASSES[nextLanguage])

  if (emit) {
    window.dispatchEvent(
      new CustomEvent(LANGUAGE_EVENT, { detail: { language: nextLanguage } })
    )
  }

  return nextLanguage
}

export const onLanguageChange = (handler) => {
  if (typeof window === 'undefined') return () => {}
  const listener = (event) => handler(normalizeLanguage(event.detail?.language))
  window.addEventListener(LANGUAGE_EVENT, listener)
  return () => window.removeEventListener(LANGUAGE_EVENT, listener)
}

// ─── Translation Dictionary ───────────────────────────────────────────────────
const DICTIONARY = {
  english: {
    // Guest / Auth
    continueAsGuest:   'Continue as Guest',
    guestBanner:       'Guest progress is saved on this device. Create an account to sync to the cloud.',
    migrateGuest:      'Save my guest progress to my account',
    migrating:         'Saving...',
    migrated:          'Guest progress saved to your account.',
    leaderboardLocked: 'Leaderboards are available after login.',
    profileLocked:     'Create an account to save stats, badges, and leaderboard progress.',
    signInToSave:      'Sign in to save your progress',
    guestLimitTitle:   'Guest practice limit reached',
    guestLimitBody:    'Create an account to continue this topic and save your progress permanently.',
    // Navigation
    home:        'Home',
    topics:      'Topics',
    practice:    'Practice',
    leaderboard: 'Leaderboard',
    profile:     'Profile',
    logout:      'Logout',
    back:        'Back',
    backHome:    'Back to Home',
    // Dashboard
    welcomeBack:     'Welcome back',
    dailyChallenge:  'Daily Challenge',
    streak:          'day streak',
    points:          'Points',
    topicsCompleted: 'Topics',
    // Topic / Theory
    loadingTheory:   'Generating personalized theory...',
    refreshTheory:   'Refresh Theory',
    startLevel:      'Start Level',
    topicComplete:   'Topic Completed! Great work.',
    // Questions
    submitAnswer:    'Submit',
    nextQuestion:    'Next Question',
    correctAnswer:   'Correct answer:',
    typeAnswer:      'Type your answer here...',
    // Boss Battle
    enterArena:      'Enter the Arena',
    bossDefeated:    'Boss Defeated!',
    battleFailed:    'Battle Failed',
    tryAgain:        'Try Again',
    // AI Challenge
    startChallenge:  'Start Challenge',
    typeHere:        'Type your answer here...',
    pressEnter:      'Press Enter to submit • Shift+Enter for newline',
    // Profile
    changeHobby:     'Change Hobby:',
    changeLanguage:  'Change Language:',
    save:            'Save',
    cancel:          'Cancel',
    // Daily Challenge
    solveNow:        'Solve Now ⚡',
    nextChallenge:   'Next challenge in:',
    slotSolved:      'This slot challenge is solved!',
    // Errors
    loading:         'Loading...',
    errorOccurred:   'Something went wrong. Please try again.',
    noInternet:      'You appear to be offline.',
  },

  hindi: {
    // Guest / Auth
    continueAsGuest:   'Guest ke roop mein continue karo',
    guestBanner:       'Guest progress is device par save hota hai. Account banaoge to cloud mein sync hoga.',
    migrateGuest:      'Guest progress account mein save karo',
    migrating:         'Save ho raha hai...',
    migrated:          'Guest progress account mein save ho gaya.',
    leaderboardLocked: 'Leaderboard login ke baad milega.',
    profileLocked:     'Stats, badges aur leaderboard ke liye account banao.',
    signInToSave:      'Progress save karne ke liye sign in karo',
    guestLimitTitle:   'Guest practice limit poori ho gayi',
    guestLimitBody:    'Is topic ko continue karne aur progress permanently save karne ke liye account banao.',
    // Navigation
    home:        'Home',
    topics:      'Topics',
    practice:    'Practice',
    leaderboard: 'Leaderboard',
    profile:     'Profile',
    logout:      'Logout',
    back:        'Vapas',
    backHome:    'Home par vapas jao',
    // Dashboard
    welcomeBack:     'Vapas aaye!',
    dailyChallenge:  'Aaj ka Challenge',
    streak:          'din ki streak',
    points:          'Points',
    topicsCompleted: 'Topics',
    // Topic / Theory
    loadingTheory:   'Theory generate ho rahi hai...',
    refreshTheory:   'Theory Refresh Karo',
    startLevel:      'Level Shuru Karo',
    topicComplete:   'Topic complete! Bahut badhiya.',
    // Questions
    submitAnswer:    'Submit Karo',
    nextQuestion:    'Agla Sawaal',
    correctAnswer:   'Sahi jawab:',
    typeAnswer:      'Yahan apna jawab likhо...',
    // Boss Battle
    enterArena:      'Arena Mein Daakhil Ho',
    bossDefeated:    'Boss Defeat Ho Gaya!',
    battleFailed:    'Haaro Mat!',
    tryAgain:        'Phir Koshish Karo',
    // AI Challenge
    startChallenge:  'Challenge Shuru Karo 🚀',
    typeHere:        'Apna jawab yahan likho...',
    pressEnter:      'Enter dabao submit karne ke liye • Shift+Enter for newline',
    // Profile
    changeHobby:     'Hobby Change Karo:',
    changeLanguage:  'Language Change Karo:',
    save:            'Save Karo',
    cancel:          'Cancel',
    // Daily Challenge
    solveNow:        'Solve Karo ⚡',
    nextChallenge:   'Agla challenge:',
    slotSolved:      'Is slot ka challenge solve ho gaya!',
    // Errors
    loading:         'Load ho raha hai...',
    errorOccurred:   'Kuch gadbad ho gaya. Dobara try karo.',
    noInternet:      'Internet nahi lag raha.',
  },

  tamil: {
    // Guest / Auth
    continueAsGuest:   'விருந்தினராக தொடரவும்',
    guestBanner:       'விருந்தினர் முன்னேற்றம் இந்த சாதனத்தில் சேமிக்கப்படுகிறது. கணக்கை உருவாக்கி cloud-ல் சேமிக்கவும்.',
    migrateGuest:      'விருந்தினர் முன்னேற்றத்தை என் கணக்கில் சேமி',
    migrating:         'சேமிக்கிறேன்...',
    migrated:          'விருந்தினர் முன்னேற்றம் கணக்கில் சேமிக்கப்பட்டது.',
    leaderboardLocked: 'Leaderboard உள்நுழைந்த பிறகு கிடைக்கும்.',
    profileLocked:     'Stats, badges மற்றும் leaderboard-க்கு கணக்கை உருவாக்கவும்.',
    signInToSave:      'முன்னேற்றத்தை சேமிக்க உள்நுழையவும்',
    guestLimitTitle:   'விருந்தினர் பயிற்சி வரம்பு முடிந்தது',
    guestLimitBody:    'இந்த தலைப்பை தொடர கணக்கை உருவாக்கவும்.',
    // Navigation
    home:        'முகப்பு',
    topics:      'தலைப்புகள்',
    practice:    'பயிற்சி',
    leaderboard: 'Leaderboard',
    profile:     'சுயவிவரம்',
    logout:      'வெளியேறு',
    back:        'திரும்பு',
    backHome:    'முகப்புக்கு திரும்பு',
    // Dashboard
    welcomeBack:     'மீண்டும் வரவேற்கிறோம்!',
    dailyChallenge:  'தினசரி சவால்',
    streak:          'நாள் தொடர்ச்சி',
    points:          'புள்ளிகள்',
    topicsCompleted: 'தலைப்புகள்',
    // Topic / Theory
    loadingTheory:   'தனிப்பட்ட theory உருவாக்கப்படுகிறது...',
    refreshTheory:   'Theory புதுப்பி',
    startLevel:      'நிலை தொடங்கு',
    topicComplete:   'தலைப்பு முடிந்தது! சிறப்பாக செய்தீர்கள்.',
    // Questions
    submitAnswer:    'சமர்பி',
    nextQuestion:    'அடுத்த கேள்வி',
    correctAnswer:   'சரியான விடை:',
    typeAnswer:      'உங்கள் பதிலை இங்கே தட்டச்சு செய்யவும்...',
    // Boss Battle
    enterArena:      'Arena-வுக்கு நுழைக',
    bossDefeated:    'Boss தோற்கடிக்கப்பட்டது!',
    battleFailed:    'போர் தோல்வி',
    tryAgain:        'மீண்டும் முயற்சி',
    // AI Challenge
    startChallenge:  'சவாலை தொடங்கு 🚀',
    typeHere:        'உங்கள் பதிலை இங்கே தட்டச்சு செய்யவும்...',
    pressEnter:      'சமர்பிக்க Enter அழுத்தவும் • புதிய வரிக்கு Shift+Enter',
    // Profile
    changeHobby:     'விருப்பத்தை மாற்றவும்:',
    changeLanguage:  'மொழியை மாற்றவும்:',
    save:            'சேமி',
    cancel:          'ரத்துசெய்',
    // Daily Challenge
    solveNow:        'இப்போது தீர்க்கவும் ⚡',
    nextChallenge:   'அடுத்த சவால்:',
    slotSolved:      'இந்த slot சவால் தீர்க்கப்பட்டது!',
    // Errors
    loading:         'ஏற்றுகிறது...',
    errorOccurred:   'ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும்.',
    noInternet:      'இணையம் இல்லை.',
  },

  malayalam: {
    // Guest / Auth
    continueAsGuest:   'അതിഥിയായി തുടരുക',
    guestBanner:       'അതിഥി പുരോഗതി ഈ ഉപകരണത്തിൽ സംരക്ഷിച്ചിരിക്കുന്നു. Cloud-ൽ sync ചെയ്യാൻ ഒരു account ഉണ്ടാക്കൂ.',
    migrateGuest:      'അതിഥി പുരോഗതി എന്റെ account-ൽ സേവ് ചെയ്യൂ',
    migrating:         'സേവ് ചെയ്യുന്നു...',
    migrated:          'അതിഥി പുരോഗതി account-ൽ സേവ് ചെയ്തു.',
    leaderboardLocked: 'Leaderboard login ചെയ്ത ശേഷം ലഭിക്കും.',
    profileLocked:     'Stats, badges, leaderboard-നായി ഒരു account ഉണ്ടാക്കൂ.',
    signInToSave:      'പുരോഗതി സേവ് ചെയ്യാൻ sign in ചെയ്യൂ',
    guestLimitTitle:   'അതിഥി practice പരിധി തീർന്നു',
    guestLimitBody:    'ഈ topic തുടരാൻ account ഉണ്ടാക്കൂ.',
    // Navigation
    home:        'ഹോം',
    topics:      'വിഷയങ്ങൾ',
    practice:    'പരിശീലനം',
    leaderboard: 'Leaderboard',
    profile:     'പ്രൊഫൈൽ',
    logout:      'പുറത്ത് കടക്കൂ',
    back:        'തിരിച്ച്',
    backHome:    'ഹോമിലേക്ക് തിരിച്ച്',
    // Dashboard
    welcomeBack:     'തിരിച്ചെത്തിയതിന് സ്വാഗതം!',
    dailyChallenge:  'ദൈനംദിന വെല്ലുവിളി',
    streak:          'ദിവസ streak',
    points:          'പോയിന്റുകൾ',
    topicsCompleted: 'വിഷയങ്ങൾ',
    // Topic / Theory
    loadingTheory:   'വ്യക്തിഗത theory ഉണ്ടാക്കുന്നു...',
    refreshTheory:   'Theory പുതുക്കൂ',
    startLevel:      'Level ആരംഭിക്കൂ',
    topicComplete:   'Topic പൂർത്തിയായി! ഗംഭീരം.',
    // Questions
    submitAnswer:    'സമർപ്പിക്കൂ',
    nextQuestion:    'അടുത്ത ചോദ്യം',
    correctAnswer:   'ശരിയായ ഉത്തരം:',
    typeAnswer:      'ഇവിടെ നിങ്ങളുടെ ഉത്തരം ടൈപ്പ് ചെയ്യൂ...',
    // Boss Battle
    enterArena:      'Arena-ൽ പ്രവേശിക്കൂ',
    bossDefeated:    'Boss പരാജയപ്പെട്ടു!',
    battleFailed:    'യുദ്ധം പരാജയം',
    tryAgain:        'വീണ്ടും ശ്രമിക്കൂ',
    // AI Challenge
    startChallenge:  'Challenge ആരംഭിക്കൂ 🚀',
    typeHere:        'ഇവിടെ ഉത്തരം ടൈപ്പ് ചെയ്യൂ...',
    pressEnter:      'സമർപ്പിക്കാൻ Enter അമർത്തൂ • പുതിയ വരിക്ക് Shift+Enter',
    // Profile
    changeHobby:     'Hobby മാറ്റൂ:',
    changeLanguage:  'ഭാഷ മാറ്റൂ:',
    save:            'സേവ് ചെയ്യൂ',
    cancel:          'റദ്ദാക്കൂ',
    // Daily Challenge
    solveNow:        'ഇപ്പോൾ പരിഹരിക്കൂ ⚡',
    nextChallenge:   'അടുത്ത challenge:',
    slotSolved:      'ഈ slot challenge പരിഹരിച്ചു!',
    // Errors
    loading:         'ലോഡ് ചെയ്യുന്നു...',
    errorOccurred:   'എന്തോ തെറ്റ് സംഭവിച്ചു. വീണ്ടും ശ്രമിക്കൂ.',
    noInternet:      'ഇന്റർനെറ്റ് ഇല്ല.',
  },
}

export const t = (language, key, fallback = key) =>
  DICTIONARY[normalizeLanguage(language)]?.[key]
  ?? DICTIONARY.english[key]
  ?? fallback

// Font class helper — Indic scripts need larger line-height + specific fonts
export const getLangClass = (language) => {
  const lang = normalizeLanguage(language)
  if (lang === 'hindi')     return 'lang-hi'
  if (lang === 'tamil')     return 'lang-ta'
  if (lang === 'malayalam') return 'lang-ml'
  return 'lang-en'
}

// Language direction (all current languages are LTR)
export const isRTL = () => false
