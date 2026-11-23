import React from 'react';
import { Instagram, Twitter, Mail, ExternalLink } from 'lucide-react';
import { SocialLink } from '../data/site';

interface SocialLinksProps {
  links: SocialLink[];
  className?: string;
  showHandles?: boolean;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({ links, className = '', showHandles = false }) => {
  const getIcon = (iconName: SocialLink['iconName']) => {
    switch (iconName) {
      case 'instagram':
        return <Instagram className="w-4 h-4" />;
      case 'twitter':
        return <Twitter className="w-4 h-4" />;
      case 'mail':
        return <Mail className="w-4 h-4" />;
      case 'artstation':
        return (
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M0 17.723l2.027 3.505h.001a2.424 2.424 0 0 0 2.164 1.334h13.444l-2.58-4.839H0zm23.635-2.89L15.414 1.438A2.43 2.43 0 0 0 13.284.148H8.818l10.36 17.917 4.457-3.232zm-12.75 1.543l-3.32-5.748L4.2 16.376h6.685z" />
          </svg>
        );
      case 'pixiv':
        return (
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.372 0 0 5.372 0 12c0 4.975 3.033 9.24 7.348 11.026.495-.495.885-1.157.94-1.922v-3.766c-.663.364-1.424.57-2.23.57-2.736 0-4.954-2.218-4.954-4.954 0-2.736 2.218-4.954 4.954-4.954 2.736 0 4.954 2.218 4.954 4.954 0 .762-.178 1.482-.495 2.124h1.56c1.378 0 2.5 1.122 2.5 2.5v3.136c0 .766.39 1.428.885 1.922C19.794 21.08 24 16.92 24 12c0-6.628-5.372-12-12-12z" />
          </svg>
        );
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {links.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target={link.url.startsWith('mailto:') ? '_self' : '_blank'}
          rel={link.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
          className="group flex items-center gap-2 px-3 py-1.5 rounded text-xs tracking-wider uppercase text-ink-secondary hover:text-ink hover:bg-surface border border-transparent hover:border-border transition-all duration-300"
          aria-label={`${link.name}: ${link.handle}`}
        >
          <span className="text-accent group-hover:text-ink transition-colors duration-300">
            {getIcon(link.iconName)}
          </span>
          <span className="font-medium">{link.name}</span>
          {showHandles && (
            <span className="text-[11px] text-ink-muted group-hover:text-ink-secondary transition-colors lowercase">
              {link.handle}
            </span>
          )}
        </a>
      ))}
    </div>
  );
};
