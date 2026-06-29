// Framer Motion variants

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
}

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
}

export const slideIn = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3 },
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2 },
}

export const cardHover = {
  whileHover: { scale: 1.02, transition: { duration: 0.15 } },
  whileTap: { scale: 0.98 },
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.07,
    },
  },
}

export const staggerItem = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
}

export const correctAnswerAnim = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: { duration: 0.4 },
  },
}

export const wrongAnswerAnim = {
  initial: { x: 0 },
  animate: {
    x: [-6, 6, -4, 4, 0],
    transition: { duration: 0.4 },
  },
}

export const pulseGlow = {
  animate: {
    boxShadow: [
      '0 0 0px rgba(124, 58, 237, 0)',
      '0 0 20px rgba(124, 58, 237, 0.6)',
      '0 0 0px rgba(124, 58, 237, 0)',
    ],
    transition: { duration: 2, repeat: Infinity },
  },
}

export const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.25 },
}
