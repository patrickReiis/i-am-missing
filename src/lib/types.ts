export interface MissingReport {
  id: string;
  kind: 'person' | 'animal';
  name: string;
  description: string;
  lastSeen: string;
  location: string;
  contactInfo: string;
  imageUrl?: string;
  pubkey: string;
  createdAt: number;
}

export const MISSING_REPORT_KIND = 30001; // Custom kind for missing reports