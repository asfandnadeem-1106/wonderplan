import './style.css';
import { createClient } from '@supabase/supabase-js';

const config = { url: import.meta.env.VITE_SUPABASE_URL, key: import.meta.env.VITE_SUPABASE_ANON_KEY };
const supabase = config.url && config.key && !config.url.includes('your-project')
  ? createClient(config.url, config.key)
  : null;

const suggestions = [
  { id: 'aviation', title: 'A closer look at the skies', category: 'BIG ADVENTURE', emoji: '✈️', color: 'peach', distance: 'A day out', price: 'Plan together', copy: 'A family aviation visit, with plenty of time for curious questions.', tags: ['Aircraft', 'Science', 'Outdoors'], kind: 'place', source: null },
  { id: 'makers', title: 'Make something with your hands', category: 'MAKE & CREATE', emoji: '🧩', color: 'lilac', distance: 'At home or nearby', price: 'Any budget', copy: 'Try a small build challenge inspired by the things your child already loves.', tags: ['LEGO', 'Creative', 'At home'], kind: 'home', source: null },
  { id: 'trail', title: 'A little trail, a lot to notice', category: 'GET OUTSIDE', emoji: '🌿', color: 'sage', distance: 'Choose your own route', price: 'Free idea', copy: 'Turn a gentle family walk into a hunt for birds, leaves and tiny details.', tags: ['Nature', 'Movement', 'Family'], kind: 'outdoor', source: null },
  { id: 'stargaze', title: 'An evening under the stars', category: 'LOOK UP', emoji: '🌙', color: 'blue', distance: 'After sunset', price: 'Free idea', copy: 'Pick a few constellations to find together, then invent a story about them.', tags: ['Space', 'Science', 'At home'], kind: 'home', source: null },
];

