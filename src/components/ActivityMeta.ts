import type { Activity } from '../types/activity';

export function ActivityMeta(format: string, ageGuidance: string): string;
export function ActivityMeta(activity: Activity): string;
export function ActivityMeta(activityOrFormat: Activity | string, ageGuidance?: string): string {
  if (typeof activityOrFormat !== 'string') {
    const activity = activityOrFormat;
    const date = activity.date ? new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(new Date(activity.date)) : 'Not provided in this mock';
    const time = activity.time || 'Not provided in this mock';
    const location = activity.location ? [activity.location.name, activity.location.city].filter(Boolean).join(', ') : 'Not provided in this mock';
    const distance = activity.distanceKm == null ? 'Not calculated in this mock' : `${activity.distanceKm} km away`;
    const age = activity.ageRange ? `Ages ${activity.ageRange.min}–${activity.ageRange.max}` : 'No age guidance provided';
    const price = activity.price ? new Intl.NumberFormat('en', { style: 'currency', currency: activity.price.currency, maximumFractionDigits: 0 }).format(activity.price.amount) : 'No price provided';
    const rows = [['Date', date], ['Time', time], ['Location', location], ['Distance', distance], ['Age range', age], ['Price', price]];
    return `<dl class="activity-detail-meta">${rows.map(([label, value]) => `<div class="activity-meta-item"><dt>${label}</dt><dd>${value}</dd></div>`).join('')}</dl>`;
  }

  return `<ul class="activity-meta" aria-label="Idea details"><li><span aria-hidden="true">◷</span>${activityOrFormat}</li><li><span aria-hidden="true">✳</span>${ageGuidance ?? 'Family activity'}</li></ul>`;
}
