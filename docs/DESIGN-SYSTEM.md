# WonderPlan Design System

WonderPlan is designed for parents. The interface should feel warm, premium, trustworthy and lightly playful, with generous whitespace and clear hierarchy.

## Typography

| Token | Value | Use |
| --- | --- | --- |
| `--font-body` | DM Sans, ui-sans-serif, system-ui | Interface and body copy |
| `--font-display` | Playfair Display, Georgia | Editorial emphasis and selected headings |
| `--font-size-xs` | 12px | Compact labels and mobile nav |
| `--font-size-sm` | 14px | Supporting interface text |
| `--font-size-base` | 16px | Default readable body size |
| `--font-size-lg` | 18px | Prominent supporting text |
| `--font-size-xl` | 22px | Header titles |
| `--font-size-2xl` | 28px | Feature page titles |

## Colors

| Token | Value | Use |
| --- | --- | --- |
| `--color-background` | `#FBFAF6` | Warm app canvas |
| `--color-surface` | `#FFFEFA` | Cards, navigation and panels |
| `--color-primary` | `#174E41` | Actions and active navigation |
| `--color-primary-deep` | `#113E35` | Strong contrast and brand |
| `--color-primary-soft` | `#EAF2ED` | Selected navigation background |
| `--color-accent` | `#F4C95D` | Warm highlights |
| `--color-peach` | `#D89573` | Secondary accent |
| `--color-success` | `#5A8C6C` | Success state |
| `--color-text` | `#26352F` | Main text |
| `--color-text-muted` | `#68756B` | Supporting text |
| `--color-text-subtle` | `#828A80` | Tertiary text and labels |
| `--color-border` | `#ECEBE4` | Quiet separators |
| `--color-focus` | `#4B806A` | Keyboard focus ring |

## Spacing

Use the 4px based scale: `--space-1` 4px, `--space-2` 8px, `--space-3` 12px, `--space-4` 16px, `--space-5` 20px, `--space-6` 24px, `--space-8` 32px, `--space-10` 40px and `--space-12` 48px. Use these shared values for padding, gaps and section rhythm.

## Shape and depth

- `--radius-sm`: 8px; `--radius-md`: 12px; `--radius-lg`: 16px; `--radius-xl`: 20px; `--radius-pill`: 999px.
- Separate surfaces mainly with subtle borders and color. Keep shadows soft and restrained.
- Use quiet pastel fills and simple shapes for future illustrations.

## Layout and breakpoints

- Mobile: below 768px; compact header and fixed bottom navigation.
- Tablet: 768px–1119px; contextual header and bottom navigation.
- Desktop: 1120px and above; persistent 248px sidebar and desktop navigation.
- `--content-max`: 1400px. Mobile content gutter is 16px; desktop content gutter is 32px.
- Use one shared component system at every viewport size and include device safe-area insets.

## Interaction and accessibility

- `--touch-target`: minimum 44px for interactive controls.
- Use semantic landmarks and links, visible focus rings, reduced-motion support, readable contrast and accessible current-navigation state.
- Keep Plan visually emphasized. Never rely on color alone to show a selected state.

## Product trust

- Label general or generated prompts as ideas, not listings.
- Show external activities only with source information, verification state and last checked time.
- AI may organize and explain verified information; it must not invent events, locations, dates, prices, booking links or opening hours.
