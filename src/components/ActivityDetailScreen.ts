import { getActivityById } from '../services/activityService';
import { getMockActivityById } from '../services/mockActivityService';
import type { Activity } from '../types/activity';
import { ActivityHero } from './ActivityHero';
import { ActivityMeta } from './ActivityMeta';
import { ExternalLinkButton } from './ExternalLinkButton';
import { MatchExplanation } from './MatchExplanation';
import { SaveButton } from './SaveButton';
import { SourceVerification } from './SourceVerification';

function loadingMarkup(): string {
  return `<div class="activity-detail-loading" role="status" aria-label="Loading activity details"><span class="sr-only">Loading activity details…</span><div class="detail-skeleton-image"></div><div class="detail-skeleton-copy"></div></div>`;
}

function notFoundMarkup(): string {
  return `<section class="activity-not-found" role="status"><span aria-hidden="true">✧</span><h1>We couldn’t find that idea.</h1><p>It may have moved or this preview doesn’t include it.</p><a class="detail-action-button" href="/home">Back to Home</a></section>`;
}

function detailMarkup(activity: Activity): string {
  return `<article class="activity-detail-page">
    ${ActivityHero(activity)}
    <div class="activity-detail-layout">
      <div class="activity-detail-main">
        <section class="detail-information" aria-labelledby="detail-information-title"><p class="detail-section-eyebrow">PLAN WITH CONFIDENCE</p><h2 id="detail-information-title">Activity details</h2>${ActivityMeta(activity)}</section>
        ${MatchExplanation(activity)}
        ${SourceVerification(activity)}
      </div>
      <aside class="activity-detail-aside" aria-label="Activity actions">
        <div class="detail-aside-card"><p class="detail-section-eyebrow">SAVE IT FOR LATER</p><h2>A little idea worth keeping.</h2>${SaveButton(activity.id)}${ExternalLinkButton(activity)}</div>
      </aside>
    </div>
    <div class="detail-bottom-action-bar" aria-label="Activity actions">${SaveButton(activity.id)}${ExternalLinkButton(activity)}</div>
  </article>`;
}

export function mountActivityDetailScreen(root: HTMLElement, activityId: string): void {
  root.innerHTML = loadingMarkup();
  void getActivityById(activityId).then(async (liveActivity) => {
    const activity = liveActivity ?? await getMockActivityById(activityId);
    if (!activity) {
      root.innerHTML = notFoundMarkup();
      return;
    }

    let saved = false;
    root.innerHTML = detailMarkup(activity);
    root.addEventListener('click', (event) => {
      if (!(event.target instanceof Element)) return;
      const saveButton = event.target.closest<HTMLButtonElement>('[data-detail-save]');
      if (!saveButton) return;
      saved = !saved;
      root.querySelectorAll<HTMLButtonElement>('[data-detail-save]').forEach((button) => {
        button.classList.toggle('is-saved', saved);
        button.setAttribute('aria-pressed', String(saved));
        button.setAttribute('aria-label', saved ? 'Remove from saved ideas' : 'Save this idea');
        button.innerHTML = `<span aria-hidden="true">${saved ? '♥' : '♡'}</span><span>${saved ? 'Saved' : 'Save idea'}</span>`;
      });
      const announcement = root.querySelector<HTMLElement>('#detail-announcement');
      if (announcement) announcement.textContent = saved ? 'Idea saved.' : 'Idea removed from saved ideas.';
    });
    root.insertAdjacentHTML('afterbegin', '<span class="sr-only" id="detail-announcement" aria-live="polite"></span>');
  }).catch(() => {
    root.innerHTML = notFoundMarkup();
  });
}
