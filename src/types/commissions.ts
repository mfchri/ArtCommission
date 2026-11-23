export interface CommissionTier {
  id: string;
  name: string;
  price: string;
  badge?: string | null;
  description: string;
  image: string;
  turnaround: string;
  features: string[];
  isPopular: boolean;
  sortOrder: number;
}

export interface AddOnItem {
  id: string;
  name: string;
  price: string;
  note?: string;
  sortOrder: number;
}

export interface ProcessStep {
  id: string;
  step: string;
  title: string;
  description: string;
  sortOrder: number;
}

export interface TosItem {
  id: string;
  title: string;
  content: string[];
  sortOrder: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
}

export interface CommissionsConfig {
  id: string;
  sectionNumber: string;
  title: string;
  description: string;
  isOpen: boolean;
  slotsTotal: number;
  slotsAvailable: number;
  nextOpeningEstimate: string;
  hasUnpublishedChanges?: boolean;
  publishedAt?: string;
  updatedAt?: string;
}
