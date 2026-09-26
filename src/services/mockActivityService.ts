import { mockRecommendations, newIdeas, weekendIdeas } from '../data/mockHomeData';
import type { Activity, ActivityRecommendation } from '../types/activity';

const recommendations = [...Object.values(mockRecommendations).flat(), ...weekendIdeas, ...newIdeas];

function toActivity(recommendation: ActivityRecommendation): Activity {
  const categories = [recommendation.category.replaceAll('_', ' ').toLowerCase()];
  const imageAltByVisual: Record<ActivityRecommendation['visual'], string> = {
    sky: 'Illustration of an aircraft crossing an open sky',
    garden: 'Illustration of a sunny green outdoor scene',
    studio: 'Illustration of a creative family activity',
    cosmos: 'Illustration of a starry blue sky',
  };
  return {
    id: recommendation.id,
    title: recommendation.title,
    description: recommendation.description,
    imageUrl: `/images/activity-${recommendation.visual}.svg`,
    imageAlt: imageAltByVisual[recommendation.visual],
    categories,
    date: null,
    time: null,
    location: null,
    distanceKm: null,
    ageRange: null,
    price: null,
    matchPercentage: recommendation.matchScore,
    matchReasons: recommendation.reason.split(' · '),
    source: { name: 'WonderPlan sample idea', url: null },
    verificationStatus: 'MOCK',
    lastVerifiedAt: null,
  };
}

const mockActivities = new Map(recommendations.map((recommendation) => [recommendation.id, toActivity(recommendation)]));

export async function getMockActivityById(id: string): Promise<Activity | null> {
  return mockActivities.get(id) ?? null;
}
