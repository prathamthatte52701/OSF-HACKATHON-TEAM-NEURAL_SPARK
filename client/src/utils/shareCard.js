import html2canvas from 'html2canvas';

export const shareToWhatsApp = async (elementId, message) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) return;
    await html2canvas(element);
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  } catch (err) {
    console.error('Share failed:', err);
  }
};

export const generateShareMessage = (achievement, points, streak) => {
  return `🚀 Maine aaj ZenithLearn par sikha!\n🏆 Achievement: ${achievement}\n⭐ Points: ${points}\n🔥 Streak: ${streak} days\n\n#ZenithLearn #Coding`;
};
