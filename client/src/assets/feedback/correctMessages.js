export const correctMessages = {
  english: [
    "Correct! 🎉 Great thinking!",
    "Nailed it! ⚡ Keep going!",
    "Perfect! 🔥 You're on fire!",
    "Excellent! 🚀 Next level coming!",
    "Brilliant! 💡 That's the spirit!",
    "Spot on! ✅ You've got this!",
    "Outstanding! 🌟 Keep it up!",
    "Fantastic! 🏆 You're crushing it!",
  ],
  hindi: [
    "Sahi jawab! 🎉 Bahut badhiya!",
    "Ekdum sahi! ⚡ Chalte raho!",
    "Perfect! 🔥 Aag laga di!",
    "Kamaal! 🚀 Level up hone wala hai!",
    "Zabardast! 💡 Yahi spirit chahiye!",
    "Bilkul sahi! ✅ Tu kar sakta hai!",
    "Shaandaar! 🌟 Aise hi karo!",
    "Mast! 🏆 Tu tod raha hai!",
  ],
}

export const getRandomCorrectFeedback = (language = 'english') => {
  const msgs = correctMessages[language] || correctMessages.english
  return msgs[Math.floor(Math.random() * msgs.length)]
}
