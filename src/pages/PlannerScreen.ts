import { mockChildren } from '../data/mockHomeData';
import { PlannerFollowupActions } from '../components/PlannerFollowupActions';
import { PlannerInput, type PlannerFormValues } from '../components/PlannerInput';
import { PlanSummary } from '../components/PlanSummary';
import { PlanTimeline } from '../components/PlanTimeline';
import { createMockPlan } from '../services/mockPlannerService';
import type { Itinerary, PlannerRequest } from '../types/planner';

type PlannerViewState = 'idle' | 'loading' | 'generated' | 'empty' | 'error';

function localDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function defaultValues(): PlannerFormValues {
  return {
    childIds: [mockChildren[0].id],
    date: localDateString(new Date()),
    budget: '5000',
    distanceKm: 30,
    activityType: 'ANY',
    environment: 'ANY',
    timeOfDay: 'ANY',
  };
}

function outputMarkup(state: PlannerViewState, plan: Itinerary | null, errorMessage: string): string {
  if (state === 'loading') {
    return `<section class="planner-output-state planner-loading-state" role="status" aria-label="Putting your ideas together"><span class="sr-only">Putting a few ideas together…</span><div class="planner-loading-heading"></div><div class="planner-loading-line"></div><div class="planner-loading-card"></div><div class="planner-loading-card"></div></section>`;
  }
  if (state === 'generated' && plan) {
    return `<div class="planner-generated-state">${PlanSummary(plan)}${PlanTimeline(plan)}${PlannerFollowupActions()}</div>`;
  }
  if (state === 'empty') {
    return `<section class="planner-output-state planner-empty-state" role="status"><span class="planner-empty-mark" aria-hidden="true">✧</span><p class="planner-eyebrow">A LITTLE MORE ROOM TO EXPLORE</p><h2>No ideas fit those choices yet.</h2><p>Try another activity type, include a sibling, or choose “Surprise us”. This preview only has a small set of sample ideas.</p><button class="planner-secondary-action" type="button" data-planner-action="broaden">Broaden my choices</button></section>`;
  }
  if (state === 'error') {
    return `<section class="planner-output-state planner-error-state" role="alert"><span class="planner-error-mark" aria-hidden="true">!</span><p class="planner-eyebrow">WE HIT A SMALL SNAG</p><h2>We couldn’t shape that plan.</h2><p>${errorMessage}</p><button class="planner-secondary-action" type="button" data-planner-action="retry">Try again</button></section>`;
  }
  return `<section class="planner-output-state planner-idle-state"><div class="idle-orbit" aria-hidden="true"><span>✦</span><span>☁</span><span>✧</span></div><p class="planner-eyebrow">YOUR FAMILY, YOUR KIND OF DAY</p><h2>A good plan leaves room for wonder.</h2><p>Choose a few preferences and WonderPlan will arrange sample ideas into a flexible itinerary.</p><span class="idle-note">Mock planning preview · no AI or live activity search</span></section>`;
}

