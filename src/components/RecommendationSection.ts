import type { ActivityRecommendation } from '../types/activity';
import { ActivityCarousel } from './ActivityCarousel';

type SectionOptions = {
  id: string;
  title: string;
  subtitle: string;
  activities: ActivityRecommendation[];
  savedIds: Set<string>;
  state?: 'ready' | 'loading';
};

function loadingState(): string {
  return `<div class="recommendation-loading" role="status" aria-label="Loading ideas"><span class="sr-only">Loading ideas…</span><div class="skeleton-card"></div><div class="skeleton-card"></div><div class="skeleton-card"></div></div>`;
}

export function RecommendationSection(options: SectionOptions): string {
  const content = options.state === 'loading'
    ? loadingState()
    : ActivityCarousel(options.id, options.activities, options.savedIds);

  return `<section class="recommendation-section" id="${options.id}-section" aria-labelledby="${options.id}-heading">
    <div class="recommendation-heading">
      <div><p class="section-kicker">A FEW IDEAS TO GET YOU STARTED</p><h2 id="${options.id}-heading">${options.title}</h2><p class="section-subtitle">${options.subtitle}</p></div>
      <a class="text-action" href="#${options.id}-section" aria-label="Browse ${options.title.toLowerCase()} ideas">Browse ideas <span aria-hidden="true">→</span></a>
    </div>
    ${content}
  </section>`;
}
