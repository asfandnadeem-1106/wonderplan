import type { Activity } from '../types/activity';

export function ExternalLinkButton(activity: Activity): string {
  if (!activity.source.url) {
    return `<button class="detail-action-button external-link-button" type="button" disabled aria-label="Original source link is unavailable"><span aria-hidden="true">↗</span><span>Source unavailable</span></button>`;
  }
  return `<a class="detail-action-button external-link-button" href="${activity.source.url}" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">↗</span><span>Open original source</span></a>`;
}