export function mountPlannerScreen(root: HTMLElement): void {
  const values = defaultValues();
  const minimumDate = localDateString(new Date());
  let viewState: PlannerViewState = 'idle';
  let itinerary: Itinerary | null = null;
  let errorMessage = 'Check the selected date and try again.';
  let variation = 0;

  const renderOutput = (): void => {
    const output = root.querySelector<HTMLElement>('#planner-output');
    if (output) output.innerHTML = outputMarkup(viewState, itinerary, errorMessage);
  };

  root.innerHTML = `<div class="planner-screen">
    <span class="sr-only" id="planner-announcement" aria-live="polite"></span>
    <header class="planner-page-heading"><div><p class="planner-page-kicker"><span aria-hidden="true">✦</span> A LITTLE HELP MAKING A PLAN</p><h1>What should we do?</h1><p>Tell us what your family needs today. We’ll turn it into a gentle starting point.</p></div><div class="planner-header-art" aria-hidden="true"><span>✧</span><span>☁</span><span>✈</span></div></header>
    <div class="planner-layout">
      <div class="planner-form-column">${PlannerInput(mockChildren, values, minimumDate)}<p class="planner-local-note">Budget and travel range are preferences only. These mock ideas don’t include verified venue, distance, or price information.</p></div>
      <div class="planner-result-column"><div id="planner-output" aria-live="polite">${outputMarkup(viewState, itinerary, errorMessage)}</div></div>
    </div>
    <p class="planner-footer-note">A thoughtful suggestion, not a schedule to stick to.</p>
  </div>`;

  const generate = async (request: PlannerRequest): Promise<void> => {
    viewState = 'loading';
    itinerary = null;
    renderOutput();
    const output = root.querySelector<HTMLElement>('#planner-output');
    if (output && window.matchMedia('(prefers-reduced-motion: reduce)').matches) output.scrollIntoView({ block: 'nearest' });

    try {
      itinerary = await createMockPlan(request);
      viewState = itinerary ? 'generated' : 'empty';
    } catch (error) {
      viewState = 'error';
      errorMessage = error instanceof Error ? error.message : 'Please try again in a moment.';
    }
    renderOutput();
    root.querySelector<HTMLElement>('#planner-output')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' });
  };

  root.addEventListener('submit', (event) => {
    if (!(event.target instanceof HTMLFormElement) || event.target.id !== 'planner-form') return;
    event.preventDefault();
    const formData = new FormData(event.target);
    const request: PlannerRequest = {
      childIds: formData.getAll('children').map(String),
      date: String(formData.get('date') || ''),
      budget: String(formData.get('budget') || 'ANY'),
      distanceKm: Number(formData.get('distanceKm') || 30),
      activityType: String(formData.get('activityType') || 'ANY') as PlannerRequest['activityType'],
      environment: String(formData.get('environment') || 'ANY') as PlannerRequest['environment'],
      timeOfDay: String(formData.get('timeOfDay') || 'ANY') as PlannerRequest['timeOfDay'],
      variation,
    };
    void generate(request);
  });

  root.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const quickAction = event.target.closest<HTMLButtonElement>('[data-quick-action]');
    if (quickAction) {
      const action = quickAction.dataset.quickAction || '';
      if (action === 'surprise') variation += 1;
      applyQuickAction(root, values, action);
      return;
    }

    const plannerAction = event.target.closest<HTMLButtonElement>('[data-planner-action]');
    if (!plannerAction) return;
    const action = plannerAction.dataset.plannerAction;
    if (action === 'adjust') {
      root.querySelector<HTMLElement>('#planner-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      root.querySelector<HTMLElement>('#planner-date')?.focus();
    } else if (action === 'another') {
      variation += 1;
      const form = root.querySelector<HTMLFormElement>('#planner-form');
      if (form) form.requestSubmit();
    } else if (action === 'retry') {
      const form = root.querySelector<HTMLFormElement>('#planner-form');
      if (form) form.requestSubmit();
    } else if (action === 'broaden') {
      const typeSelect = root.querySelector<HTMLSelectElement>('[name="activityType"]');
      const environment = root.querySelector<HTMLInputElement>('[name="environment"][value="ANY"]');
      if (typeSelect) typeSelect.value = 'ANY';
      if (environment) environment.checked = true;
      const time = root.querySelector<HTMLInputElement>('[name="timeOfDay"][value="ANY"]');
      if (time) time.checked = true;
      root.querySelector<HTMLFormElement>('#planner-form')?.requestSubmit();
    }
  });
}

function applyQuickAction(root: HTMLElement, values: PlannerFormValues, action: string): void {
  const currentDate = root.querySelector<HTMLInputElement>('[name="date"]');
  const currentBudget = root.querySelector<HTMLSelectElement>('[name="budget"]');
  const currentDistance = root.querySelector<HTMLSelectElement>('[name="distanceKm"]');
  const currentType = root.querySelector<HTMLSelectElement>('[name="activityType"]');
  const currentEnvironment = root.querySelector<HTMLInputElement>('[name="environment"]:checked');
  const currentTime = root.querySelector<HTMLInputElement>('[name="timeOfDay"]:checked');
  values.date = currentDate?.value ?? values.date;
  values.budget = currentBudget?.value ?? values.budget;
  values.distanceKm = Number(currentDistance?.value ?? values.distanceKm);
  values.activityType = (currentType?.value as PlannerFormValues['activityType'] | undefined) ?? values.activityType;
  values.environment = (currentEnvironment?.value as PlannerFormValues['environment'] | undefined) ?? values.environment;
  values.timeOfDay = (currentTime?.value as PlannerFormValues['timeOfDay'] | undefined) ?? values.timeOfDay;

  const today = new Date();
  if (action === 'today') values.date = localDateString(today);
  if (action === 'tomorrow') {
    today.setDate(today.getDate() + 1);
    values.date = localDateString(today);
  }
  if (action === 'weekend') {
    const daysUntilSaturday = (6 - today.getDay() + 7) % 7;
    today.setDate(today.getDate() + daysUntilSaturday);
    values.date = localDateString(today);
  }
  if (action === 'outdoors') {
    values.activityType = 'OUTDOORS';
    values.environment = 'OUTDOOR';
  }
  if (action === 'educational') values.activityType = 'EDUCATIONAL';
  if (action === 'surprise') {
    values.activityType = 'ANY';
    values.environment = 'ANY';
    values.timeOfDay = 'ANY';
  }

  const dateInput = root.querySelector<HTMLInputElement>('[name="date"]');
  const activityType = root.querySelector<HTMLSelectElement>('[name="activityType"]');
  if (dateInput) dateInput.value = values.date;
  if (activityType) activityType.value = values.activityType;
  root.querySelectorAll<HTMLInputElement>('[name="environment"]').forEach((input) => { input.checked = input.value === values.environment; });
  root.querySelectorAll<HTMLInputElement>('[name="timeOfDay"]').forEach((input) => { input.checked = input.value === values.timeOfDay; });
  const announcement = root.querySelector<HTMLElement>('#planner-announcement');
  if (announcement) announcement.textContent = `Preferences updated: ${action === 'weekend' ? 'This weekend' : action}.`;
}
