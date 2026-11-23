export interface CommissionTypeOption {
  value: string;
  label: string;
}

export interface ContactSettings {
  id: string;
  sectionNumber: string;
  title: string;
  invitation: string;
  subtext: string;
  email: string;
  availabilityNote: string;
  commissionTypes: CommissionTypeOption[];
  hasUnpublishedChanges?: boolean;
  publishedAt?: string;
  updatedAt?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  commissionType: string;
  referenceUrl?: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}
