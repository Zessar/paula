---
name: Industrial Underground
colors:
  surface: '#141318'
  surface-dim: '#141318'
  surface-bright: '#3a383e'
  surface-container-lowest: '#0f0d13'
  surface-container-low: '#1c1b20'
  surface-container: '#201f24'
  surface-container-high: '#2b292f'
  surface-container-highest: '#36343a'
  on-surface: '#e6e1e9'
  on-surface-variant: '#cbc4d2'
  inverse-surface: '#e6e1e9'
  inverse-on-surface: '#312f35'
  outline: '#948e9c'
  outline-variant: '#494551'
  surface-tint: '#cfbdff'
  primary: '#cfbdff'
  on-primary: '#371e72'
  primary-container: '#6750a4'
  on-primary-container: '#e0d2ff'
  inverse-primary: '#6750a4'
  secondary: '#cdc0e8'
  on-secondary: '#342b4b'
  secondary-container: '#4d4465'
  on-secondary-container: '#beb3da'
  tertiary: '#e7c365'
  on-tertiary: '#3e2e00'
  tertiary-container: '#c9a74d'
  on-tertiary-container: '#503d00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#cfbdff'
  on-primary-fixed: '#22005d'
  on-primary-fixed-variant: '#4e378a'
  secondary-fixed: '#e8ddff'
  secondary-fixed-dim: '#cdc0e8'
  on-secondary-fixed: '#1e1635'
  on-secondary-fixed-variant: '#4a4263'
  tertiary-fixed: '#ffdf93'
  tertiary-fixed-dim: '#e7c365'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#594400'
  background: '#141318'
  on-background: '#e6e1e9'
  surface-variant: '#36343a'
typography:
  display-xl:
    fontFamily: Bebas Neue
    fontSize: 96px
    fontWeight: '400'
    lineHeight: 90%
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: Bebas Neue
    fontSize: 64px
    fontWeight: '400'
    lineHeight: 100%
    letterSpacing: 0.02em
  headline-lg-mobile:
    fontFamily: Bebas Neue
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 100%
    letterSpacing: 0.02em
  body-lg:
    fontFamily: Barlow Condensed
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 160%
    letterSpacing: 0.02em
  label-bold:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 120%
    letterSpacing: 0.05em
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
  xl: 64px
  container-max: 1280px
  gutter: 20px
---

## Brand & Style

This design system is built on a "Brutalist-Industrial" aesthetic, capturing the raw, unpolished energy of boxing gyms and underground music venues. It prioritizes impact over elegance, utilizing high-contrast visuals and rigid structures to evoke a sense of urgency and grit.

The target audience is rooted in urban culture—fans of combat sports and street-level music who value authenticity and directness. The UI should feel heavy, mechanical, and uncompromising. Every interaction should reinforce a "street" ethos through sharp corners, massive typography, and a "no-frills" functionalism.

## Colors

The palette is strictly limited to maintain a high-intensity atmospheric effect, utilizing a "fidelity" variant to preserve the specific character of the chosen hues.

- **Primary Violet (#8069bf):** A bruised, industrial purple used for core brand signals and primary interactive elements.
- **Secondary Slate (#7c7296):** A muted, metallic tone used for secondary actions and supporting UI elements.
- **Tertiary Gold (#c9a74d):** A weathered, metallic yellow/gold reserved for highlights, alerts, and critical calls to action.
- **Neutral Charcoal (#79767d):** Provides the structural foundation for surfaces and borders, maintaining a dark, moody atmosphere.

## Typography

Typography acts as a structural element. The selection shifts from aggressive headers to highly legible technical fonts for functional data.

- **Headlines:** Bebas Neue provides a cinematic, towering presence. Use tight line heights (90-100%) to create dense blocks of text.
- **Body:** Barlow Condensed maintains the narrow, industrial aesthetic of the headings while providing better legibility for longer passages of text.
- **Labels:** Atkinson Hyperlegible Next is used for navigation, tags, and small-scale UI elements to ensure maximum clarity and a distinct "technical manual" feel.

## Layout & Spacing

The layout follows a rigid, 12-column grid system that emphasizes verticality and modular blocks. 

- **Grid:** On desktop, use a 12-column grid with a 20px gutter. On mobile, transition to a 4-column grid with 16px margins.
- **Rhythm:** Spacing follows a strict 4px base unit. Use larger gaps (32px or 64px) between major sections to mimic the sparse layout of industrial blueprints.
- **Alignment:** Content should be flush left or center-heavy. Avoid "soft" placements; every element must feel locked into the grid.

## Elevation & Depth

This system rejects traditional depth markers like soft shadows or blurs. Instead, depth is communicated through **Tonal Stacking** and **High-Contrast Outlines**.

- **Stacked Surfaces:** Use the darkest surface colors for the background and progressively lighter neutrals for elevated cards or modules. 
- **Borders:** Define boundaries using 1px or 2px solid borders in neutral grays or muted accent tones. 
- **Z-Index:** To indicate an element is "above" another, use a thick 4px solid border in the Tertiary Gold or Primary Violet with no shadow. 
- **Interaction:** Hover states should not use shadows; instead, use color inversions or solid fills.

## Shapes

The geometry of the design system is strictly orthogonal. 

- **Corners:** Border-radius is strictly 0px for all elements—buttons, cards, inputs, and image containers. 
- **Motif:** Use thick, rectangular strokes. Elements should look like they were cut from sheet metal or concrete blocks.
- **Visual Breaks:** Use diagonal 45-degree slashes or "glitch" offsets for decorative separators, but ensure the containers themselves remain rectangular.

## Components

### Buttons
- **Primary:** Solid Primary Violet (#8069bf) fill, White or Inverse text. No border-radius. 
- **Secondary:** Transparent background, 2px Secondary Slate solid border.
- **State:** On hover, buttons should display a "strobe" effect or a hard color shift to Tertiary Gold.

### Cards & Containers
- Containers must use a tonal variation of the neutral charcoal. 
- Images within cards should be high-contrast or treated with a violet/gold duotone filter.
- Information should be grouped in tight, rectangular sub-blocks.

### Form Inputs
- 1px solid neutral border, dark background.
- Labels sit above the input in Atkinson Hyperlegible Next Bold.
- Focus state: Border color changes to Tertiary Gold.

### Iconography
- Use Lucide-react icons. 
- Stroke weight must be consistent (2px).
- Choose icons with straight lines and sharp angles where possible.

### Photography
- Placeholders and art direction should focus on dramatic lighting, heavy shadows, and "street" textures (concrete, chain-link fences, sweat). 
- No color photography allowed; only monotone or duotone (using the primary violet or tertiary gold).