const interestOptions = ['Football', 'Gaming', 'Space', 'Aircraft', 'Dinosaurs', 'Art', 'Robots', 'Animals', 'Books', 'Outdoors', 'Science', 'Swimming'];
const goalOptions = ['Move more', 'Spend time outside', 'Learn something new', 'Make things', 'Family time', 'Try new experiences'];
const key = 'wonderplan-demo-v1';
const readLocal = () => { try { return JSON.parse(localStorage.getItem(key)) || {}; } catch { return {}; } };
const local = readLocal();
const state = {
  page: 'home', child: local.child || { name: 'your explorer', age: '', interests: ['Space', 'Outdoors', 'Science'] },
  goals: local.goals || ['Spend time outside', 'Try new experiences'],
  city: local.city || 'Islamabad', radius: local.radius || '30 km', budget: local.budget || 'PKR 5,000',
  saved: new Set(local.saved || []), completed: new Set(local.completed || []),
  user: null, busy: false, filter: 'All ideas', modal: '', toast: '', remoteActivities: [], authMode: 'signin',
};
const persist = () => localStorage.setItem(key, JSON.stringify({ child: state.child, goals: state.goals, city: state.city, radius: state.radius, budget: state.budget, saved: [...state.saved], completed: [...state.completed] }));
const esc = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const icons = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.3 5.1-5.2 2.4 2.4-5.2z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  heart: '<path d="M20.8 8.8c0 4.5-8.8 10.2-8.8 10.2S3.2 13.3 3.2 8.8A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.6Z"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 8v6m3-3h-6"/>',
  spark: '<path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2zM19 15l1.1 2.9L23 19l-2.9 1.1L19 23l-1.1-2.9L15 19l2.9-1.1z"/>',
  pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  arrow: '<path d="M5 12h14m-7-7 7 7-7 7"/>',
  close: '<path d="m18 6-12 12M6 6l12 12"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
};
const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.spark}</svg>`;

function card(item, index = 0) {
  const saved = state.saved.has(item.id);
  const done = state.completed.has(item.id);
  return `<article class="activity-card ${item.color}" style="--delay:${index * 60}ms">
    <div class="card-art"><span class="art-emoji">${item.emoji}</span><span class="card-label">${esc(item.category)}</span>
      <button class="save-button ${saved ? 'is-saved' : ''}" data-save="${esc(item.id)}" aria-label="${saved ? 'Remove saved idea' : 'Save idea'}">${icon('heart')}</button></div>
    <div class="card-body"><div class="card-meta"><span>${icon('pin')}${esc(item.distance)}</span><span>${esc(item.price)}</span></div>
      <h3>${esc(item.title)}</h3><p>${esc(item.copy)}</p>
      <div class="card-tags">${item.tags.map((tag) => `<span>${esc(tag)}</span>`).join('')}</div>
      <div class="card-foot"><span class="sample-note">${done ? `${icon('check')} Tried together` : item.isVerified ? `${icon('check')} Verified source` : 'A WonderPlan idea'}</span><button class="text-link" data-detail="${esc(item.id)}">Explore ${icon('arrow')}</button></div>
    </div></article>`;
}

function navItem(page, label, glyph, count = '') {
  return `<button class="nav-item ${state.page === page ? 'active' : ''}" data-page="${page}">${icon(glyph)}<span>${label}</span>${count ? `<span class="nav-count">${count}</span>` : ''}</button>`;
}

function render() {
  const childName = state.child.name && state.child.name !== 'your explorer' ? state.child.name : 'your explorer';
  const savedItems = suggestions.filter((item) => state.saved.has(item.id));
  const title = state.page === 'home' ? 'Made for your family' : state.page === 'explore' ? 'Find your next little adventure' : state.page === 'planner' ? 'Make room for a good day' : state.page === 'saved' ? 'Ideas you’ve tucked away' : 'Your little crew';
  document.querySelector('#app').innerHTML = `
    <aside class="sidebar">
      <a class="brand" href="#" data-page="home"><span class="brand-mark">${icon('spark')}</span><span> wonder<span>plan</span><small>little moments, big memories</small></span></a>
      <div class="side-label">YOUR SPACE</div>
      <nav class="main-nav">${navItem('home', 'For you', 'home')}${navItem('explore', 'Explore', 'compass')}${navItem('planner', 'Weekend planner', 'calendar')}${navItem('saved', 'Saved ideas', 'heart', state.saved.size || '')}</nav>
      <div class="sidebar-bottom"><div class="mini-family"><div class="avatar avatar-small">${state.child.name && state.child.name !== 'your explorer' ? esc(state.child.name[0].toUpperCase()) : '✦'}</div><div><strong>${esc(childName)}</strong><span>${state.child.age ? `${esc(state.child.age)} years old` : 'Add your child profile'}</span></div><button class="more-button" data-modal="profile" aria-label="Edit family profile">•••</button></div>
        <div class="sidebar-note"><span class="note-star">✳</span><p>Better ideas start with what makes them <em>them.</em></p><button data-modal="profile">Personalise your plan ${icon('arrow')}</button></div>
        <button class="account-button" data-modal="auth">${icon('users')}<span>${state.user ? esc(state.user.email) : 'Parent account'}<small>${state.user ? 'Signed in' : 'Connect an account'}</small></span>${icon('arrow')}</button>
      </div>
    </aside>
    <main class="main-shell">
      <header class="topbar"><div class="mobile-brand"><span class="brand-mark">${icon('spark')}</span> wonder<span>plan</span></div><div class="location-pill" data-modal="location">${icon('pin')}<span>${esc(state.city)}, Pakistan</span><span class="chevron">⌄</span></div><div class="topbar-right"><span class="today-label">A little wonder goes a long way</span><button class="top-avatar" data-modal="profile">${state.child.name && state.child.name !== 'your explorer' ? esc(state.child.name[0].toUpperCase()) : '✦'}</button></div></header>
      <div class="content-wrap">
        <div class="page-intro"><div><div class="eyebrow"><span class="eyebrow-dot"></span> YOUR FAMILY’S LITTLE ADVENTURE GUIDE</div><h1>${title}</h1><p>${state.page === 'home' ? 'Thoughtful ideas for making your time together count.' : state.page === 'planner' ? 'A lovely plan doesn’t need to be complicated.' : state.page === 'saved' ? 'Come back to the things that caught your eye.' : state.page === 'explore' ? 'Big outings, small moments, and everything in between.' : 'The details that help us find a better fit.'}</p></div><button class="profile-chip" data-modal="profile"><span class="profile-chip-emoji">🪁</span><span><strong>${esc(state.child.name === 'your explorer' ? 'Your family' : `${state.child.name}’s picks`)}</strong><small>${state.child.interests.length} interests</small></span>${icon('arrow')}</button></div>
        ${state.page === 'home' ? homePage(childName) : state.page === 'explore' ? explorePage() : state.page === 'planner' ? plannerPage() : state.page === 'saved' ? savedPage(savedItems) : familyPage()}
      </div>
      <footer class="app-footer"><span>Made for the moments that matter <span class="footer-heart">♥</span></span><span>Ideas are inspiration. Confirm local details before heading out.</span></footer>
    </main>
    ${mobileNav()}
    ${state.modal ? modalMarkup() : ''}
    <div class="toast ${state.toast ? 'show' : ''}">${icon('check')}<span>${esc(state.toast)}</span></div>`;
  bindEvents();
}

function homePage(childName) {
  const first = state.child.name && state.child.name !== 'your explorer' ? ` for ${esc(state.child.name)}` : '';
  return `<section class="hero-grid"><div class="hero-card"><div class="hero-copy"><span class="hero-kicker"><span>✦</span> A LITTLE MORE WONDER</span><h2>Make an ordinary<br>day feel <em>extraordinary.</em></h2><p>Good ideas don’t need a big occasion. Find something lovely to do together, right where you are.</p><button class="button button-yellow" data-page="planner">Plan a day together ${icon('arrow')}</button><div class="hero-assurance"><span class="assurance-avatars"><i>☀</i><i>✿</i><i>↗</i></span><span>Thoughtful ideas, picked with your family in mind</span></div></div><div class="hero-illustration"><div class="sun-shape"></div><span class="sparkle s1">✦</span><span class="sparkle s2">✧</span><span class="sparkle s3">·</span><div class="hill hill-back"></div><div class="hill hill-front"></div><div class="family-illustration"><span class="grownup">🧑🏻‍🦱</span><span class="kid">🧒🏻</span><span class="kite">🪁</span></div><span class="hero-sticker">Make<br>memories<br>together</span></div><span class="hero-doodle">↗</span></div>
      <aside class="weekend-card"><div class="weekend-top"><span class="weekend-icon">✦</span><span class="weekend-label">YOUR WEEKEND, YOUR WAY</span><span class="weekend-dots">•••</span></div><div class="weekend-date"><div class="date-badge"><span>SEP</span><strong>27</strong></div><div><strong>A weekend to look forward to</strong><span>Pick the kind of day you’re in the mood for.</span></div></div><div class="day-weather"><span>☀️</span><span>Sunny-day or stay-in-day?</span><small>YOU CHOOSE</small></div><button class="weekend-action" data-page="planner">Make a simple plan ${icon('arrow')}</button><div class="weekend-bottom"><span>${icon('clock')} Takes about a minute</span><span>✦ No pressure, just ideas</span></div></aside></section>
    <section class="insight-strip"><div class="insight-icon">${icon('spark')}</div><p><strong>A little note about ${esc(childName)}</strong><span>${state.child.interests.length ? `Ideas can follow their love of ${state.child.interests.slice(0, 2).map(esc).join(' and ')} — and leave room for a happy surprise.` : 'Add a few interests to make these ideas feel more like your family.'}</span></p><button data-modal="profile">${state.child.interests.length ? 'Tune their interests' : 'Add interests'} ${icon('arrow')}</button></section>
    <section class="section-heading"><div><div class="eyebrow">A FEW GOOD PLACES TO START</div><h2>Little ideas, big potential</h2><p>Things to try together${first} — without needing a special occasion.</p></div><button class="quiet-button" data-page="explore">See all ideas ${icon('arrow')}</button></section>
    <section class="activity-grid">${rankedIdeas().length ? rankedIdeas().slice(0, 3).map(card).join('') : emptyInventory()}</section>
    <section class="closing-banner"><div class="closing-flower">✿</div><div><span>GOOD THINGS GROW TOGETHER</span><h3>Small plans. Favourite people. <em>Lovely memories.</em></h3></div><button data-page="planner">Plan something small ${icon('arrow')}</button></section>`;
}

function rankedIdeas() {
  const interests = state.child.interests.map((value) => value.toLowerCase());
  const items = supabase ? state.remoteActivities : suggestions;
  return items.map((item) => ({ ...item, score: item.tags.filter((tag) => interests.some((interest) => tag.toLowerCase().includes(interest) || interest.includes(tag.toLowerCase()))).length }))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
}

function explorePage() {
  const filters = ['All ideas', 'At home', 'Outdoors', 'Make & create'];
  const shown = rankedIdeas().filter((item) => state.filter === 'All ideas' || (state.filter === 'At home' ? item.kind === 'home' : state.filter === 'Outdoors' ? item.kind === 'outdoor' || item.kind === 'place' : item.kind === 'home' && item.tags.includes('Creative')));
  return `<div class="explore-callout"><span class="callout-icon">✧</span><div><strong>${supabase ? 'Source-verified local activities' : 'A note about these ideas'}</strong><p>${supabase ? 'Only published activities with verified, current source details appear here.' : 'These are starting points, not verified event listings. Connect Supabase and publish sourced activities to show real local listings.'}</p></div><span class="demo-pill">${supabase ? 'VERIFIED' : 'DEMO IDEAS'}</span></div><div class="filter-row">${filters.map((filter) => `<button class="filter-chip ${state.filter === filter ? 'selected' : ''}" data-filter="${esc(filter)}">${esc(filter)}</button>`).join('')}<span class="filter-spacer"></span><span class="result-count">${shown.length} ${supabase ? 'verified activities' : 'thoughtful ideas'}</span></div><section class="activity-grid">${shown.length ? shown.map(card).join('') : emptyInventory()}</section>`;
}

function plannerPage() {
  const selected = suggestions.filter((item) => state.saved.has(item.id));
  return `<section class="planner-hero"><div><span class="hero-kicker"><span>✦</span> A GENTLE PLAN, JUST FOR YOU</span><h2>What kind of day<br>sounds <em>good?</em></h2><p>Choose a few little details. We’ll help you shape a day around the people you love.</p></div><div class="planner-sun">☀️<span>TAKE IT<br>AS IT COMES</span></div></section><div class="planner-layout"><section class="planner-form"><div class="step-title"><span>01</span><div><h3>Pick your pace</h3><p>There’s no wrong kind of weekend.</p></div></div><div class="choice-row" data-choice="pace">${['A little adventure', 'Slow & cosy', 'Mix of both'].map((value, index) => `<button class="choice-card ${index === 2 ? 'chosen' : ''}" data-value="${esc(value)}"><span>${['🌿', '🧸', '🎈'][index]}</span>${value}</button>`).join('')}</div><div class="step-title"><span>02</span><div><h3>Who’s coming along?</h3><p>We’ll keep their favourite things in mind.</p></div></div><div class="child-select"><span class="child-select-avatar">${state.child.name !== 'your explorer' ? esc(state.child.name[0].toUpperCase()) : '✦'}</span><span><strong>${state.child.name === 'your explorer' ? 'Our little crew' : esc(state.child.name)}</strong><small>${state.child.interests.slice(0, 3).map(esc).join(' · ') || 'Add interests to personalise the plan'}</small></span><span class="selected-check">${icon('check')}</span></div><div class="step-title"><span>03</span><div><h3>Keep it comfortable</h3><p>Just a guide — change this any time.</p></div></div><div class="comfort-row"><label>Budget<select id="planner-budget"><option>Free & easy</option><option>Under PKR 2,000</option><option selected>${esc(state.budget)}</option><option>Any budget</option></select></label><label>How far?<select id="planner-radius"><option>Nearby · 10 km</option><option selected>${esc(state.radius)}</option><option>Day trip · 100 km</option></select></label></div><button class="button button-primary make-plan" id="make-plan">${icon('spark')} Make my little plan ${icon('arrow')}</button><span class="planner-hint">${icon('heart')} A suggestion to shape together, not a schedule to stick to.</span></section><aside class="plan-preview" id="plan-preview"><div class="preview-paper"><div class="preview-top"><span>YOUR DAY, GENTLY PLANNED</span><span>✳</span></div><h3>A day made of<br><em>little moments.</em></h3><p>Choose your pace and we’ll find a lovely way to begin.</p><div class="preview-line"><span class="timeline-dot">☀</span><span><strong>A soft start</strong><small>Take your time getting out the door</small></span></div><div class="preview-line"><span class="timeline-dot lilac-dot">✿</span><span><strong>A moment to remember</strong><small>One small thing you’ll talk about later</small></span></div><div class="preview-line"><span class="timeline-dot peach-dot">☕</span><span><strong>Room to just be</strong><small>Every good day needs a little breathing space</small></span></div><div class="preview-foot">${icon('spark')} MADE FOR YOUR FAMILY</div></div></aside></div>`;
}

function savedPage(items) {
  return items.length ? `<div class="saved-intro"><span>♡</span><p>Your saved ideas are a lovely place to start. Whenever you’re ready, pick one and make it yours.</p></div><section class="activity-grid">${items.map(card).join('')}</section>` : `<div class="empty-state"><span class="empty-art">♡</span><h2>A little space for later</h2><p>Tap the heart on an idea you like, and it’ll be waiting here when the moment feels right.</p><button class="button button-primary" data-page="explore">Find an idea ${icon('arrow')}</button></div>`;
}

function emptyInventory() {
  return `<div class="inventory-empty"><span>✧</span><strong>${supabase ? 'A little quiet here for now.' : 'Connect your family profile to keep ideas in sync.'}</strong><p>${supabase ? 'Only verified, published activities are shown. Add curated activities in your Supabase database and they’ll appear here.' : 'These demo ideas are only a starting point. Set up Supabase to store your family profile and publish source-verified activities.'}</p>${supabase ? '' : '<button class="quiet-button" data-modal="auth">Set up a parent account ' + icon('arrow') + '</button>'}</div>`;
}

function familyPage() {
  return `<div class="family-layout"><section class="family-card"><div class="family-card-top"><span class="family-art">🪁</span><button class="quiet-button" data-modal="profile">Edit details ${icon('arrow')}</button></div><span class="eyebrow">YOUR LITTLE CREW</span><h2>${state.child.name === 'your explorer' ? 'A family of possibility' : `${esc(state.child.name)}’s little world`}</h2><p>We use these details to help ideas feel more like your family. Only a parent account can see them.</p><div class="profile-facts"><div><span>AGE</span><strong>${state.child.age ? `${esc(state.child.age)} years` : 'Not added'}</strong></div><div><span>BASED IN</span><strong>${esc(state.city)}, Pakistan</strong></div><div><span>TRAVEL RADIUS</span><strong>${esc(state.radius)}</strong></div></div><div class="interest-list"><span class="eyebrow">THINGS THEY LOVE</span><div class="interest-chips">${state.child.interests.map((interest) => `<span>${esc(interest)}</span>`).join('') || '<span>Add some interests to get started</span>'}</div><button class="quiet-button" data-modal="profile">Add an interest ${icon('arrow')}</button></div></section><aside class="goals-card"><span class="eyebrow">LITTLE THINGS YOU’RE ENCOURAGING</span><h3>What would you love a little more of?</h3><div class="goal-list">${state.goals.map((goal) => `<div><span class="goal-check">${icon('check')}</span>${esc(goal)}</div>`).join('') || '<div>Set a family goal</div>'}</div><button class="quiet-button" data-modal="profile">Change family goals ${icon('arrow')}</button></aside></div>`;
}

function mobileNav() {
  return `<nav class="mobile-nav">${navItem('home', 'For you', 'home')}${navItem('explore', 'Explore', 'compass')}${navItem('planner', 'Plan', 'calendar')}${navItem('saved', 'Saved', 'heart', state.saved.size || '')}</nav>`;
}

function modalMarkup() {
  if (state.modal === 'auth') return `<div class="modal-backdrop" data-close><section class="modal-card auth-modal" role="dialog" aria-modal="true"><button class="modal-close" data-close>${icon('close')}</button><span class="modal-illustration">✦</span><div class="eyebrow">A LITTLE SPACE FOR YOUR FAMILY</div><h2>${state.user ? 'You’re all set.' : state.authMode === 'signup' ? 'Start your family’s little plan.' : 'Keep your family’s ideas close.'}</h2><p>${supabase ? state.user ? `Signed in as ${esc(state.user.email)}.` : 'Use a parent email to keep profiles and saved ideas safely linked to your account.' : 'Connect your Supabase project to enable parent accounts and sync your family between devices.'}</p>${supabase && !state.user ? `<form id="auth-form"><label>Email<input name="email" type="email" autocomplete="email" required placeholder="you@example.com"></label><label>Password<input name="password" type="password" autocomplete="${state.authMode === 'signup' ? 'new-password' : 'current-password'}" required minlength="6" placeholder="At least 6 characters"></label><button class="button button-primary" type="submit">${state.authMode === 'signup' ? 'Create parent account' : 'Continue with email'} ${icon('arrow')}</button></form><button class="auth-switch" id="auth-switch">${state.authMode === 'signup' ? 'Already have an account? Sign in' : 'New here? Create a parent account'}</button>` : state.user ? `<button class="button button-primary" id="signout-button">Sign out ${icon('arrow')}</button>` : `<button class="button button-primary" data-close>Sounds good</button>`}<span class="secure-note">${icon('heart')} Parent account only. Children don’t need accounts.</span></section></div>`;
  if (state.modal === 'location') return `<div class="modal-backdrop" data-close><section class="modal-card" role="dialog" aria-modal="true"><button class="modal-close" data-close>${icon('close')}</button><div class="eyebrow">YOUR FAMILY’S HOME BASE</div><h2>Where should we begin?</h2><p>We’ll use your city to help find activities within a comfortable distance.</p><form id="location-form"><label>City<input name="city" value="${esc(state.city)}" maxlength="80" required></label><label>Travel distance<select name="radius"><option ${state.radius === '10 km' ? 'selected' : ''}>10 km</option><option ${state.radius === '30 km' ? 'selected' : ''}>30 km</option><option ${state.radius === '100 km' ? 'selected' : ''}>100 km</option></select></label><button class="button button-primary" type="submit">Save home base ${icon('arrow')}</button></form><span class="secure-note">We only need your city — no precise location.</span></section></div>`;
  const child = state.child;
  return `<div class="modal-backdrop" data-close><section class="modal-card profile-modal" role="dialog" aria-modal="true"><button class="modal-close" data-close>${icon('close')}</button><div class="eyebrow">A FEW DETAILS, A LOT MORE PERSONAL</div><h2>Who are we planning for?</h2><p>A nickname and age are plenty. Add a few favourites so we can look for things that feel like them.</p><form id="profile-form"><div class="form-pair"><label>Child’s name or nickname<input name="name" value="${esc(child.name === 'your explorer' ? '' : child.name)}" maxlength="40" placeholder="e.g. Adam" required></label><label>Age<select name="age"><option value="">Choose</option>${Array.from({ length: 15 }, (_, i) => i + 3).map((age) => `<option value="${age}" ${String(child.age) === String(age) ? 'selected' : ''}>${age} years</option>`).join('')}</select></label></div><label class="form-label">What do they love? <small>Choose a few</small></label><div class="choice-chips">${interestOptions.map((interest) => `<button type="button" class="interest-choice ${child.interests.includes(interest) ? 'chosen' : ''}" data-interest="${esc(interest)}">${esc(interest)}</button>`).join('')}</div><label class="form-label goal-label">Anything you’d like a little more of? <small>Optional</small></label><div class="choice-chips">${goalOptions.map((goal) => `<button type="button" class="goal-choice ${state.goals.includes(goal) ? 'chosen' : ''}" data-goal="${esc(goal)}">${esc(goal)}</button>`).join('')}</div><label>Family budget<select name="budget"><option>Free only</option><option>Under PKR 2,000</option><option ${state.budget === 'PKR 5,000' ? 'selected' : ''}>PKR 5,000</option><option>Under PKR 10,000</option><option>Any budget</option></select></label><button class="button button-primary" type="submit">Save your family’s details ${icon('arrow')}</button></form><span class="secure-note">${icon('heart')} No exact birthday or child account needed.</span></section></div>`;
}

function bindEvents() {
  document.querySelectorAll('[data-page]').forEach((button) => button.addEventListener('click', (event) => { event.preventDefault(); state.page = button.dataset.page; state.modal = ''; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); }));
  document.querySelectorAll('[data-modal]').forEach((button) => button.addEventListener('click', () => { state.modal = button.dataset.modal; render(); }));
  document.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', (event) => { if (event.target === button || button.classList.contains('modal-close')) { state.modal = ''; render(); } }));
  document.querySelectorAll('[data-save]').forEach((button) => button.addEventListener('click', async () => { const id = button.dataset.save; state.saved.has(id) ? state.saved.delete(id) : state.saved.add(id); persist(); await savePreference('saved_activities', id, state.saved.has(id)); notify(state.saved.has(id) ? 'Tucked away for a lovely day.' : 'Removed from your saved ideas.'); render(); }));
  document.querySelectorAll('[data-detail]').forEach((button) => button.addEventListener('click', () => showDetail(button.dataset.detail)));
  document.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => { state.filter = button.dataset.filter; render(); }));
  document.querySelectorAll('[data-interest]').forEach((button) => button.addEventListener('click', () => { const interest = button.dataset.interest; state.child.interests = state.child.interests.includes(interest) ? state.child.interests.filter((value) => value !== interest) : [...state.child.interests, interest]; button.classList.toggle('chosen'); }));
  document.querySelectorAll('[data-goal]').forEach((button) => button.addEventListener('click', () => { const goal = button.dataset.goal; state.goals = state.goals.includes(goal) ? state.goals.filter((value) => value !== goal) : [...state.goals, goal]; button.classList.toggle('chosen'); }));
  document.querySelectorAll('.choice-card').forEach((button) => button.addEventListener('click', () => { button.parentElement.querySelectorAll('.choice-card').forEach((node) => node.classList.remove('chosen')); button.classList.add('chosen'); }));
  document.querySelector('#profile-form')?.addEventListener('submit', saveProfile);
  document.querySelector('#location-form')?.addEventListener('submit', saveLocation);
  document.querySelector('#auth-form')?.addEventListener('submit', signIn);
  document.querySelector('#auth-switch')?.addEventListener('click', () => { state.authMode = state.authMode === 'signup' ? 'signin' : 'signup'; render(); });
  document.querySelector('#signout-button')?.addEventListener('click', async () => { await supabase.auth.signOut(); state.user = null; state.modal = ''; render(); notify('Signed out of your parent account.'); });
  document.querySelectorAll('[data-oauth]').forEach((button) => button.addEventListener('click', () => supabase.auth.signInWithOAuth({ provider: button.dataset.oauth, options: { redirectTo: window.location.origin } })));
  document.querySelector('#make-plan')?.addEventListener('click', makePlan);
}

function notify(message) {
  state.toast = message; render();
  window.setTimeout(() => { state.toast = ''; document.querySelector('.toast')?.classList.remove('show'); }, 2400);
}

async function saveProfile(event) {
  event.preventDefault(); const form = new FormData(event.currentTarget);
  state.child.name = String(form.get('name')).trim(); state.child.age = form.get('age'); state.budget = form.get('budget'); persist();
  if (supabase && state.user) await syncFamily();
  state.modal = ''; notify('Your family’s little world is updated.');
}

async function saveLocation(event) {
  event.preventDefault(); const form = new FormData(event.currentTarget);
  state.city = String(form.get('city')).trim(); state.radius = form.get('radius'); persist();
  if (supabase && state.user) await syncFamily();
  state.modal = ''; notify('Home base saved.');
}

async function savePreference(table, id, add) {
  if (!supabase || !state.user) return;
  const childId = state.child.id;
  if (!childId) return;
  if (table === 'saved_activities') {
    if (add) await supabase.from(table).upsert({ child_id: childId, activity_id: id }, { onConflict: 'child_id,activity_id' });
    else await supabase.from(table).delete().match({ child_id: childId, activity_id: id });
  }
}

async function syncFamily() {
  if (!supabase || !state.user) return;
  let { data: family } = await supabase.from('families').select('id').eq('parent_id', state.user.id).maybeSingle();
  if (!family) {
    const result = await supabase.from('families').insert({ parent_id: state.user.id, city: state.city, radius_km: parseInt(state.radius, 10) || 30, budget_label: state.budget }).select('id').single();
    family = result.data;
  } else {
    await supabase.from('families').update({ city: state.city, radius_km: parseInt(state.radius, 10) || 30, budget_label: state.budget }).eq('id', family.id);
  }
  if (!family) return;
  const childRecord = await supabase.from('children').upsert({ id: state.child.id || undefined, family_id: family.id, nickname: state.child.name, age: state.child.age ? Number(state.child.age) : null, interests: state.child.interests, goals: state.goals }, { onConflict: 'id' }).select('id').single();
  if (childRecord.data) state.child.id = childRecord.data.id;
  persist();
}

async function signIn(event) {
  event.preventDefault(); const form = new FormData(event.currentTarget);
  const request = state.authMode === 'signup'
    ? supabase.auth.signUp({ email: form.get('email'), password: form.get('password'), options: { emailRedirectTo: window.location.origin } })
    : supabase.auth.signInWithPassword({ email: form.get('email'), password: form.get('password') });
  const { data, error } = await request;
  if (error) { notify(error.message); return; }
  if (state.authMode === 'signup' && !data.session) { state.modal = ''; render(); notify('Check your email to confirm your parent account.'); return; }
  state.user = data.user; await syncFamily(); state.modal = ''; notify('Welcome back to your family’s plan.'); render();
}

function showDetail(id) {
  const item = suggestions.find((suggestion) => suggestion.id === id); if (!item) return;
  state.toast = '';
  document.body.insertAdjacentHTML('beforeend', `<div class="modal-backdrop detail-backdrop" data-detail-close><section class="modal-card detail-modal" role="dialog" aria-modal="true"><button class="modal-close" data-detail-close>${icon('close')}</button><span class="detail-art ${item.color}">${item.emoji}</span><div class="eyebrow">${esc(item.category)} · A WONDERPLAN IDEA</div><h2>${esc(item.title)}</h2><p>${esc(item.copy)}</p><div class="detail-why"><strong>Why it could be lovely for your family</strong><span>${item.tags.map((tag) => `✦ ${esc(tag)}`).join('　')}</span></div><div class="detail-note">This is a general idea, not a verified event listing. Check local availability, venue details and costs before you go.</div><div class="detail-actions"><button class="button button-primary" data-save="${esc(item.id)}">${state.saved.has(item.id) ? 'Remove saved idea' : 'Save for later'} ${icon('heart')}</button><button class="quiet-button" data-done="${esc(item.id)}">${state.completed.has(item.id) ? 'Already tried together' : 'We did this together'} ${icon('check')}</button></div></section></div>`);
  document.querySelectorAll('[data-detail-close]').forEach((node) => node.addEventListener('click', (event) => { if (node === event.target || node.classList.contains('modal-close')) node.remove(); }));
  document.querySelector('.detail-modal [data-save]')?.addEventListener('click', async (event) => { const savedId = event.currentTarget.dataset.save; state.saved.has(savedId) ? state.saved.delete(savedId) : state.saved.add(savedId); persist(); await savePreference('saved_activities', savedId, state.saved.has(savedId)); document.querySelector('.detail-backdrop')?.remove(); render(); notify(state.saved.has(savedId) ? 'Tucked away for a lovely day.' : 'Removed from your saved ideas.'); });
  document.querySelector('[data-done]')?.addEventListener('click', (event) => { state.completed.add(event.currentTarget.dataset.done); persist(); document.querySelector('.detail-backdrop')?.remove(); render(); notify('A lovely memory, made.'); });
}

function makePlan() {
  const ordered = rankedIdeas().slice(0, 3);
  const preview = document.querySelector('#plan-preview');
  preview.innerHTML = `<div class="preview-paper"><div class="preview-top"><span>A LITTLE PLAN TO MAKE YOUR OWN</span><span>✳</span></div><h3>${state.child.name === 'your explorer' ? 'Your family’s' : `${esc(state.child.name)}’s`} kind of <em>day.</em></h3><p>A loose idea for ${esc(document.querySelector('#planner-budget').value.toLowerCase())} and a little together time.</p>${ordered.map((item, index) => `<div class="preview-line"><span class="timeline-dot ${index === 1 ? 'lilac-dot' : index === 2 ? 'peach-dot' : ''}">${item.emoji}</span><span><strong>${['Start with a little fresh air', 'Follow a favourite curiosity', 'Keep a cosy idea up your sleeve'][index]}</strong><small>${esc(item.title)}</small></span><button class="tiny-save" data-save="${esc(item.id)}" aria-label="Save idea">♡</button></div>`).join('')}<div class="preview-foot">${icon('spark')} A STARTING POINT — MAKE IT YOURS</div></div>`;
  preview.querySelectorAll('[data-save]').forEach((button) => button.addEventListener('click', () => { state.saved.add(button.dataset.save); persist(); button.textContent = '♥'; notify('Tucked away for a lovely day.'); }));
  notify('Your little plan is ready to make your own.');
}

async function loadRemote() {
  if (!supabase) return;
  const { data: activityRows, error: activityError } = await supabase.from('activities').select('*').eq('status', 'PUBLISHED').eq('verification_status', 'VERIFIED').order('start_at', { ascending: true, nullsFirst: false }).limit(100);
  if (!activityError && activityRows) {
    state.remoteActivities = activityRows.filter((row) => !row.end_at || new Date(row.end_at) >= new Date()).map((row) => {
      const type = row.activity_type || 'FAMILY ACTIVITY';
      const accents = ['peach', 'lilac', 'sage', 'blue'];
      const emojiByType = { SPORT: '⚽', TOURNAMENT: '🏆', WORKSHOP: '🧩', MUSEUM: '🏛️', EXHIBITION: '🦕', HIKE: '🥾', HIKING: '🥾', PARK: '🌳', GAME_RELEASE: '🎮', MOVIE_RELEASE: '🎬', TOY_RELEASE: '🪀', AIRPORT_EXPERIENCE: '✈️', ONLINE_EVENT: '💻', EVENT: '✨' };
      const when = row.start_at ? new Intl.DateTimeFormat('en-PK', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(row.start_at)) : row.city;
      const cost = row.price_min == null ? 'See organizer' : row.price_max && row.price_max !== row.price_min ? `PKR ${row.price_min}–${row.price_max}` : row.price_min === 0 ? 'Free' : `From PKR ${row.price_min}`;
      return { id: row.id, title: row.title, category: type.replaceAll('_', ' '), emoji: emojiByType[type] || '✨', color: accents[row.title.length % accents.length], distance: row.venue_name || row.city, price: cost, copy: row.summary || row.description || 'Open the original source for verified activity details.', tags: row.tags || [], kind: row.activity_type === 'ONLINE_EVENT' ? 'home' : 'place', isVerified: true, source: row.source_name, sourceUrl: row.source_url, lastVerifiedAt: row.last_verified_at, when, minAge: row.min_age, maxAge: row.max_age };
    });
  }
  const { data: { session } } = await supabase.auth.getSession();
  state.user = session?.user || null;
  supabase.auth.onAuthStateChange((_event, session) => { state.user = session?.user || null; render(); });
  if (state.user) {
    const { data: family } = await supabase.from('families').select('id,city,radius_km,budget_label,children(*)').eq('parent_id', state.user.id).maybeSingle();
    if (family) {
      state.city = family.city || state.city; state.radius = `${family.radius_km || 30} km`; state.budget = family.budget_label || state.budget;
      if (family.children?.[0]) { const child = family.children[0]; state.child = { id: child.id, name: child.nickname, age: child.age || '', interests: child.interests || [] }; state.goals = child.goals || []; }
      persist();
    }
    const { data: saved } = await supabase.from('saved_activities').select('activity_id').eq('child_id', state.child.id || '');
    if (saved) state.saved = new Set(saved.map((row) => row.activity_id));
  }
  render();
}

if ('serviceWorker' in navigator && import.meta.env.PROD) navigator.serviceWorker.register('/sw.js').catch(() => {});
render();
loadRemote();
