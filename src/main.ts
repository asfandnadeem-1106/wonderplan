import { mountAppShell } from './components/AppShell';
import { mountActivityDetailScreen } from './components/ActivityDetailScreen';
import { mountPlannerScreen } from './pages/PlannerScreen';
import { mountHomeScreen } from './pages/HomeScreen';
import './style.css';
import './pages/home.css';
import './pages/activity-detail.css';
import './pages/planner.css';

const app = document.querySelector<HTMLElement>('#app');

if (app) {
  if (window.location.pathname === '/') {
    window.history.replaceState({}, '', '/home');
  }
  const content = mountAppShell(app);
  if (window.location.pathname === '/home') {
    mountHomeScreen(content);
  } else if (window.location.pathname === '/plan') {
    mountPlannerScreen(content);
  } else {
    const activityRoute = window.location.pathname.match(/^\/activities\/([^/]+)\/?$/);
    if (activityRoute?.[1]) {
      try {
        mountActivityDetailScreen(content, decodeURIComponent(activityRoute[1]));
      } catch {
        mountActivityDetailScreen(content, '');
      }
    }
  }
}

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  });
}
