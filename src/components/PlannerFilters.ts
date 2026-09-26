import type { ChildProfilePreview } from '../types/activity';

export interface PlannerFilterValues {
  childIds: string[];
  date: string;
  budget: string;
  distanceKm: number;
}

export function PlannerFilters(children: ChildProfilePreview[], values: PlannerFilterValues, minimumDate: string): string {
  return `<div class="planner-filter-stack">
    <fieldset class="planner-fieldset planner-children-fieldset"><legend>Who’s coming?</legend><p class="field-help">Choose one or more children.</p><div class="planner-child-options">${children.map((child) => `<label class="planner-child-option"><input type="checkbox" name="children" value="${child.id}" ${values.childIds.includes(child.id) ? 'checked' : ''}><span class="planner-child-avatar" aria-hidden="true">${child.name.charAt(0)}</span><span class="planner-child-name">${child.name}</span><span class="planner-child-check" aria-hidden="true">✓</span></label>`).join('')}</div></fieldset>
    <div class="planner-form-grid">
      <label class="planner-control"><span>What day?</span><input id="planner-date" name="date" type="date" min="${minimumDate}" value="${values.date}" aria-describedby="date-help"><small id="date-help">We’ll use this for suggested timing.</small></label>
      <label class="planner-control"><span>Family budget</span><select name="budget" aria-label="Family budget"><option value="FREE" ${values.budget === 'FREE' ? 'selected' : ''}>Free &amp; easy</option><option value="2000" ${values.budget === '2000' ? 'selected' : ''}>Up to PKR 2,000</option><option value="5000" ${values.budget === '5000' ? 'selected' : ''}>Up to PKR 5,000</option><option value="10000" ${values.budget === '10000' ? 'selected' : ''}>Up to PKR 10,000</option><option value="ANY" ${values.budget === 'ANY' ? 'selected' : ''}>Flexible</option></select></label>
      <label class="planner-control planner-distance-control"><span>How far should we look?</span><select name="distanceKm" aria-label="Maximum travel distance"><option value="10" ${values.distanceKm === 10 ? 'selected' : ''}>Nearby · 10 km</option><option value="30" ${values.distanceKm === 30 ? 'selected' : ''}>A little further · 30 km</option><option value="100" ${values.distanceKm === 100 ? 'selected' : ''}>Day trip · 100 km</option></select><small>Mock ideas don’t have verified distance data.</small></label>
    </div>
  </div>`;
}
