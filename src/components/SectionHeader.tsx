import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { itemFadeUp } from '../utils/motion';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  description,
  centered = false,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`mb-12 md:mb-16 ${centered ? 'text-center max-w-2xl mx-auto' : 'max-w-3xl'} ${className}`}>
      {/* Eyebrow with wide letter-spacing */}
      <motion.div
        variants={shouldReduceMotion ? undefined : itemFadeUp}
        className="flex items-center gap-3 mb-3 text-xs uppercase tracking-eyebrow font-medium text-accent"
      >
        <span className="inline-block w-4 h-[1px] bg-accent" />
        <span>{eyebrow}</span>
      </motion.div>

      {/* Main Serif Title */}
      <motion.h2
        variants={shouldReduceMotion ? undefined : itemFadeUp}
        className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-wide text-ink mb-4 leading-tight"
      >
        {title}
      </motion.h2>

      {/* Optional Description */}
      {description && (
        <motion.p
          variants={shouldReduceMotion ? undefined : itemFadeUp}
          className="text-sm sm:text-base text-ink-secondary leading-relaxed font-normal"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};
