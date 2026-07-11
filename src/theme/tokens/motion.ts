export const motion = {
  duration: {
    instant: "50ms",
    fast: "150ms",
    normal: "250ms",
    slow: "350ms",
    slower: "500ms",
    slowest: "700ms",
  },

  easing: {
    ease: "cubic-bezier(0.25, 0.1, 0.25, 1)",
    easeIn: "cubic-bezier(0.42, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.58, 1)",
    easeInOut: "cubic-bezier(0.42, 0, 0.58, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    springSoft: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  },

  framer: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slideUp: {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 12 },
    },
    slideRight: {
      initial: { opacity: 0, x: -12 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -12 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
    },
  },
} as const;
