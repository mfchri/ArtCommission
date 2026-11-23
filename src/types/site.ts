export interface NavLabels {
  intro: string;
  profile: string;
  works: string;
  commissions: string;
  contact: string;
}

export interface SectionVisibility {
  intro: boolean;
  profile: boolean;
  works: boolean;
  commissions: boolean;
  contact: boolean;
}

export interface SocialLinkItem {
  id: string;
  platform: string;
  name: string;
  handle: string;
  url: string;
  iconName: 'instagram' | 'twitter' | 'artstation' | 'pixiv' | 'mail';
  isVisible: boolean;
  sortOrder: number;
}

export interface SiteSettings {
  id: string;
  artistName: string;
  artistKanji?: string;
  siteTitle: string;
  tagline: string;
  metaDescription: string;
  ogImage: string;
  faviconSvg: string;
  navLabels: NavLabels;
  sectionVisibility: SectionVisibility;
  footerText: string;
  copyrightYear: number;
  hasUnpublishedChanges?: boolean;
  publishedAt?: string;
  updatedAt?: string;
}
