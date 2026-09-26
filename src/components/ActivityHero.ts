import type { Activity } from '../types/activity';
import { InterestTags } from './InterestTags';
import { MatchBadge } from './MatchBadge';

export function ActivityHero(activity: Activity): string {
  return `<section class="activity-hero" aria-labelledby="activity-page-title">
    <div class="activity-hero-image"><img src="${activity.imageUrl}" alt="${activity.imageAlt}" fetchpriority="high">${MatchBadge(activity.matchPercentage)}</div>
    <div class="activity-hero-copy">
      <a class="activity-back-link" href="/home"><span aria-hidden="true">←</span> Back to your ideas</a>
      <div class="activity-categories">${activity.categories.map((category) => `<span>${category}</span>`).join('')}</div>
      <h1 id="activity-page-title">${activity.title}</h1>
      <p>${activity.description}</p>
      ${InterestTags(activity.matchReasons)}
    </div>
  </section>`;
}
