import type { Itinerary } from '../types/planner';
import { PlanActivityCard } from './PlanActivityCard';

export function PlanTimeline(plan: Itinerary): string {
  return `<section class="plan-timeline" aria-labelledby="plan-timeline-title"><div class="timeline-heading"><div><p class="planner-eyebrow">A FLEXIBLE FLOW</p><h2 id="plan-timeline-title">Your day, at an easy pace</h2></div><span class="timeline-moment-count">${plan.activities.length} ${plan.activities.length === 1 ? 'idea' : 'ideas'}</span></div><ol class="timeline-list">${plan.activities.map((activity, index) => `<li class="timeline-item"><div class="timeline-time"><strong>${activity.suggestedStart}</strong><span>${activity.suggestedEnd}</span></div><span class="timeline-rail" aria-hidden="true"><i></i></span>${PlanActivityCard(activity, index)}</li>`).join('')}</ol></section>`;
}
