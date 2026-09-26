import type { Itinerary } from '../types/planner';

function formatPlanDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  const parsed = new Date(year, month - 1, day);
  return Number.isNaN(parsed.getTime()) ? date : new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(parsed);
}

export function PlanSummary(plan: Itinerary): string {
  const children = plan.childNames.join(' & ');
  return `<header class="plan-summary"><div class="plan-summary-mark" aria-hidden="true">✦</div><div><p class="planner-eyebrow">YOUR MOCK PLAN IS READY</p><h2>${plan.title}</h2><p>${plan.introduction}</p></div><dl class="plan-summary-facts"><div><dt>WHEN</dt><dd>${formatPlanDate(plan.date)}</dd></div><div><dt>WHO</dt><dd>${children}</dd></div><div><dt>BUDGET PREFERENCE</dt><dd>${plan.budget === 'FREE' ? 'Free &amp; easy' : plan.budget === 'ANY' ? 'Flexible' : `Up to PKR ${Number(plan.budget).toLocaleString('en')}`}</dd></div><div><dt>TRAVEL PREFERENCE</dt><dd>Up to ${plan.distanceKm} km</dd></div></dl><p class="plan-summary-disclaimer">Sample itinerary · Suggested times are flexible. Budget and travel range are preferences; these ideas have no confirmed prices, venues, or distances.</p></header>`;
}
