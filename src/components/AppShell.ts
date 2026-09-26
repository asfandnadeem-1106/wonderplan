type NavigationItem = {
  label: string;
  href: string;
  icon: string;
  emphasis?: boolean;
};

const desktopPrimary: NavigationItem[] = [
  { label: 'Home', href: '/home', icon: 'home' },
  { label: 'Explore', href: '#explore', icon: 'compass' },
  { label: 'Plan', href: '/plan', icon: 'spark', emphasis: true },
  { label: 'Calendar', href: '#calendar', icon: 'calendar' },
  { label: 'Saved', href: '#saved', icon: 'bookmark' },
];

const desktopSecondary: NavigationItem[] = [
  { label: 'Children', href: '#children', icon: 'users' },
  { label: 'Settings', href: '#settings', icon: 'settings' },
];

const mobileItems: NavigationItem[] = [
  { label: 'Home', href: '/home', icon: 'home' },
  { label: 'Explore', href: '#explore', icon: 'compass' },
  { label: 'Plan', href: '/plan', icon: 'spark', emphasis: true },
  { label: 'Saved', href: '#saved', icon: 'bookmark' },
  { label: 'Profile', href: '#profile', icon: 'users' },
];

const paths: Record<string, string> = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.3 5.1-5.2 2.4 2.4-5.2z"/>',
  spark: '<path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2zM19 15l1.1 2.9L23 19l-2.9 1.1L19 23l-1.1-2.9L15 19l2.9-1.1z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  bookmark: '<path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-4-6 4z"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 8v6m3-3h-6"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.8 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.8-1l-1.7.6-1.4-2.4L7.1 15a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.8-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.8 1l1.7-.6 1.4 2.4-1.4 1.1a8 8 0 0 1-.1 2Z"/>',
  pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  chevron: '<path d="m7 10 5 5 5-5"/>',
};

function icon(name: string): string {
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] ?? paths.spark}</svg>`;
}

function navigation(items: NavigationItem[], className: string, current = false): string {
  const label = className === 'mobile-navigation' ? 'Mobile navigation' : className.includes('secondary') ? 'Family navigation' : 'Primary navigation';
  return `<nav class="${className}" aria-label="${label}">${items.map((item) => {
    const active = current && item.href === window.location.pathname;
    return `<a class="navigation-link${active ? ' is-active' : ''}${item.emphasis ? ' is-emphasized' : ''}" href="${item.href}"${active ? ' aria-current="page"' : ''}>${icon(item.icon)}<span>${item.label}</span></a>`;
  }).join('')}</nav>`;
}

export function mountAppShell(root: HTMLElement): HTMLElement {
  root.innerHTML = `
    <div class="app-shell">
      <a class="skip-link" href="#page-content">Skip to content</a>
      <aside class="desktop-sidebar" aria-label="WonderPlan">
        <a class="brand" href="/home" aria-label="WonderPlan home">
          <span class="brand-mark">${icon('spark')}</span>
          <span class="brand-name">wonder<span>plan</span><small>little moments, big memories</small></span>
        </a>
        <span class="sidebar-label">YOUR SPACE</span>
        ${navigation(desktopPrimary, 'desktop-navigation', true)}
        <span class="sidebar-label sidebar-label-secondary">FAMILY</span>
        ${navigation(desktopSecondary, 'desktop-navigation desktop-navigation-secondary')}
        <div class="sidebar-footer"><span class="footer-mark">✳</span><span>Thoughtful plans for your family</span></div>
      </aside>

      <div class="app-frame">
        <header class="app-header">
          <a class="mobile-brand" href="/home" aria-label="WonderPlan home"><span class="brand-mark">${icon('spark')}</span><span class="brand-name">wonder<span>plan</span></span></a>
          <div class="header-context"><span class="header-eyebrow">YOUR FAMILY’S ACTIVITY PLANNER</span><span class="header-page-title">${window.location.pathname === '/plan' ? 'Plan' : 'Home'}</span></div>
          <div class="header-actions">
            <button class="location-button" type="button" aria-label="Location preference">
              ${icon('pin')}<span>Location</span>${icon('chevron')}
            </button>
            <button class="profile-button" type="button" aria-label="Parent profile">P</button>
          </div>
        </header>
        <main id="page-content" class="app-content" tabindex="-1"></main>
      </div>
      ${navigation(mobileItems, 'mobile-navigation', true)}
    </div>`;

  return root.querySelector<HTMLElement>('#page-content')!;
}
