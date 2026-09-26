import type { PlannedActivity } from '../types/planner';

export function PlanActivityCard(activity: PlannedActivity, index: number): string {
  return `<article class="plan-activity-card">
    <div class="plan-activity-card-top"><span class="plan-activity-number">${String(index + 1).padStart(2, '0')}</span><span class="plan-activity-category">${activity.category.replaceAll('_', ' ')}</span><span class="plan-activity-emoji" aria-hidden="true">${activity.emoji}</span></div>
    <div class="plan-activity-card-content"><h3>${activity.title}</h3><p>${activity.description}</p><div class="plan-activity-reason"><span aria-hidden="true">✦</span> ${activity.whyItFits}</div><div class="plan-activity-details"><span>Suggested time · ${activity.suggestedStart}–${activity.suggestedEnd}</span><span>${activity.suggestedDuration}</span><span>${activity.format}</span></div></div>
  </article>`;
}
