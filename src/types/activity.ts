export interface ActivityRecommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  emoji: string;
  visual: 'sky' | 'garden' | 'studio' | 'cosmos';
  format: string;
  ageGuidance: string;
  reason: string;
  matchScore: number;
  sample: boolean;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  categories: string[];
  date: string | null;
  time: string | null;
  location: { name: string; city?: string } | null;
  distanceKm: number | null;
  ageRange: { min: number; max: number } | null;
  price: { amount: number; currency: string } | null;
  matchPercentage: number;
  matchReasons: string[];
  source: { name: string; url: string | null };
  verificationStatus: 'MOCK' | 'VERIFIED' | 'LIKELY_VALID' | 'UNVERIFIED' | 'EXPIRED' | 'CANCELLED';
  lastVerifiedAt: string | null;
}

export interface ChildProfilePreview {
  id: string;
  name: string;
  interests: string[];
}
