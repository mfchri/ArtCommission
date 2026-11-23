export interface NavLink {
  id: string;
  label: string;
  href: string;
}

export interface SocialLink {
  name: string;
  handle: string;
  url: string;
  iconName: 'instagram' | 'twitter' | 'artstation' | 'pixiv' | 'mail';
}

export interface SiteConfig {
  artistName: string;
  artistKanji?: string;
  siteTitle: string;
  tagline: string;
  navLinks: NavLink[];
  socialLinks: SocialLink[];
  copyrightYear: number;
}

export const siteConfig: SiteConfig = {
  artistName: "KAIEN",
  artistKanji: "晦冥",
  siteTitle: "KAIEN — Original Character Artist & Illustrator",
  tagline: "Original Characters · Dark Fantasy · Graphic Narratives",
  navLinks: [
    { id: "intro", label: "Intro", href: "#intro" },
    { id: "profile", label: "Profile", href: "#profile" },
    { id: "works", label: "Works", href: "#works" },
    { id: "commissions", label: "Commissions", href: "#commissions" },
    { id: "contact", label: "Contact", href: "#contact" },
  ],
  socialLinks: [
    {
      name: "Instagram",
      handle: "@kaien_ink",
      url: "https://instagram.com/placeholder_kaien",
      iconName: "instagram",
    },
    {
      name: "X (Twitter)",
      handle: "@kaien_draws",
      url: "https://x.com/placeholder_kaien",
      iconName: "twitter",
    },
    {
      name: "ArtStation",
      handle: "artstation.com/kaien",
      url: "https://artstation.com/placeholder_kaien",
      iconName: "artstation",
    },
    {
      name: "Pixiv",
      handle: "pixiv.me/kaien_oc",
      url: "https://pixiv.me/placeholder_kaien",
      iconName: "pixiv",
    },
    {
      name: "Email",
      handle: "kaien.atelier@example.com",
      url: "mailto:kaien.atelier@example.com",
      iconName: "mail",
    },
  ],
  copyrightYear: 2026,
};
