import type { Activity } from '../types/activity';

function verificationLabel(status: Activity['verificationStatus']): string {
  return status === 'MOCK' ? 'Demo content · not externally verified' : status.replaceAll('_', ' ').toLowerCase();
}

function formattedTimestamp(timestamp: string | null): string {
  if (!timestamp) return 'No verification timestamp available';
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? 'Verification timestamp unavailable' : new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export function SourceVerification(activity: Activity): string {
  return `<section class="source-verification" aria-labelledby="source-verification-title">
    <div class="source-heading"><span class="source-icon" aria-hidden="true">◎</span><div><p class="detail-section-eyebrow">SOURCE & FRESHNESS</p><h2 id="source-verification-title">Information you can check</h2></div></div>
    <dl class="source-facts">
      <div><dt>Source</dt><dd>${activity.source.name}</dd></div>
      <div><dt>Verification</dt><dd><span class="verification-status">${verificationLabel(activity.verificationStatus)}</span></dd></div>
      <div><dt>Last verified</dt><dd>${formattedTimestamp(activity.lastVerifiedAt)}</dd></div>
    </dl>
    <p class="source-demo-note">This is a general sample idea, not a confirmed event listing. Check any local details with the official organizer before making plans.</p>
  </section>`;
}
