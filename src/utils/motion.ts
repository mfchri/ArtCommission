import { Variants, Transition } from 'framer-motion';

// Calm, editorial cubic-bezier easing as specified
export const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const defaultTransition: Transition = {
  duration: 0.8,
  ease: EDITORIAL_EASE,
};

// Section-level fade and slide up (24px)
export const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: EDITORIAL_EASE,
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

// Container for staggering cards, tags, items
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
};

// Individual child item animation
export const itemFadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: EDITORIAL_EASE,
    },
  },
};

// Simple soft fade
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: EDITORIAL_EASE,
    },
  },
};

// Lightbox modal variants
export const lightboxBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
};

export const lightboxContentVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 12,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: EDITORIAL_EASE,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 8,
    transition: {
      duration: 0.25,
      ease: 'easeIn',
    },
  },
};

// Mobile drawer variants
export const mobileMenuVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: EDITORIAL_EASE,
      staggerChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};
