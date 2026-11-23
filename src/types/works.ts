export type ArtworkCategory = 'all' | 'oc' | 'comic' | 'commissions' | 'sketches';

export interface WorkCategoryItem {
  id: string;
  label: string;
  sortOrder: number;
}

export interface Artwork {
  id: string;
  title: string;
  year: string;
  category: string;
  categoryLabel: string;
  image: string;
  thumbnail?: string;
  aspectClass: string;
  description: string;
  medium: string;
  dimensions?: string;
  featured: boolean;
  isVisible: boolean;
  sortOrder: number;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ComicProject {
  id: string;
  title: string;
  volume: string;
  subtitle: string;
  status: 'Ongoing' | 'Completed' | 'Hiatus';
  synopsis: string;
  genre: string[];
  coverImage: string;
  currentChapter: string;
  releaseSchedule: string;
  readUrl: string;
  notes: string;
  hasUnpublishedChanges?: boolean;
  publishedAt?: string;
  updatedAt?: string;
}
