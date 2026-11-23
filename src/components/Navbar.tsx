import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useWebsiteData } from '../context/WebsiteDataContext';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { mobileMenuVariants } from '../utils/motion';

export const Navbar: React.FC = () => {
  const { data } = useWebsiteData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { siteSettings } = data;
  const { sectionVisibility, navLabels } = siteSettings;

  // Build nav links filtered by section visibility
  const navLinks = [
    { id: 'intro', label: navLabels.intro || 'Intro', href: '#intro', visible: sectionVisibility.intro },
    { id: 'profile', label: navLabels.profile || 'Profile', href: '#profile', visible: sectionVisibility.profile },
    { id: 'works', label: navLabels.works || 'Works', href: '#works', visible: sectionVisibility.works },
    { id: 'commissions', label: navLabels.commissions || 'Commissions', href: '#commissions', visible: sectionVisibility.commissions },
    { id: 'contact', label: navLabels.contact || 'Contact', href: '#contact', visible: sectionVisibility.contact },
  ].filter((l) => l.visible);

  const sectionIds = navLinks.map((link) => link.id);
  const activeSectionId = useScrollSpy(sectionIds, 120);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', href);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-bg/90 backdrop-blur-md border-b border-border shadow-[0_2px_12px_rgba(0,0,0,0.02)] py-3.5'
          : 'bg-transparent border-b border-transparent py-5 sm:py-6'
      }`}
    >
      <div className="max-w-content mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Left: Brand / Logo */}
        <a
          href="#intro"
          onClick={(e) => handleNavClick(e, '#intro')}
          className="group flex items-center gap-2.5 text-ink tracking-widest transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded px-1"
        >
          <span className="font-serif text-xl sm:text-2xl font-light tracking-wide">
            {siteSettings.artistName}
          </span>
          {siteSettings.artistKanji && (
            <span className="text-xs font-serif text-accent tracking-widest pl-1 border-l border-border">
              {siteSettings.artistKanji}
            </span>
          )}
        </a>

        {/* Right: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = activeSectionId === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`relative text-xs tracking-widest uppercase transition-colors duration-300 py-1 font-medium ${
                  isActive ? 'text-ink' : 'text-ink-secondary hover:text-ink'
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-ink"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-ink hover:text-accent rounded transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden fixed top-[61px] left-0 right-0 bg-bg/95 backdrop-blur-lg border-b border-border shadow-lg px-6 py-8"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => {
                const isActive = activeSectionId === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`flex items-center justify-between text-sm tracking-widest uppercase font-medium py-2 border-b border-border/50 ${
                      isActive ? 'text-ink font-semibold' : 'text-ink-secondary hover:text-ink'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-ink" />}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
