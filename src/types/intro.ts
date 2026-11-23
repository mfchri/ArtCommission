export interface HeroArtworkConfig {
  src: string;
  alt: string;
  title: string;
  medium: string;
  year: string;
  focalX?: number; // 0 - 100%
  focalY?: number; // 0 - 100%
}

export interface IntroSectionData {
  id: string;
  eyebrow: string;
  headline: string;
  bioSummary: string;
  heroArtwork: HeroArtworkConfig;
  ctaPrimary: {
    label: string;
    href: string;
  };
  ctaSecondary: {
    label: string;
    href: string;
  };
  hasUnpublishedChanges?: boolean;
  publishedAt?: string;
  updatedAt?: string;
}
