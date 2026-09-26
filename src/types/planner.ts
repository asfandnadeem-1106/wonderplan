export type PlannerActivityType = 'ANY' | 'OUTDOORS' | 'EDUCATIONAL' | 'SPORTS' | 'CREATIVE' | 'QUIET';
export type PlannerEnvironment = 'ANY' | 'INDOOR' | 'OUTDOOR';
export type PlannerTimeOfDay = 'ANY' | 'MORNING' | 'AFTERNOON' | 'EVENING';

export interface PlannerRequest {
  childIds: string[];
  date: string;
  budget: string;
  distanceKm: number;
  activityType: PlannerActivityType;
  environment: PlannerEnvironment;
  timeOfDay: PlannerTimeOfDay;
  variation: number;
}

export interface PlannedActivity {
  id: string;
  title: string;
  description: string;
  category: string;
  emoji: string;
  format: string;
  suggestedStart: string;
  suggestedEnd: string;
  suggestedDuration: string;
  whyItFits: string;
}

export interface Itinerary {
  date: string;
  childNames: string[];
  budget: string;
  distanceKm: number;
  timeOfDay: PlannerTimeOfDay;
  title: string;
  introduction: string;
  activities: PlannedActivity[];
}
