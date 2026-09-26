# WonderPlan — Codex Development Instructions

## Product

WonderPlan is an AI-powered family activity discovery and planning PWA.

The primary user is a parent.

The product helps parents discover:
- local activities
- sports
- events
- workshops
- museums
- outdoor activities
- movies
- games
- toys
- virtual activities
- family experiences

Recommendations are personalized using:
- child age
- interests
- hobbies
- parent goals
- location
- distance
- budget
- availability
- previous activity history

Core product promise:

"Tell us what your children love, and we'll help you find things they'll love doing."

---

## Development Principles

1. Mobile-first.
2. PWA from the beginning.
3. Responsive web and mobile must use the same component system.
4. Do not create separate mobile and desktop applications.
5. Prefer reusable components.
6. Avoid duplicated markup.
7. Use TypeScript strictly.
8. Do not use `any` unless absolutely necessary.
9. Use realistic mock data until backend APIs exist.
10. Keep API/data access behind service abstractions.
11. Never hard-code activity data directly into UI components.
12. Build loading, empty and error states.
13. Maintain accessibility.
14. Minimum touch target: 44px.
15. Use semantic HTML.
16. All important interactions must work with keyboard navigation.
17. Do not introduce unnecessary dependencies.
18. Do not change the design system without updating `docs/DESIGN-SYSTEM.md`.
19. Do not invent product functionality that isn't specified.
20. When uncertain, inspect the existing codebase before making architectural changes.

---

## UI Direction

The product should feel:

- modern
- warm
- premium
- trustworthy
- playful but not childish

Reference feeling:

Airbnb + Linear + Google Maps.

Do NOT make it look like:
- a children's game
- a school website
- a generic AI chatbot

The parent is the user.

---

## Primary Navigation

Desktop:

Home
Explore
Plan
Calendar
Saved

Then:
Children
Settings

Mobile:

Home
Explore
Plan
Saved
Profile

The Plan action should receive stronger visual emphasis.

---

## Primary Screens

Implement:

/home
/explore
/activities/[id]
/plan
/calendar
/saved
/children
/children/[id]
/settings

Onboarding:

/onboarding
/onboarding/child
/onboarding/interests
/onboarding/preferences

---

## Important Product Rule

AI should organize and explain verified information.

AI must NOT invent:
- events
- locations
- prices
- dates
- booking URLs
- opening hours

Every external activity should eventually contain:
- source
- sourceUrl
- lastVerifiedAt
- verificationStatus

---

## Before Coding

For every significant task:

1. Inspect the existing implementation.
2. Identify reusable components.
3. Check the design system.
4. Implement the smallest coherent change.
5. Run type checking.
6. Run linting.
7. Run tests if available.
8. Fix errors before finishing.

Do not rewrite unrelated parts of the application.

---

## Definition of Done

A feature is not complete if:
- TypeScript fails
- lint fails
- existing routes break
- mobile layout breaks
- desktop layout breaks
- accessibility significantly regresses
- console errors are introduced