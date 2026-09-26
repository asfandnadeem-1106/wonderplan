import type { PlannerActivityType, PlannerEnvironment, PlannerTimeOfDay } from '../types/planner';

interface Preferences {
  activityType: PlannerActivityType;
  environment: PlannerEnvironment;
  timeOfDay: PlannerTimeOfDay;
}

const timeChoices: Array<{ value: PlannerTimeOfDay; label: string }> = [
  { value: 'ANY', label: 'Any time' },
  { value: 'MORNING', label: 'Morning' },
  { value: 'AFTERNOON', label: 'Afternoon' },
  { value: 'EVENING', label: 'Evening' },
];

export function PlannerPreferences(preferences: Preferences): string {
  return `<div class="planner-preferences">
    <label class="planner-control"><span>What sounds good?</span><select name="activityType" aria-label="Activity type"><option value="ANY" ${preferences.activityType === 'ANY' ? 'selected' : ''}>A little of everything</option><option value="OUTDOORS" ${preferences.activityType === 'OUTDOORS' ? 'selected' : ''}>Something outdoors</option><option value="EDUCATIONAL" ${preferences.activityType === 'EDUCATIONAL' ? 'selected' : ''}>Something educational</option><option value="SPORTS" ${preferences.activityType === 'SPORTS' ? 'selected' : ''}>Sports &amp; movement</option><option value="CREATIVE" ${preferences.activityType === 'CREATIVE' ? 'selected' : ''}>Make &amp; create</option><option value="QUIET" ${preferences.activityType === 'QUIET' ? 'selected' : ''}>Something calm</option></select></label>
    <fieldset class="planner-fieldset"><legend>Inside or outside?</legend><div class="planner-choice-row">${[['ANY', 'Either is fine'], ['INDOOR', 'Indoors'], ['OUTDOOR', 'Outdoors']].map(([value, label]) => `<label class="planner-choice"><input type="radio" name="environment" value="${value}" ${preferences.environment === value ? 'checked' : ''}><span>${label}</span></label>`).join('')}</div></fieldset>
    <fieldset class="planner-fieldset"><legend>Time of day</legend><div class="planner-choice-row time-choice-row">${timeChoices.map(({ value, label }) => `<label class="planner-choice"><input type="radio" name="timeOfDay" value="${value}" ${preferences.timeOfDay === value ? 'checked' : ''}><span>${label}</span></label>`).join('')}</div></fieldset>
  </div>`;
}
