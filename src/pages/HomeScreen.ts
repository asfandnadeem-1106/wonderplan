import { mockChildren, mockRecommendations, newIdeas, weekendIdeas } from '../data/mockHomeData';
import type { ChildProfilePreview } from '../types/activity';
import { AIPlannerHero } from '../components/AIPlannerHero';
import { ChildSwitcher } from '../components/ChildSwitcher';
import { RecommendationSection } from '../components/RecommendationSection';

type ScreenState = 'loading' | 'ready';

export function mountHomeScreen(root: HTMLElement): void {
  let activeChild = mockChildren[0];
  const savedIds = new Set<string>();

  const render = (screenState: ScreenState): void => {
    root.innerHTML = homeMarkup(activeChild, savedIds, screenState);
  };

  root.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;

    const childButton = event.target.closest<HTMLButtonElement>('[data-child-id]');
    if (childButton) {
      const selectedChild = mockChildren.find((child) => child.id === childButton.dataset.childId);
      if (selectedChild) {
        activeChild = selectedChild;
        render('ready');
        root.querySelector<HTMLButtonElement>(`[data-child-id="${activeChild.id}"]`)?.focus();
        const announcement = root.querySelector<HTMLElement>('#home-announcement');
        if (announcement) announcement.textContent = `Showing recommendations for ${activeChild.name}.`;
      }
      return;
    }

    const saveButton = event.target.closest<HTMLButtonElement>('[data-save-id]');
    if (saveButton) {
      const activityId = saveButton.dataset.saveId;
      if (!activityId) return;
      const saved = !savedIds.has(activityId);
      if (saved) savedIds.add(activityId);
      else savedIds.delete(activityId);
      saveButton.classList.toggle('is-saved', saved);
      saveButton.setAttribute('aria-pressed', String(saved));
      const activity = [...mockRecommendations[activeChild.id], ...weekendIdeas, ...newIdeas].find((item) => item.id === activityId);
      saveButton.setAttribute('aria-label', `${saved ? 'Remove from saved ideas' : 'Save idea'}: ${activity?.title ?? 'activity'}`);
      saveButton.innerHTML = `<span aria-hidden="true">${saved ? '♥' : '♡'}</span>`;
      const announcement = root.querySelector<HTMLElement>('#home-announcement');
      if (announcement) announcement.textContent = saved ? 'Idea saved.' : 'Idea removed from saved ideas.';
      return;
    }

    const carouselButton = event.target.closest<HTMLButtonElement>('[data-carousel-scroll]');
    if (carouselButton) {
      const carouselId = carouselButton.dataset.carouselTarget;
      const direction = Number(carouselButton.dataset.carouselScroll);
      const carousel = carouselId ? root.querySelector<HTMLElement>(`#${carouselId}`) : null;
      const firstSlide = carousel?.querySelector<HTMLElement>('.carousel-slide');
      if (carousel && firstSlide) {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        carousel.scrollBy({ left: direction * (firstSlide.offsetWidth + 16), behavior: reduceMotion ? 'instant' : 'smooth' });
      }
    }
  });

  render('loading');
  window.setTimeout(() => render('ready'), 450);
}

function homeMarkup(child: ChildProfilePreview, savedIds: Set<string>, screenState: ScreenState): string {
  const reason = child.id === 'adam' ? 'Because he loves aircraft.' : 'Because she loves animals, art, and nature.';
  const childRecommendations = mockRecommendations[child.id] ?? [];

  return `<div class="home-screen">
    <div class="home-announcement sr-only" id="home-announcement" aria-live="polite"></div>
    <header class="home-intro">
      <div><p class="home-eyebrow">YOUR FAMILY’S LITTLE ADVENTURE GUIDE</p><h1>Good morning, Asfand <span aria-hidden="true">👋</span></h1><p>Thoughtful ideas for making your time together count.</p></div>
      ${ChildSwitcher(mockChildren, child.id)}
    </header>

    ${AIPlannerHero()}

    <div class="sample-data-note" role="note"><span aria-hidden="true">✳</span><p><strong>Sample ideas for preview</strong><br>These are mock suggestions, not verified local listings. Check official sources for dates, access, and other details.</p></div>

    ${RecommendationSection({ id: 'for-child', title: `For ${child.name}`, subtitle: reason, activities: childRecommendations, savedIds, state: screenState })}
    ${RecommendationSection({ id: 'this-weekend', title: 'This weekend', subtitle: 'Flexible ideas to shape around your family.', activities: weekendIdeas, savedIds, state: screenState })}
    ${RecommendationSection({ id: 'try-something-new', title: 'Try something new', subtitle: 'A few fresh ways to follow a favourite curiosity.', activities: newIdeas, savedIds, state: screenState })}
    <p class="home-footer-note">WonderPlan helps you get inspired. Confirm local details before heading out.</p>
  </div>`;
}
