import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Check, ChevronDown, Clock, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { useWebsiteData } from '../context/WebsiteDataContext';
import { getAssetUrl } from '../utils/assets';
import { CommissionTier, TosItem, FaqItem } from '../types/commissions';
import { sectionVariants, itemFadeUp, staggerContainer } from '../utils/motion';

export const CommissionsSection: React.FC = () => {
  const { data } = useWebsiteData();
  const {
    commissionsConfig,
    commissionTiers,
    commissionAddons,
    commissionSteps,
    commissionTos,
    commissionFaqs,
  } = data;

  const tiersToRender = useMemo(() => {
    const list = Array.isArray(commissionTiers) && commissionTiers.length > 0
      ? commissionTiers
      : (Array.isArray((commissionsConfig as any)?.tiers) ? (commissionsConfig as any).tiers : []);
    return [...list].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [commissionTiers, commissionsConfig]);

  const [openTosId, setOpenTosId] = useState<string | null>(commissionTos[0]?.id || null);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleScrollToContact = (e: React.MouseEvent<HTMLAnchorElement>, tierId?: string) => {
    e.preventDefault();
    if (!commissionsConfig.isOpen) return;

    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', '#contact');

      // Auto-select commission tier in contact form if passed
      if (tierId) {
        const select = document.getElementById('commission-type-select') as HTMLSelectElement | null;
        if (select) {
          select.value = tierId;
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    }
  };

  const toggleTos = (id: string) => {
    setOpenTosId(openTosId === id ? null : id);
  };

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <section id="commissions" className="py-20 md:py-28 border-t border-border">
      <div className="max-w-content mx-auto px-6 sm:px-8">
        <motion.div
          variants={shouldReduceMotion ? undefined : sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
        >
          {/* Section Header */}
          <SectionHeader
            eyebrow={commissionsConfig.sectionNumber}
            title={commissionsConfig.title}
            description={commissionsConfig.description}
          />

          {/* Availability Status Banner */}
          <motion.div
            variants={shouldReduceMotion ? undefined : itemFadeUp}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded border border-border bg-surface mb-14"
          >
            <div className="flex items-center gap-3">
              {/* Status Dot */}
              <div className="relative flex items-center justify-center">
                <span
                  className={`w-3 h-3 rounded-full ${
                    commissionsConfig.isOpen ? 'bg-[#5C7864]' : 'bg-accent'
                  }`}
                />
                {commissionsConfig.isOpen && (
                  <span className="absolute w-5 h-5 rounded-full bg-[#5C7864]/20 animate-ping" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-widest font-semibold text-ink">
                    Status: {commissionsConfig.isOpen ? 'Open for Commissions' : 'Commissions Currently Closed'}
                  </span>
                  <span className="text-ink-secondary text-xs">•</span>
                  <span className="text-xs text-ink-secondary font-mono">
                    {commissionsConfig.slotsAvailable} / {commissionsConfig.slotsTotal} slots available
                  </span>
                </div>
                <p className="text-xs text-ink-secondary mt-0.5">
                  {commissionsConfig.nextOpeningEstimate}
                </p>
              </div>
            </div>

            {/* Quick Action Button */}
            <a
              href="#contact"
              onClick={(e) => handleScrollToContact(e)}
              className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded text-xs uppercase tracking-widest font-medium transition-all ${
                commissionsConfig.isOpen
                  ? 'bg-ink text-bg hover:bg-accent'
                  : 'bg-surface-muted text-ink-muted border border-border cursor-not-allowed pointer-events-none'
              }`}
              aria-disabled={!commissionsConfig.isOpen}
            >
              <span>{commissionsConfig.isOpen ? 'Request a Commission' : 'Slots Filled'}</span>
              {commissionsConfig.isOpen && <ArrowRight className="w-3.5 h-3.5" />}
            </a>
          </motion.div>

          {/* Pricing Cards */}
          <div className="mb-20">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs uppercase tracking-widest font-medium text-accent">
                01 // Commission Tiers
              </span>
            </div>

            <motion.div
              variants={shouldReduceMotion ? undefined : staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch"
            >
              {tiersToRender.map((tier: CommissionTier) => (
                <div
                  key={tier.id}
                  className={`relative flex flex-col justify-between rounded-md border p-6 sm:p-7 transition-all duration-300 ${
                    tier.isPopular
                      ? 'border-ink bg-surface shadow-md'
                      : 'border-border bg-surface/50 hover:bg-surface hover:border-accent/60'
                  }`}
                >
                  {/* Popular badge */}
                  {tier.badge && (
                    <div className="absolute -top-3 left-6 px-3 py-0.5 rounded bg-ink text-bg text-[10px] tracking-widest uppercase font-mono">
                      {tier.badge}
                    </div>
                  )}

                  <div>
                    {/* Example Image Placeholder Thumbnail */}
                    <div className="aspect-[4/3] w-full rounded overflow-hidden bg-charcoal mb-5 border border-border/30">
                      <img
                        src={getAssetUrl(tier.image)}
                        alt={`${tier.name} sample preview`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Tier Name & Price */}
                    <div className="flex items-baseline justify-between mb-2">
                      <h4 className="font-serif text-xl sm:text-2xl font-light text-ink">
                        {tier.name}
                      </h4>
                    </div>

                    <div className="font-serif text-2xl font-light text-ink mb-3">
                      {tier.price}
                    </div>

                    <p className="text-xs text-ink-secondary leading-relaxed mb-6">
                      {tier.description}
                    </p>

                    {/* Turnaround Time */}
                    <div className="flex items-center gap-2 text-xs font-mono text-ink-secondary pb-4 mb-4 border-b border-border">
                      <Clock className="w-3.5 h-3.5 text-accent" />
                      <span>Est. {tier.turnaround}</span>
                    </div>

                    {/* Feature bullet list */}
                    <ul className="space-y-2.5 text-xs text-ink mb-8">
                      {(Array.isArray(tier.features) ? tier.features : []).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Select CTA Button */}
                  <a
                    href="#contact"
                    onClick={(e) => handleScrollToContact(e, tier.id)}
                    className={`w-full py-2.5 rounded text-xs uppercase tracking-widest font-medium text-center transition-all ${
                      commissionsConfig.isOpen
                        ? tier.isPopular
                          ? 'bg-ink text-bg hover:bg-accent'
                          : 'border border-ink text-ink hover:bg-ink hover:text-bg'
                        : 'border border-border text-ink-muted cursor-not-allowed pointer-events-none'
                    }`}
                  >
                    Select {tier.name}
                  </a>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Add-ons List */}
          {commissionAddons.length > 0 && (
            <div className="mb-20">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-xs uppercase tracking-widest font-medium text-accent">
                  02 // Custom Add-Ons
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {commissionAddons.map((addon) => (
                  <div
                    key={addon.id}
                    className="p-4 rounded border border-border bg-surface/30 flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <span className="text-xs font-medium text-ink">{addon.name}</span>
                      <span className="text-xs font-mono font-semibold text-accent shrink-0">
                        {addon.price}
                      </span>
                    </div>
                    {addon.note && (
                      <span className="text-[11px] text-ink-secondary">{addon.note}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* How It Works (Steps) */}
          {commissionSteps.length > 0 && (
            <div className="mb-20">
              <div className="flex items-center gap-2 mb-8">
                <span className="text-xs uppercase tracking-widest font-medium text-accent">
                  03 // How It Works & Workflow
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {commissionSteps.map((step) => (
                  <div
                    key={step.id}
                    className="relative p-6 rounded border border-border bg-surface/40 flex flex-col justify-between"
                  >
                    <div>
                      <span className="font-serif text-2xl font-light text-accent block mb-2">
                        {step.step}
                      </span>
                      <h4 className="font-serif text-lg font-light text-ink mb-2">
                        {step.title}
                      </h4>
                      <p className="text-xs text-ink-secondary leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Terms of Service Accordion */}
          {commissionTos.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center gap-2 mb-6">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <span className="text-xs uppercase tracking-widest font-medium text-accent">
                  04 // Terms of Service & Guidelines
                </span>
              </div>

              <div className="space-y-3">
                {commissionTos.map((item: TosItem) => {
                  const isOpen = openTosId === item.id;
                  return (
                    <div
                      key={item.id}
                      className="rounded border border-border bg-surface/40 overflow-hidden transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => toggleTos(item.id)}
                        className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-serif text-base sm:text-lg font-light text-ink hover:text-accent transition-colors"
                        aria-expanded={isOpen}
                      >
                        <span>{item.title}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-accent transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs text-ink-secondary leading-relaxed border-t border-border/50 pt-3 space-y-2">
                              {item.content.map((paragraph, pIdx) => (
                                <p key={pIdx}>{paragraph}</p>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* FAQs Accordion */}
          {commissionFaqs && commissionFaqs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <HelpCircle className="w-4 h-4 text-accent" />
                <span className="text-xs uppercase tracking-widest font-medium text-accent">
                  05 // Frequently Asked Questions
                </span>
              </div>

              <div className="space-y-3">
                {commissionFaqs.map((faq: FaqItem) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="rounded border border-border bg-surface/40 overflow-hidden transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-serif text-base sm:text-lg font-light text-ink hover:text-accent transition-colors"
                        aria-expanded={isOpen}
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-accent transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs text-ink-secondary leading-relaxed border-t border-border/50 pt-3">
                              <p>{faq.answer}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
