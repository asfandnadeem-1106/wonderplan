import type { ChildProfilePreview } from '../types/activity';
import type { PlannerRequest } from '../types/planner';
import { PlannerFilters } from './PlannerFilters';
import { PlannerPreferences } from './PlannerPreferences';

export type PlannerFormValues = Pick<PlannerRequest, 'childIds' | 'date' | 'budget' | 'distanceKm' | 'activityType' | 'environment' | 'timeOfDay'>;

export function PlannerInput(children: ChildProfilePreview[], values: PlannerFormValues, minimumDate: string): string {
  return `<form class="planner-input" id="planner-form" novalidate>
    <div class="planner-form-heading"><span class="planner-step-mark">01</span><div><p class="planner-eyebrow">A FEW SIMPLE CHOICES</p><h2>Shape your day</h2><p>Pick what matters and we’ll put together a flexible starting point.</p></div></div>
    <section class="planner-quick-actions" aria-labelledby="quick-actions-title"><h3 id="quick-actions-title">Start with a feeling</h3><div class="quick-action-grid"><button type="button" data-quick-action="today">☀ Today</button><button type="button" data-quick-action="tomorrow">Tomorrow</button><button type="button" data-quick-action="weekend">This weekend</button><button type="button" data-quick-action="outdoors">🌿 Something outdoors</button><button type="button" data-quick-action="educational">✦ Something educational</button><button type="button" data-quick-action="surprise">Surprise us <span aria-hidden="true">↗</span></button></div></section>
    ${PlannerFilters(children, values, minimumDate)}
    <div class="planner-preferences-block"><div class="planner-form-heading planner-form-heading-small"><span class="planner-step-mark">02</span><div><p class="planner-eyebrow">MAKE IT FEEL LIKE YOUR FAMILY</p><h2>Set the mood</h2></div></div>${PlannerPreferences(values)}</div>
    <button class="planner-submit" type="submit"><span aria-hidden="true">✦</span> Make a plan <span class="planner-submit-arrow" aria-hidden="true">→</span></button>
    <p class="planner-submit-note">A draft to shape together · no bookings or live listings</p>
  </form>`;
}
