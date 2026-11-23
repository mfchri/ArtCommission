import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { SectionHeader } from '../components/SectionHeader';
import { useWebsiteData } from '../context/WebsiteDataContext';
import { getAssetUrl } from '../utils/assets';
import { sectionVariants, itemFadeUp, staggerContainer } from '../utils/motion';
import { useCountUp } from '../hooks/useCountUp';

interface StatCounterProps {
  value: number;
  suffix?: string;
  label: string;
  inView: boolean;
}

const StatCounter: React.FC<StatCounterProps> = ({ value, suffix = '', label, inView }) => {
  const animatedNumber = useCountUp(value, 1800, inView);

  return (
    <div className="flex flex-col p-4 sm:p-5 rounded border border-border bg-surface/50 transition-all hover:bg-surface hover:border-accent/40">
      <div className="font-serif text-3xl sm:text-4xl text-ink font-light tracking-tight mb-1">
        {animatedNumber}
        <span className="text-accent text-2xl font-serif ml-0.5">{suffix}</span>
      </div>
      <div className="text-xs uppercase tracking-wider text-ink-secondary font-medium">
        {label}
      </div>
    </div>
  );
};

export const ProfileSection: React.FC = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.3 });
  const shouldReduceMotion = useReducedMotion();
  const { data } = useWebsiteData();
  const { profile } = data;

  return (
    <section id="profile" className="py-20 md:py-28 border-t border-border">
      <div className="max-w-content mx-auto px-6 sm:px-8">
        <motion.div
          variants={shouldReduceMotion ? undefined : sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.25 }}
        >
          {/* Standard Section Header */}
          <SectionHeader
            eyebrow={profile.sectionNumber}
            title={profile.title}
            description="A glimpse into the mind, methods, and aesthetic philosophy behind the brush."
          />

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start mb-16">
            {/* Left Column: Portrait / Avatar (4 cols) */}
            <div className="lg:col-span-4">
              <motion.div
                variants={shouldReduceMotion ? undefined : itemFadeUp}
                className="relative rounded-md overflow-hidden bg-charcoal p-3 border border-border/40 shadow-sm"
              >
                <div className="aspect-[4/5] w-full overflow-hidden rounded bg-charcoal-panel">
                  <img
                    src={getAssetUrl(profile.avatar.src)}
                    alt={profile.avatar.alt}
                    className="w-full h-full object-cover object-center select-none"
                    loading="lazy"
                  />
                </div>
                <p className="mt-2 text-center text-[11px] font-mono tracking-widest text-accent uppercase">
                  {profile.avatar.caption}
                </p>
              </motion.div>

              {/* Facts List below avatar */}
              <motion.div
                variants={shouldReduceMotion ? undefined : itemFadeUp}
                className="mt-6 p-5 rounded border border-border bg-surface/30"
              >
                <h4 className="text-xs uppercase tracking-widest text-ink font-semibold mb-4 border-b border-border pb-2">
                  Fast Notes
                </h4>
                <dl className="space-y-3 text-xs">
                  {profile.facts.map((fact, idx) => (
                    <div key={idx} className="flex justify-between items-baseline gap-4">
                      <dt className="text-ink-secondary font-normal tracking-wide">{fact.label}</dt>
                      <dd className="text-ink font-medium text-right">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            </div>

            {/* Right Column: Bio & Tag details (8 cols) */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              {/* Name & Subtitle */}
              <motion.div variants={shouldReduceMotion ? undefined : itemFadeUp} className="mb-6">
                <h3 className="font-serif text-2xl sm:text-3xl font-light text-ink tracking-wide">
                  {profile.artistName}
                </h3>
                <p className="text-xs uppercase tracking-widest text-accent font-medium mt-1">
                  {profile.subtitle}
                </p>
              </motion.div>

              {/* Bio Paragraphs */}
              <motion.div
                variants={shouldReduceMotion ? undefined : itemFadeUp}
                className="space-y-4 text-ink-secondary text-sm sm:text-base leading-relaxed mb-8"
              >
                {profile.bioParagraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </motion.div>

              {/* Style & Themes Tags */}
              <motion.div variants={shouldReduceMotion ? undefined : itemFadeUp} className="mb-8">
                <h4 className="text-xs uppercase tracking-widest text-ink font-semibold mb-3">
                  Style &amp; Themes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.styleThemes.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded text-xs tracking-wider bg-surface border border-border text-ink hover:border-accent transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Tools Used */}
              <motion.div variants={shouldReduceMotion ? undefined : itemFadeUp}>
                <h4 className="text-xs uppercase tracking-widest text-ink font-semibold mb-3">
                  Mediums &amp; Tools
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.toolsUsed.map((tool) => (
                    <span
                      key={tool}
                      className="px-3 py-1.5 rounded text-xs font-mono tracking-wide bg-bg border border-border/80 text-ink-secondary"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Mini Stat Row with Count-Up Animation */}
          <div ref={statsRef}>
            <motion.div
              variants={shouldReduceMotion ? undefined : staggerContainer}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {profile.stats.map((stat, idx) => (
                <StatCounter
                  key={idx}
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  inView={isStatsInView}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
