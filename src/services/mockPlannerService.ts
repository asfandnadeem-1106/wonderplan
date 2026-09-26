import { mockChildren, mockRecommendations } from '../data/mockHomeData';
import type { ActivityRecommendation } from '../types/activity';
import type { Itinerary, PlannedActivity, PlannerRequest } from '../types/planner';

function parseLocalDate(value: string): Date {
  const parts = value.split('-').map(Number);
  if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) throw new Error('Choose a valid date to make your plan.');
  const [year, month, day] = parts;
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) throw new Error('Choose a valid date to make your plan.');
  return date;
}

function matchesRequest(activity: ActivityRecommendation, request: PlannerRequest): boolean {
  const searchText = `${activity.category} ${activity.reason} ${activity.format} ${activity.title}`.toLowerCase();
  if (request.environment === 'INDOOR' && activity.format !== 'At home') return false;
  if (request.environment === 'OUTDOOR' && activity.format !== 'Outdoors') return false;
  if (request.activityType === 'OUTDOORS' && activity.format !== 'Outdoors') return false;
  if (request.activityType === 'EDUCATIONAL' && !/science|geography|learn|curious|educat/.test(searchText)) return false;
  if (request.activityType === 'SPORTS' && !/sport|football|basketball|swim/.test(searchText)) return false;
  if (request.activityType === 'CREATIVE' && !/make|create|art|draw|build|craft/.test(searchText)) return false;
  if (request.activityType === 'QUIET' && !/map|story|sketch|read|quiet/.test(searchText)) return false;
  return true;
}

function startMinutes(timeOfDay: PlannerRequest['timeOfDay']): number {
  if (timeOfDay === 'AFTERNOON') return 13 * 60;
  if (timeOfDay === 'EVENING') return 17 * 60;
  return 9 * 60;
}

function displayTime(totalMinutes: number): string {
  const date = new Date(2026, 0, 1, Math.floor(totalMinutes / 60), totalMinutes % 60);
  return new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(date);
}

function suggestionToPlan(activity: ActivityRecommendation, index: number, baseMinutes: number): PlannedActivity {
  const durationMinutes = index === 0 ? 60 : 45;
  const startMinutesValue = baseMinutes + (index === 0 ? 0 : 90 * index);
  const start = displayTime(startMinutesValue);
  const end = displayTime(startMinutesValue + durationMinutes);
  return {
    id: activity.id,
    title: activity.title,
    description: activity.description,
    category: activity.category,
    emoji: activity.emoji,
    format: activity.format,
    suggestedStart: start,
    suggestedEnd: end,
    suggestedDuration: `Allow about ${durationMinutes} minutes`,
    whyItFits: activity.reason,
  };
}

export async function createMockPlan(request: PlannerRequest): Promise<Itinerary | null> {
  await new Promise((resolve) => window.setTimeout(resolve, 600));
  if (!request.date) throw new Error('Choose a day so we can shape the itinerary around it.');
  const selectedDate = parseLocalDate(request.date);
  const selectedChildren = mockChildren.filter((child) => request.childIds.includes(child.id));
  if (!selectedChildren.length) return null;

  const candidates = selectedChildren.flatMap((child) => mockRecommendations[child.id] ?? []);
  const uniqueCandidates = [...new Map(candidates.map((activity) => [activity.id, activity])).values()];
  const eligible = uniqueCandidates.filter((activity) => matchesRequest(activity, request));
  if (!eligible.length) return null;

  const rotation = request.variation % eligible.length;
  const rotated = [...eligible.slice(rotation), ...eligible.slice(0, rotation)].slice(0, 3);
  const childNames = selectedChildren.map((child) => child.name);
  const timeLabel = request.timeOfDay === 'ANY' ? 'flexible' : request.timeOfDay.toLowerCase();
  const introNames = childNames.length > 1 ? `${childNames.slice(0, -1).join(', ')} and ${childNames.at(-1)}` : childNames[0];
  const activities = rotated.map((activity, index) => suggestionToPlan(activity, index, startMinutes(request.timeOfDay)));

  if (selectedDate.getTime() < new Date(new Date().setHours(0, 0, 0, 0)).getTime()) {
    throw new Error('That date has passed. Pick today or a later day for your plan.');
  }

  return {
    date: request.date,
    childNames,
    budget: request.budget,
    distanceKm: request.distanceKm,
    timeOfDay: request.timeOfDay,
    title: `A ${timeLabel} plan for ${introNames}`,
    introduction: `A flexible set of ideas shaped around ${introNames} and the interests you selected. All times are suggested, and these are at-home or general activity ideas—not confirmed local events.`,
    activities,
  };
}
