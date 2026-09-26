import type { ActivityRecommendation } from '../types/activity';
import { ActivityMeta } from './ActivityMeta';
import { MatchBadge } from './MatchBadge';

export function ActivityCard(activity: ActivityRecommendation, saved: boolean): string {
  const status = activity.sample
    ? 'Example idea · confirm local details before heading out'
    : `Verified listing${activity.sourceName ? ` · ${activity.sourceName}` : ''}`;
  return `<article class="activity-card" aria-labelledby="activity-title-${activity.id}">
    <div class="activity-card-art art-${activity.visual}">
      <span class="activity-category">${activity.category}</span>
      <span class="activity-emoji" aria-hidden="true">${activity.emoji}</span>
      ${MatchBadge(activity.matchScore)}
      <button class="save-activity${saved ? ' is-saved' : ''}" type="button" data-save-id="${activity.id}" aria-pressed="${saved}" aria-label="${saved ? 'Remove from saved ideas' : 'Save idea'}: ${activity.title}"><span aria-hidden="true">${saved ? '♥' : '♡'}</span></button>
    </div>
    <div class="activity-card-body">
      ${activity.reason ? `<p class="idea-reason"><span aria-hidden="true">✦</span> ${activity.reason}</p>` : ''}
      <h3 id="activity-title-${activity.id}"><a class="activity-detail-link" href="/activities/${encodeURIComponent(activity.id)}">${activity.title}</a></h3>
      <p class="activity-description">${activity.description}</p>
      ${ActivityMeta(activity.format, activity.ageGuidance)}
      <span class="idea-status">${activity.statusMessage ?? status}</span>
    </div>
  </article>`;
}
