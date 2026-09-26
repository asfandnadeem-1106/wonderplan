import type { Activity } from '../types/activity';

export function MatchExplanation(activity: Activity, childName = 'Adam'): string {
  const interests = activity.matchReasons.length ? activity.matchReasons.join(' and ') : 'your family’s interests';
  return `<section class="match-explanation" aria-labelledby="match-explanation-title">
    <span class="explanation-icon" aria-hidden="true">✦</span>
    <div><p class="detail-section-eyebrow">A THOUGHTFUL FIT</p><h2 id="match-explanation-title">Why we recommend it</h2>
      <p>${childName}’s interest in ${interests} makes this idea a natural place to start together.</p>
      <p class="explanation-sample-note">This explanation and the ${activity.matchPercentage}% score are examples from mock data, not an AI-generated assessment.</p>
    </div>
  </section>`;
}
