---
name: RentMate India
colors:
  surface: '#fcf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fcf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45464d'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002113'
  on-tertiary-container: '#009668'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#fcf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

This design system targets the modern Indian real estate market, focusing on trust, transparency, and high-velocity utility. The aesthetic is a fusion of **Corporate Minimalism** and **Glassmorphism**, prioritizing clarity and precision. It draws from the atmospheric depth of developer-centric tools and the frictionless accessibility of premium lifestyle services.

The emotional response should be one of reliability and "calm efficiency." By utilizing high-quality whitespace and subtle motion, the UI transforms a stressful task—finding a home—into a premium, guided experience. The style leverages frosted glass surfaces, hairline borders, and a systematic approach to density.

## Colors

The palette is rooted in high-contrast neutrals and a single, vibrant action color.

- **Primary (#0F172A):** Deep Slate. Used for typography and foundational brand elements to establish authority and trust.
- **Accent (#3B82F6):** Vibrant Blue. Reserved strictly for primary calls-to-action and active states to guide the user's eye.
- **Success (#10B981):** Emerald. Utilized for verified badge statuses and successful transaction confirmations.
- **Surface Strategy:** In both modes, surfaces use glassmorphism. Light mode uses white translucency with a 20px backdrop blur, while Dark mode uses a deep slate translucency. Every surface is finished with a 1px border at 10% opacity of the text color.

## Typography

The system uses **Inter** for its exceptional legibility and systematic feel. Typography is treated with a tight tracking (letter-spacing) for headlines to mimic high-end editorial design, while body text maintains standard spacing for maximum readability.

- **Contrast:** Use Medium and Semi-bold weights to create hierarchy rather than relying solely on size.
- **Scale:** On mobile devices, shift the Display and Large Headline tokens down one tier to ensure text fits comfortably within the viewport.
- **Utility:** Small labels should use uppercase styling when used for metadata or category tags.

## Layout & Spacing

This design system is built on a strict **8px linear grid**. All dimensions, padding, and margins must be multiples of 8 (or 4 for micro-adjustments).

- **Grid Model:** Use a 12-column fluid grid for desktop with 24px gutters. For mobile, use a 4-column grid with 16px margins.
- **Density:** Elements should have generous internal padding (16px–24px) to reflect the premium, spacious feel of Apple-inspired layouts.
- **Safe Zones:** Keep content within a 1280px max-width container on desktop to prevent eye strain.

## Elevation & Depth

Hierarchy is defined through **Tonal Elevation** and **Ambient Shadows**.

1. **The Base:** The background is the lowest layer.
2. **The Surface:** Cards and navigation bars sit slightly above the base, utilizing a 1px hairline stroke and backdrop blur (Glassmorphism).
3. **The Shadow:** Use multi-layered, low-opacity shadows to indicate interactivity.
   - *Example:* A hovered card should use a shadow of `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`.
4. **Dark Mode Depth:** In dark mode, instead of heavier shadows, increase the brightness of the surface color slightly to indicate higher elevation.

## Shapes

The shape language is modern and approachable, avoiding sharp corners in favor of generous, smooth radii.

- **Standard Elements:** Buttons, input fields, and small cards use `rounded-md` (8px) or `rounded-lg` (16px).
- **Large Containers:** Main content cards and modal windows should use `rounded-xl` (24px).
- **Consistency:** Never mix sharp and rounded corners within the same component hierarchy. All interactive states must preserve the border radius of the parent element.

## Components

### Buttons
- **Primary:** Solid `#3B82F6` with white text. High-contrast, 16px border radius.
- **Secondary:** Glass effect (10% white/slate) with a 1px border. 
- **Interaction:** On hover, primary buttons increase in saturation; secondary buttons increase backdrop blur intensity.

### Input Fields
- Use a subtle light-gray background in light mode and deep-slate in dark mode. 
- Focus state: The border color changes to `#3B82F6` with a 2px outer glow (ring).
- Labels are always positioned above the field using the `label-md` token.

### Cards
- Every card must have a 1px border. 
- Property cards should feature a 1:1 or 4:3 image aspect ratio with a `16px` corner radius.
- Metadata (price, location) uses `body-md` for emphasis and `label-sm` for secondary details.

### Navigation
- The top navigation bar should be sticky and utilize the glassmorphism effect (backdrop blur) to allow content to scroll underneath beautifully.
- Use an 8px bottom border with 5% opacity to separate the nav from the content.

### Selection Controls
- **Checkboxes/Radios:** Use the Accent color for active states. 
- **Chips:** Used for property filters (e.g., "1BHK", "Verified"). These use a pill-shape (32px radius) and a subtle background tint.