import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowDown, ChevronRight } from 'lucide-react';
import { useWebsiteData } from '../context/WebsiteDataContext';
import { getAssetUrl } from '../utils/assets';
import { sectionVariants, itemFadeUp, EDITORIAL_EASE } from '../utils/motion';

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { data } = useWebsiteData();
  const { intro } = data;

  // Scroll parallax / scale on the framed comic visual
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', href);
    }
  };

  const focalX = intro.heroArtwork.focalX ?? 50;
  const focalY = intro.heroArtwork.focalY ?? 50;

  return (
    <section
      id="intro"
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col justify-center pt-24 pb-16 overflow-hidden"
    >
      <div className="max-w-content mx-auto px-6 sm:px-8 w-full my-auto">
        <motion.div
          variants={shouldReduceMotion ? undefined : sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.25 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          {/* Left / Editorial Text Block (5 cols) */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col justify-center">
            {/* Eyebrow */}
            <motion.div
              variants={shouldReduceMotion ? undefined : itemFadeUp}
              className="flex items-center gap-2.5 text-xs uppercase tracking-eyebrow font-medium text-accent mb-4"
            >
              <span className="w-6 h-[1px] bg-accent" />
              <span>{intro.eyebrow}</span>
            </motion.div>

            {/* Headline in Cormorant Serif */}
            <motion.h1
              variants={shouldReduceMotion ? undefined : itemFadeUp}
              className="font-serif text-4xl sm:text-5xl lg:text-[3.25rem] font-light leading-[1.15] text-ink tracking-tight mb-6"
            >
              {intro.headline}
            </motion.h1>

            {/* Short Introduction Paragraph */}
            <motion.p
              variants={shouldReduceMotion ? undefined : itemFadeUp}
              className="text-base sm:text-lg text-ink-secondary leading-relaxed font-normal mb-8 max-w-lg"
            >
              {intro.bioSummary}
            </motion.p>

            {/* Two Action Buttons */}
            <motion.div
              variants={shouldReduceMotion ? undefined : itemFadeUp}
              className="flex flex-wrap items-center gap-4"
            >
              {/* Primary: View Works */}
              <a
                href={intro.ctaPrimary.href}
                onClick={(e) => handleScrollTo(e, intro.ctaPrimary.href)}
                className="group inline-flex items-center gap-2 px-6 py-3 rounded bg-ink text-bg text-xs uppercase tracking-widest font-medium hover:bg-accent transition-colors duration-300 shadow-sm"
              >
                <span>{intro.ctaPrimary.label}</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>

              {/* Secondary: Commission Me */}
              <a
                href={intro.ctaSecondary.href}
                onClick={(e) => handleScrollTo(e, intro.ctaSecondary.href)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded border border-border bg-transparent text-ink text-xs uppercase tracking-widest font-medium hover:bg-surface hover:border-accent/50 transition-all duration-300"
              >
                <span>{intro.ctaSecondary.label}</span>
              </a>
            </motion.div>
          </div>

          {/* Right / Large Dark Framed Comic Panel (#1E1D1C) (7 cols) */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <motion.div
              variants={shouldReduceMotion ? undefined : itemFadeUp}
              className="relative rounded-md overflow-hidden bg-charcoal p-3 sm:p-4 shadow-[0_16px_40px_rgba(30,29,28,0.14)] border border-border/40"
            >
              {/* Comic Panel Frame with Inner Border */}
              <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden rounded bg-charcoal-panel">
                <motion.img
                  src={getAssetUrl(intro.heroArtwork.src)}
                  alt={intro.heroArtwork.alt}
                  className="w-full h-full object-cover select-none"
                  style={
                    shouldReduceMotion
                      ? { objectPosition: `${focalX}% ${focalY}%` }
                      : { scale: imageScale, y: imageY, objectPosition: `${focalX}% ${focalY}%` }
                  }
                  loading="eager"
                />

                {/* Subtle vignette gradient along frame edges */}
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/40 shadow-inner" />

                {/* Minimal Comic Label Badge in Bottom Left */}
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 px-3 py-1.5 rounded bg-charcoal/85 backdrop-blur-sm border border-border/20 text-bg text-[11px] tracking-wider uppercase flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span className="font-serif italic tracking-wide text-xs">
                    {intro.heroArtwork.title}
                  </span>
                  <span className="text-accent/80 font-mono text-[10px]">
                    [{intro.heroArtwork.year}]
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Small Animated Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="w-full flex justify-center pt-8 pb-2"
      >
        <a
          href="#profile"
          onClick={(e) => handleScrollTo(e, '#profile')}
          className="group flex flex-col items-center gap-2 text-ink-secondary hover:text-ink transition-colors"
          aria-label="Scroll down to Profile section"
        >
          <span className="text-[10px] uppercase tracking-widest font-mono">Scroll</span>
          <motion.div
            animate={shouldReduceMotion ? undefined : { y: [0, 5, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: EDITORIAL_EASE,
            }}
          >
            <ArrowDown className="w-3.5 h-3.5 text-accent group-hover:text-ink transition-colors" />
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
};
