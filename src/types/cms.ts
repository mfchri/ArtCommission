export type AreaKey = 
  | 'site_settings'
  | 'intro'
  | 'profile'
  | 'works'
  | 'comic'
  | 'commissions'
  | 'contact';

export interface AreaPublishState {
  hasUnpublishedChanges: boolean;
  lastPublishedAt?: string;
  lastSavedDraftAt?: string;
}

export interface RevisionSnapshot {
  id: string;
  area: AreaKey;
  snapshot: Record<string, unknown>;
  publishedAt: string;
  publishedBy?: string;
}

export interface WebsiteDataBundle {
  siteSettings: import('./site').SiteSettings;
  intro: import('./intro').IntroSectionData;
  profile: import('./profile').ProfileSectionData;
  categories: import('./works').WorkCategoryItem[];
  artworks: import('./works').Artwork[];
  comicProject: import('./works').ComicProject;
  commissionsConfig: import('./commissions').CommissionsConfig;
  commissionTiers: import('./commissions').CommissionTier[];
  commissionAddons: import('./commissions').AddOnItem[];
  commissionSteps: import('./commissions').ProcessStep[];
  commissionTos: import('./commissions').TosItem[];
  commissionFaqs: import('./commissions').FaqItem[];
  contactSettings: import('./contact').ContactSettings;
  socialLinks: import('./site').SocialLinkItem[];
}
