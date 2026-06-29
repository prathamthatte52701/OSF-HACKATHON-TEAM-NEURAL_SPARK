const calculatePoints = ({ correct, timeTaken, currentLevel, userStreak, speedMode }) => {
  if (!correct) return 0;
  const basePoints = 10;
  const speedBonus = timeTaken < 30 ? 5 : 0;
  const levelBonus = currentLevel * 5;
  const streakBonus = userStreak * 2;
  const speedModeMultiplier = speedMode ? 2 : 1;
  return (basePoints + speedBonus + levelBonus + streakBonus) * speedModeMultiplier;
};

module.exports = { calculatePoints };
