import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { SocialLinks } from '../components/SocialLinks';
import { useWebsiteData } from '../context/WebsiteDataContext';
import { submitContactMessage } from '../services/contentService';
import { sectionVariants, itemFadeUp } from '../utils/motion';

interface FormData {
  name: string;
  email: string;
  commissionType: string;
  referenceUrl: string;
  message: string;
  website_url_honeypot: string; // Spam trap
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export const ContactSection: React.FC = () => {
  const { data } = useWebsiteData();
  const { contactSettings, commissionTiers, socialLinks } = data;

  const commissionOptions = useMemo(() => {
    if (commissionTiers && commissionTiers.length > 0) {
      const tierOpts = commissionTiers.map((t) => ({
        value: t.id,
        label: `${t.name} (${t.price})`,
      }));
      const extraTypes = (contactSettings.commissionTypes || []).filter(
        (opt) => !commissionTiers.some((t) => t.id === opt.value)
      );
      if (extraTypes.length > 0) {
        return [...tierOpts, ...extraTypes];
      }
      return [
        ...tierOpts,
        { value: 'comic', label: 'Comic / Sequential Art Inquiry' },
        { value: 'other', label: 'Other / Commercial Inquiry' },
      ];
    }
    return contactSettings.commissionTypes || [];
  }, [commissionTiers, contactSettings.commissionTypes]);

  const defaultType = commissionOptions[0]?.value || 'sketch';

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    commissionType: defaultType,
    referenceUrl: '',
    message: '',
    website_url_honeypot: '',
  });

  useEffect(() => {
    if (commissionOptions.length > 0 && !commissionOptions.some((o) => o.value === formData.commissionType)) {
      setFormData((prev) => ({ ...prev, commissionType: commissionOptions[0].value }));
    }
  }, [commissionOptions]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const shouldReduceMotion = useReducedMotion();

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please provide your name or handle.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please provide an email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email format.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please include details about your character or inquiry.';
    } else if (formData.message.trim().length < 15) {
      newErrors.message = 'Please provide a bit more detail (at least 15 characters).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // 1. Submit to Database (with honeypot & rate limit)
      await submitContactMessage({
        name: formData.name,
        email: formData.email,
        commissionType: formData.commissionType,
        referenceUrl: formData.referenceUrl,
        message: formData.message,
        honeypot: formData.website_url_honeypot,
      });

      // 2. Check Formspree optional endpoint
      const formspreeEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;
      if (formspreeEndpoint && formspreeEndpoint.trim() !== '') {
        try {
          await fetch(formspreeEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify(formData),
          });
        } catch (fErr) {
          console.warn('Formspree endpoint failed, but database saved:', fErr);
        }
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.warn('Submission error, fallback to mailto:', err);
      fallbackToMailto();
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fallbackToMailto = () => {
    const subject = encodeURIComponent(
      `[Commission Inquiry] ${formData.commissionType.toUpperCase()} - ${formData.name}`
    );
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nTier/Type: ${formData.commissionType}\nReference Links: ${formData.referenceUrl || 'None'}\n\nProject Brief:\n${formData.message}`
    );
    window.location.href = `mailto:${contactSettings.email}?subject=${subject}&body=${body}`;
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      commissionType: defaultType,
      referenceUrl: '',
      message: '',
      website_url_honeypot: '',
    });
    setErrors({});
    setIsSubmitted(false);
  };

  const visibleSocials = socialLinks
    .filter((s) => s.isVisible)
    .map((s) => ({
      name: s.name,
      handle: s.handle,
      url: s.url,
      iconName: s.iconName,
    }));

  return (
    <section id="contact" className="py-20 md:py-28 border-t border-border">
      <div className="max-w-content mx-auto px-6 sm:px-8">
        <motion.div
          variants={shouldReduceMotion ? undefined : sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          {/* Section Header */}
          <SectionHeader
            eyebrow={contactSettings.sectionNumber}
            title={contactSettings.title}
            description={contactSettings.invitation}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Contact Info & Preferred Channels (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              <motion.div
                variants={shouldReduceMotion ? undefined : itemFadeUp}
                className="p-6 rounded border border-border bg-surface/40 space-y-4"
              >
                <h4 className="font-serif text-xl font-light text-ink">
                  Direct Inquiries
                </h4>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  {contactSettings.subtext}
                </p>

                <div className="pt-2">
                  <div className="text-[11px] uppercase tracking-wider text-accent mb-1 font-mono">
                    Direct Email
                  </div>
                  <a
                    href={`mailto:${contactSettings.email}`}
                    className="flex items-center gap-2 font-mono text-xs sm:text-sm text-ink hover:text-accent transition-colors"
                  >
                    <Mail className="w-4 h-4 text-accent" />
                    <span>{contactSettings.email}</span>
                  </a>
                </div>

                <div className="pt-2 border-t border-border/50 text-xs text-ink-secondary">
                  <span className="font-medium text-ink">Note: </span>
                  {contactSettings.availabilityNote}
                </div>
              </motion.div>

              {/* Social Channels */}
              <motion.div variants={shouldReduceMotion ? undefined : itemFadeUp}>
                <h4 className="text-xs uppercase tracking-widest text-ink font-semibold mb-3">
                  Online Portfolios &amp; Archives
                </h4>
                <SocialLinks links={visibleSocials} showHandles={true} />
              </motion.div>
            </div>

            {/* Right: Contact Form / Success State (7 cols) */}
            <div className="lg:col-span-7">
              <motion.div
                variants={shouldReduceMotion ? undefined : itemFadeUp}
                className="p-6 sm:p-8 rounded-md border border-border bg-surface/50 shadow-sm"
              >
                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="success-state"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-12 text-center flex flex-col items-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#5C7864]/10 text-[#5C7864] flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="font-serif text-2xl font-light text-ink mb-2">
                        Inquiry Received
                      </h4>
                      <p className="text-xs sm:text-sm text-ink-secondary max-w-md mb-6 leading-relaxed">
                        Thank you for reaching out, {formData.name}. Your inquiry has been stored securely in my atelier inbox. I typically respond within 24–48 hours with confirmation and availability.
                      </p>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="px-6 py-2.5 rounded border border-border bg-bg text-ink text-xs uppercase tracking-widest font-medium hover:bg-surface transition-colors"
                      >
                        Send Another Inquiry
                      </button>
                    </motion.div>
                  ) : (
                    <form key="inquiry-form" onSubmit={handleSubmit} noValidate className="space-y-5">
                      {submitError && (
                        <div className="p-3 rounded bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{submitError}</span>
                        </div>
                      )}

                      {/* Honeypot Spam Trap (Hidden) */}
                      <input
                        type="text"
                        name="website_url_honeypot"
                        tabIndex={-1}
                        autoComplete="off"
                        value={formData.website_url_honeypot}
                        onChange={(e) => setFormData({ ...formData, website_url_honeypot: e.target.value })}
                        className="hidden pointer-events-none"
                      />

                      {/* Name & Email Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="contact-name"
                            className="block text-xs uppercase tracking-wider font-medium text-ink mb-1.5"
                          >
                            Name / Handle <span className="text-accent">*</span>
                          </label>
                          <input
                            id="contact-name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded border bg-bg text-ink transition-colors focus:border-ink focus:outline-none ${
                              errors.name ? 'border-red-400' : 'border-border'
                            }`}
                            placeholder="e.g. Ren / @ren_arts"
                            aria-invalid={!!errors.name}
                            aria-describedby={errors.name ? 'name-error' : undefined}
                          />
                          {errors.name && (
                            <span id="name-error" className="block text-[11px] text-red-600 mt-1">
                              {errors.name}
                            </span>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="contact-email"
                            className="block text-xs uppercase tracking-wider font-medium text-ink mb-1.5"
                          >
                            Email Address <span className="text-accent">*</span>
                          </label>
                          <input
                            id="contact-email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded border bg-bg text-ink transition-colors focus:border-ink focus:outline-none ${
                              errors.email ? 'border-red-400' : 'border-border'
                            }`}
                            placeholder="you@domain.com"
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? 'email-error' : undefined}
                          />
                          {errors.email && (
                            <span id="email-error" className="block text-[11px] text-red-600 mt-1">
                              {errors.email}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Commission Type & Reference Link */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="commission-type-select"
                            className="block text-xs uppercase tracking-wider font-medium text-ink mb-1.5"
                          >
                            Commission Tier / Type
                          </label>
                          <select
                            id="commission-type-select"
                            value={formData.commissionType}
                            onChange={(e) => setFormData({ ...formData, commissionType: e.target.value })}
                            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded border border-border bg-bg text-ink focus:border-ink focus:outline-none transition-colors"
                          >
                            {commissionOptions.map((tier) => (
                              <option key={tier.value} value={tier.value}>
                                {tier.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="contact-ref"
                            className="block text-xs uppercase tracking-wider font-medium text-ink mb-1.5"
                          >
                            Visual Reference Link <span className="text-accent font-normal">(optional)</span>
                          </label>
                          <input
                            id="contact-ref"
                            type="url"
                            value={formData.referenceUrl}
                            onChange={(e) => setFormData({ ...formData, referenceUrl: e.target.value })}
                            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded border border-border bg-bg text-ink focus:border-ink focus:outline-none transition-colors"
                            placeholder="Imgur, Google Drive, Toyhouse URL"
                          />
                        </div>
                      </div>

                      {/* Message Field */}
                      <div>
                        <label
                          htmlFor="contact-message"
                          className="block text-xs uppercase tracking-wider font-medium text-ink mb-1.5"
                        >
                          Project Brief &amp; Character Details <span className="text-accent">*</span>
                        </label>
                        <textarea
                          id="contact-message"
                          required
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded border bg-bg text-ink focus:border-ink focus:outline-none transition-colors resize-y ${
                            errors.message ? 'border-red-400' : 'border-border'
                          }`}
                          placeholder="Describe your character's appearance, personality, desired posture, lighting mood, or any story notes..."
                          aria-invalid={!!errors.message}
                          aria-describedby={errors.message ? 'message-error' : undefined}
                        />
                        {errors.message && (
                          <span id="message-error" className="block text-[11px] text-red-600 mt-1">
                            {errors.message}
                          </span>
                        )}
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group w-full py-3.5 px-6 rounded bg-ink text-bg text-xs uppercase tracking-widest font-medium hover:bg-accent transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        <span>{isSubmitting ? 'Transmitting Brief...' : 'Send Commission Inquiry'}</span>
                      </button>

                      <p className="text-[11px] text-center text-ink-muted">
                        Submissions are recorded in the artist&apos;s atelier inbox with immediate notification.
                      </p>
                    </form>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
