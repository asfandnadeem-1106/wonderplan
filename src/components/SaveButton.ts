export function SaveButton(activityId: string, saved = false): string {
  return `<button class="detail-action-button save-detail-button${saved ? ' is-saved' : ''}" type="button" data-detail-save="${activityId}" aria-pressed="${saved}" aria-label="${saved ? 'Remove from saved ideas' : 'Save this idea'}"><span aria-hidden="true">${saved ? '♥' : '♡'}</span><span>${saved ? 'Saved' : 'Save idea'}</span></button>`;
}
