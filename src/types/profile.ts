export interface StatItem {
  value: number;
  suffix?: string;
  label: string;
}

export interface FactItem {
  label: string;
  value: string;
}

export interface ProfileSectionData {
  id: string;
  sectionNumber: string;
  title: string;
  artistName: string;
  subtitle: string;
  avatar: {
    src: string;
    alt: string;
    caption: string;
  };
  bioParagraphs: string[];
  styleThemes: string[];
  toolsUsed: string[];
  facts: FactItem[];
  stats: StatItem[];
  hasUnpublishedChanges?: boolean;
  publishedAt?: string;
  updatedAt?: string;
}
