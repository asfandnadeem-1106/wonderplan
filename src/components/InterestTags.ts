export function InterestTags(interests: string[]): string {
  if (!interests.length) return '';
  return `<div class="interest-tags" aria-label="Matching interests">${interests.map((interest) => `<span>${interest}</span>`).join('')}</div>`;
}
