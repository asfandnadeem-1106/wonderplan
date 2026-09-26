export function MatchBadge(score: number): string {
  return `<span class="match-badge" aria-label="Sample match score ${score} percent"><span class="match-badge-label">SAMPLE MATCH</span><strong>${score}%</strong></span>`;
}
