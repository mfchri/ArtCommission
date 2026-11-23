import React from 'react';
import { ArrowUp } from 'lucide-react';
import { useWebsiteData } from '../context/WebsiteDataContext';
import { SocialLinks } from './SocialLinks';

export const Footer: React.FC = () => {
  const { data } = useWebsiteData();
  const { siteSettings, socialLinks } = data;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <footer className="w-full border-t border-border bg-bg pt-12 pb-16 transition-colors">
      <div className="max-w-content mx-auto px-6 sm:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-border/50">
          {/* Artist Signature & Tagline */}
          <div className="text-center md:text-left">
            <a
              href="#intro"
              className="font-serif text-2xl font-light tracking-wide text-ink hover:opacity-80 transition-opacity"
            >
              {siteSettings.artistName}
            </a>
            <p className="text-xs text-ink-secondary tracking-widest uppercase mt-1">
              {siteSettings.tagline}
            </p>
          </div>

          {/* Social Links */}
          <SocialLinks links={visibleSocials} />
        </div>

        {/* Bottom row: Copyright & Back to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs text-ink-secondary">
          <p className="tracking-wide">
            &copy; {siteSettings.copyrightYear} {siteSettings.artistName}. {siteSettings.footerText}
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="group flex items-center gap-2 hover:text-ink transition-colors px-2 py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded"
            aria-label="Back to top of the page"
          >
            <span className="uppercase tracking-widest text-[11px] font-medium">Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
