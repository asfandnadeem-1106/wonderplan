import type { ChildProfilePreview } from '../types/activity';

export function ChildSwitcher(children: ChildProfilePreview[], activeId: string): string {
  return `<div class="child-switcher" role="group" aria-label="Choose a child">
    ${children.map((child) => `<button class="child-option${child.id === activeId ? ' is-selected' : ''}" type="button" data-child-id="${child.id}" aria-pressed="${child.id === activeId}"><span class="child-avatar" aria-hidden="true">${child.name.charAt(0)}</span>${child.name}</button>`).join('')}
  </div>`;
}
