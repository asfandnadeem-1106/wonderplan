import type { ActivityRecommendation } from '../types/activity';
import { ActivityCard } from './ActivityCard';

export function ActivityCarousel(id: string, activities: ActivityRecommendation[], savedIds: Set<string>): string {
  if (!activities.length) {
    return `<div class="recommendation-empty" role="status"><span aria-hidden="true">✧</span><h3>We’re still looking for a good fit.</h3><p>Try another interest or check back for more ideas.</p></div>`;
  }

  return `<div class="carousel-frame">
    <div class="carousel-controls">
      <button class="carousel-control" type="button" data-carousel-scroll="-1" data-carousel-target="${id}" aria-controls="${id}" aria-label="Scroll to previous ideas">←</button>
      <button class="carousel-control" type="button" data-carousel-scroll="1" data-carousel-target="${id}" aria-controls="${id}" aria-label="Scroll to more ideas">→</button>
    </div>
    <div class="activity-carousel" id="${id}" role="region" aria-label="Recommended ideas" tabindex="0">
      ${activities.map((activity, index) => `<div class="carousel-slide" role="group" aria-roledescription="slide" aria-label="${index + 1} of ${activities.length}: ${activity.title}">${ActivityCard(activity, savedIds.has(activity.id))}</div>`).join('')}
    </div>
  </div>`;
}
