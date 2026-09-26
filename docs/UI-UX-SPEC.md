# WonderPlan UI/UX Specification

## 1. Design philosophy

WonderPlan is a parent-facing family planner. It should feel warm, calm, premium and trustworthy, with a little playfulness. Use clear hierarchy, generous whitespace and restrained illustration. Avoid childish game styling and generic chatbot patterns.

## 2. Responsive breakpoints

- Small screens: below 768px. Use the compact header and fixed bottom navigation.
- Tablet and small desktop: 768px–1119px. Use the responsive content frame and desktop-style header; retain bottom navigation until there is room for a persistent sidebar.
- Wide desktop: 1120px and above. Show the 248px persistent sidebar and desktop navigation.
- Keep 16px minimum page gutters on mobile and 32px content gutters on desktop. Include safe-area insets around fixed mobile navigation.

## 3. Navigation

Desktop primary navigation: Home, Explore, Plan, Calendar, Saved. Family navigation: Children, Settings.

Mobile navigation: Home, Explore, Plan, Saved, Profile. Plan is the emphasized action. Every navigation control has a 44px minimum target and an accessible name. Indicate the current route with both styling and `aria-current`.

## 4. App shell

The shell contains a skip link, desktop sidebar, responsive header, main content slot, and mobile bottom navigation. The shell owns global navigation and layout; feature screens render inside the main content slot. Keep shell layout independent from page-specific components.

## 5. Home

The home route is `/home`. Start with a parent greeting and child switcher, followed by an AI planning hero and personalized recommendation sections. The initial sections are “For [child]”, “This weekend” and “Try something new”. Recommendation cards show why an idea may fit, a clearly marked sample match score, basic format/age guidance, and an accessible save control. Carousels have labeled previous/next controls and remain keyboard-scrollable. Mock content is clearly labeled as sample inspiration and does not fabricate event dates, venues, prices or availability. Support loading skeletons and an empty recommendation state.

## 6. Activity details

The detail route is `/activities/[id]`. Lead with a large activity image, sample match score, category tags, title, summary and matching-interest tags. Show date, time, location, distance, age range and price in a compact, scannable metadata grid. Follow with a plain-language recommendation explanation and source/verification panel with the last verified timestamp. Do not make up unavailable event facts. The mobile layout has a sticky bottom action bar with Save and an original-source action; desktop places actions in a side panel. For sample ideas without an external source, the source action is disabled and the demo verification state is explicit.

## 7. Explore

Explore will be implemented in a later stage.

## 8. AI planner

The `/plan` route should feel like a calm planning assistant, not a chat transcript. Use a structured preference form for children, day, budget, travel range, activity type, indoor/outdoor setting and time of day. Offer quick choices for today, tomorrow, this weekend, outdoors, educational ideas and a surprise. Present the result as a summary and a chronological timeline. Clearly label generated mock ideas and suggested times; do not imply that a venue, price, event or AI model has been verified. Include loading, generated, empty and error states. Keep the form and results responsive, with accessible fieldsets, labels and focus behavior.

## 9–12. Other product screens

Calendar, saved ideas, child profiles and onboarding will be implemented in later stages.

## 13. Components

Foundation, Home, detail and planner components: brand mark, sidebar navigation item, mobile navigation item, responsive header, profile control, location control, skip link, AI planning hero, child switcher, activity card, activity carousel, match badge, activity metadata, recommendation section, interest tags, match explanation, source verification panel, save control, external-source action, planner input and filters, preference controls, plan summary, timeline and follow-up actions. Prefer semantic links for navigation and buttons for actions. Keep touch targets at least 44px and expose selected states to assistive technology.

## 14. Colors

Use the design tokens documented in `DESIGN-SYSTEM.md`: warm off-white background, cream surfaces, deep green primary, soft yellow accent, restrained peach, dark readable text, muted secondary text and low-contrast borders. Maintain accessible contrast for text and focus indicators.

## 15. Typography

Use DM Sans for interface text and Playfair Display sparingly for editorial emphasis. Load with system fallbacks. Use a minimum 14px body size for feature content; labels may be smaller only when still legible and nonessential.

## 16. Spacing

Use the 4px based spacing scale defined by CSS custom properties. Prefer consistent 16–24px component spacing and 24–48px section spacing. Avoid one-off spacing values where a token fits.

## 17. Accessibility

Use semantic landmarks, a skip-to-content link, visible keyboard focus, reduced-motion support, minimum 44px touch targets, meaningful labels and `aria-current` for the active page. Do not rely on color alone to communicate selection.

## 18. PWA

Provide a web manifest, SVG app icon, theme color and standalone display mode. Register the service worker only in production. Cache the app shell and same-origin static requests for basic offline loading; never cache cross-origin requests or non-GET requests.

## 19. Responsive behavior

The sidebar is hidden below 1120px. Bottom navigation remains visible below 1120px to avoid crowding the header. The header replaces the mobile brand with page context at 768px. The main content uses one responsive layout and shared component system at every width.
