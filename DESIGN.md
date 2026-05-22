---
name: Learning Pathway
description: A refined learning management system with academic elegance and supportive warmth
colors:
  growth-sage: "#059669"
  growth-sage-light: "#6ee7b7"
  growth-sage-dark: "#064e3b"
  heritage-wine: "#b91c1c"
  heritage-wine-light: "#fca5a5"
  heritage-wine-dark: "#7f1d1d"
  distinction-bronze: "#ca8a04"
  distinction-bronze-light: "#fde047"
  distinction-bronze-dark: "#713f12"
  warm-cream: "#faf9f6"
  subtle-cream: "#f5f3ee"
  soft-border: "#e8e3d9"
  refined-text: "#1c1813"
  secondary-text: "#574c3d"
  pure-surface: "#ffffff"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "4.768rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "3.052rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "1.953rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "normal"
  body:
    fontFamily: "DM Sans, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "normal"
  label:
    fontFamily: "DM Sans, -apple-system, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.04em"
rounded:
  subtle: "0.375rem"
  moderate: "0.5rem"
  generous: "0.75rem"
  soft: "1rem"
spacing:
  compact: "0.5rem"
  comfortable: "1rem"
  spacious: "1.5rem"
  generous: "2rem"
  expansive: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.heritage-wine}"
    textColor: "{colors.pure-surface}"
    rounded: "{rounded.moderate}"
    padding: "0.5rem 1rem"
  button-primary-hover:
    backgroundColor: "{colors.heritage-wine-dark}"
  button-secondary:
    backgroundColor: "{colors.growth-sage}"
    textColor: "{colors.pure-surface}"
    rounded: "{rounded.moderate}"
    padding: "0.5rem 1rem"
  button-outline:
    backgroundColor: "{colors.pure-surface}"
    textColor: "{colors.refined-text}"
    rounded: "{rounded.moderate}"
    padding: "0.5rem 1rem"
  card-default:
    backgroundColor: "{colors.pure-surface}"
    textColor: "{colors.refined-text}"
    rounded: "{rounded.generous}"
    padding: "1.5rem"
  badge-default:
    backgroundColor: "{colors.heritage-wine}"
    textColor: "{colors.pure-surface}"
    rounded: "9999px"
    padding: "0.125rem 0.5rem"
---

# Design System: Learning Pathway

## 1. Overview

**Creative North Star: "The Learning Sanctuary"**

A supportive space for professional growth where progress is celebrated with quiet dignity. This system balances academic refinement with human warmth, creating an environment that feels both prestigious and encouraging. The interface should feel like a quality educational institution that genuinely cares about each person's journey, not a bureaucratic compliance system or generic corporate LMS.

The aesthetic draws from editorial design and scholarly institutions: refined typography, warm cream backgrounds with subtle paper texture, and a restrained color palette that uses deep burgundy, forest green, and bronze gold sparingly but meaningfully. The density is comfortable, not cramped. White space and rhythm create breathing room for focused learning tasks.

**What this explicitly rejects:**
- Corporate LMS platforms (Cornerstone, Workday) with their cold, impersonal bureaucratic aesthetic
- Generic SaaS dashboards with bland cream-and-blue color schemes and identical card grids
- Overly playful or childish designs with excessive gamification and cartoonish elements
- Dark mode with neon accents and glassmorphism
- The hero-metric template and gradient text overlays

**Key Characteristics:**
- Warm cream backgrounds with subtle paper texture for editorial tactility
- Serif headings (Playfair Display) paired with refined sans body text (DM Sans)
- Restrained color strategy: heritage wine, growth sage, and distinction bronze used sparingly
- Soft shadows that suggest elevation without heaviness
- Thoughtful spacing that varies for visual rhythm, never monotonous
- Subtle animations that reinforce actions without distraction

## 2. Colors

A warm, refined palette that balances academic prestige with approachability. Heritage wine anchors important actions, growth sage celebrates progress, and distinction bronze highlights achievements. Neutral tones are never pure black or white but tinted toward warmth.

### Primary
- **Heritage Wine** (#b91c1c / rgb(185, 28, 28)): Deep burgundy used for primary actions, important buttons, and navigation accents. Conveys sophistication, achievement, and institutional quality. Used sparingly (≤15% of any screen) so its presence feels intentional and meaningful. Appears on call-to-action buttons, submission states, and key navigation elements.

### Secondary
- **Growth Sage** (#059669 / rgb(5, 150, 105)): Forest green representing progress, development, and successful completion. Reserved for approval states, completion badges, progress indicators, and manager review actions. Never used decoratively. Its presence signals forward movement in the learning journey.

### Tertiary
- **Distinction Bronze** (#ca8a04 / rgb(202, 138, 4)): Warm gold for highlighting achievements, milestone celebrations, and admin-level actions. The most restrained accent, appearing only for earned recognition moments, decorative dividers, or elevated administrative functions. Never used for standard UI chrome.

### Neutral
- **Warm Cream** (#faf9f6 / rgb(250, 249, 246)): Primary background color. Tinted toward warmth, never stark white. Creates a refined, paper-like surface quality.
- **Subtle Cream** (#f5f3ee / rgb(245, 243, 238)): Secondary surface color for cards, inputs, and subtle layering. One step darker than the background.
- **Soft Border** (#e8e3d9 / rgb(232, 227, 217)): Border and divider color. Gentle separation without harsh lines.
- **Secondary Text** (#574c3d / rgb(87, 76, 61)): Body copy and secondary information. Warm charcoal, not cool gray.
- **Refined Text** (#1c1813 / rgb(28, 24, 19)): Primary text color. Deep charcoal tinted toward warm brown, never pure black.
- **Pure Surface** (#ffffff / rgb(255, 255, 255)): Clean white for elevated cards and contrast surfaces. Still slightly warm in context.

### Named Rules
**The Restrained Accent Rule.** Heritage wine, growth sage, and distinction bronze together occupy ≤20% of any screen. Their scarcity makes each use meaningful. Default to neutrals; reach for color when it carries semantic weight (action, status, achievement).

**The Warm Neutral Rule.** Never use pure black (#000) or pure white (#fff) as defined values. Every neutral is tinted toward the brand's warm, scholarly character (chroma 0.005–0.01 in OKLCH space). This creates subliminal cohesion across the palette.

## 3. Typography

**Display Font:** Playfair Display (with Georgia, serif fallback)  
**Body Font:** DM Sans (with -apple-system, sans-serif fallback)  
**Label/Mono Font:** DM Sans for labels; no dedicated mono font (academic register doesn't need code display)

**Character:** Serif for headings creates academic gravitas and editorial refinement. Sans for body ensures clarity and approachability in learning workflows. The pairing balances institutional prestige with modern professionalism. Scale ratio is 1.25 (Major Third), creating clear hierarchy without exaggerated jumps.

### Hierarchy
- **Display** (700 weight, 4.768rem / ~76px, 1.2 line-height, -0.04em tracking): Hero headlines on landing page and major section intros. Used once per page maximum. Sets the refined, editorial tone.
- **Headline** (700 weight, 3.052rem / ~49px, 1.2 line-height, -0.02em tracking): Page titles and primary section headers. Dashboard headings ("Pre-Schema Steps", "Your Progress"). Clear hierarchy without shouting.
- **Title** (600 weight, 1.953rem / ~31px, 1.35 line-height, normal tracking): Card titles, dialog headers, subsection headings. The most common heading level in the application.
- **Body** (400 weight, 1rem / 16px, 1.75 line-height, normal tracking): All body copy, form labels, descriptions. Generous line-height (1.75) for comfortable reading. Max line length capped at 65–75ch for optimal readability in prose contexts.
- **Label** (500 weight, 0.8rem / ~13px, 1.5 line-height, 0.04em wide tracking, uppercase): Badges, status indicators, metadata tags. Uppercase with wide tracking for distinction and clarity at small sizes.

### Named Rules
**The Hierarchy Contrast Rule.** Adjacent heading levels must differ by ≥1.25 ratio in size OR ≥200 weight units. Avoid flat scales where h2 and h3 are visually identical. Each step down should be unmistakable.

**The Line-Length Rule.** Body text in prose contexts (descriptions, instructions, feedback) is capped at 65–75 characters per line. Use max-width or container constraints. Wider measure fatigues readers; narrower measure breaks rhythm.

## 4. Elevation

This system uses soft, refined shadows to suggest layering without heaviness. Shadows are ambient and subtle, never harsh or structural. The default state is flat; elevation appears on interaction (hover, focus) or to distinguish interactive surfaces (cards, dialogs, dropdowns) from the page background.

The paper texture background provides a tactile foundation. Cards sit on top with gentle shadows that suggest they're resting on the surface, not floating far above it. The feel is editorial quality, not material design stacking.

### Shadow Vocabulary
- **Ambient Rest** (`0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)`): Default shadow for cards at rest. Barely perceptible, just enough to separate from background.
- **Hover Lift** (`0 4px 6px -1px rgba(0,0,0,0.08), 0 8px 16px -4px rgba(0,0,0,0.1)`): Hover state for cards and interactive surfaces. Gentle lift that signals interactivity without drama.
- **Elevated Surface** (`0 10px 15px -3px rgba(0,0,0,0.1), 0 16px 24px -6px rgba(0,0,0,0.12)`): Dialogs, dropdowns, popovers. Clearly above the page plane but still refined.
- **Seal Accent** (`0 4px 6px -1px rgba(202,138,4,0.2), 0 2px 4px -2px rgba(202,138,4,0.1)`): Warm gold-tinted shadow for achievement badges and milestone seals. Only used for recognition moments.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest unless they're interactive containers (cards, buttons) or overlay elements (modals, dropdowns). Decorative elevation is forbidden. Shadows serve functional purposes only: separating interactive surfaces or signaling hover states.

**The Ambient-Only Rule.** No directional shadows (0 10px 0 0 rgba...). All shadows are ambient, suggesting soft diffuse light from above, not harsh spotlight drama. This maintains the refined, editorial quality.

## 5. Components

Components balance academic refinement with clear interactive affordances. Buttons feel confident and tactile. Cards have generous padding and soft shadows. Inputs are clean and focused. Every component prioritizes legibility and clarity over decoration.

### Buttons
- **Shape:** Softly rounded corners (0.5rem / 8px) for approachability without being playful
- **Primary:** Heritage wine background (#b91c1c), white text, 0.5rem vertical padding × 1rem horizontal padding. Medium weight (500). Hover darkens to #7f1d1d with smooth transition (180ms ease-out).
- **Secondary:** Growth sage background (#059669) for success/approval actions. Same shape and padding as primary.
- **Outline:** White background with soft border (#e8e3d9), refined text color. Hover fills with subtle cream (#f5f3ee).
- **Ghost:** Transparent background. Hover fills with subtle cream. Used for tertiary actions and navigation.
- **Focus:** Ring accent (3px heritage wine at 50% opacity) with smooth transition. Never browser default outline.
- **States:** Active state translates down 1px for tactile feedback. Disabled reduces opacity to 50% and removes pointer events.

### Badges
- **Style:** Pill shape (fully rounded, 9999px). Compact height (1.25rem / 20px). Horizontal padding 0.5rem.
- **Primary Badge:** Heritage wine background, white text, uppercase label typography (0.8rem, 500 weight, 0.04em tracking).
- **Status Variants:** Growth sage for "Approved/Completed", Heritage wine for "Submitted", Soft border with secondary text for "Not Started", Distinction bronze for "In Progress".
- **Purpose:** Status indicators, role labels (Staff/Manager/Admin), step counts, achievement markers. Never decorative.

### Cards
- **Corner Style:** Generous rounding (0.75rem / 12px) for refined, approachable feel
- **Background:** Pure white (#ffffff) on warm cream background
- **Shadow Strategy:** Ambient rest shadow by default. Hover lift shadow on interactive cards (navigation cards on homepage).
- **Border:** Subtle ring (1px at 10% opacity of text color), reinforced to 2px on hover for interactive cards
- **Internal Padding:** Generous (1.5rem / 24px) for breathing room. Content never feels cramped.
- **Layout:** Flex column with comfortable gap (1rem between header and content). Card header may include title + description + action slot.

### Inputs / Fields
- **Style:** White background, soft border (#e8e3d9), moderate rounding (0.5rem / 8px). Height 2.5rem for text inputs.
- **Focus:** Heritage wine ring (3px at 50% opacity), border color shifts to heritage wine. Smooth transition (180ms).
- **Error:** Destructive red border, destructive ring on focus. Error message appears below in small red text.
- **Disabled:** Reduced opacity (50%), subtle cream background, no pointer events.
- **Textarea:** Same styling, min-height 6rem, resizable vertically only.

### Navigation
- **Homepage Role Cards:** Large interactive cards (see Cards section) with icon, title, description, button. Hover lift shadow and 2px border accent. Icon in circular colored background (heritage wine, growth sage, or distinction bronze tints at 50 opacity).
- **Future App Nav (not yet implemented):** Likely horizontal top bar or sidebar. Heritage wine accents for active state, ghost buttons for navigation items. To be defined when app shell is built.

### Paper Texture Background
- **Implementation:** SVG noise filter applied as background-image on html::before pseudo-element. Fixed position covering viewport + overscroll. Opacity 0.03 for subtle tactility.
- **Purpose:** Creates editorial, printed-material quality. Reinforces the "learning sanctuary" character without overwhelming content.

## 6. Do's and Don'ts

Concrete, enforceable guardrails derived from PRODUCT.md anti-references and the design system's principles.

### Do:
- **Do** use serif headings (Playfair Display) for all h1-h3 elements to maintain academic refinement and editorial quality.
- **Do** vary spacing intentionally. Card padding (1.5rem) should differ from button padding (0.5rem × 1rem) should differ from section gaps (3rem+). Rhythm over uniformity.
- **Do** cap body text line length at 65–75 characters in prose contexts (instructions, feedback, descriptions). Improves readability and creates comfortable focus.
- **Do** use heritage wine, growth sage, and distinction bronze sparingly and semantically. Color signals meaning (action, status, achievement), not decoration.
- **Do** tint all neutral colors toward warm (never pure black #000 or pure white #fff in definitions). This creates subliminal brand cohesion.
- **Do** provide meaningful feedback on interactions: hover lift on cards, focus rings on inputs, subtle scale or translate on button active states.

### Don't:
- **Don't** use border-left or border-right greater than 1px as colored accents on cards, list items, or callouts. Side stripes are an AI/SaaS cliché explicitly rejected by this system.
- **Don't** use gradient text (background-clip: text). All text is solid color. Emphasis via weight, size, or color, not gradients.
- **Don't** apply glassmorphism (backdrop-blur, frosted-glass cards) decoratively. This system is flat-by-default with ambient shadows, not layered glass.
- **Don't** use the hero-metric template (big number, small label, gradient accent, supporting stats). This is a generic SaaS pattern explicitly listed as an anti-reference.
- **Don't** create identical card grids where every card has the same icon + heading + text layout repeated. Vary card content and structure to avoid monotony.
- **Don't** use modals as the first solution. Exhaust inline expansion, progressive disclosure, and slide-out panels before reaching for a modal overlay.
- **Don't** use pure sans-serif for all headings. The serif/sans pairing (Playfair Display for headings, DM Sans for body) is non-negotiable for maintaining the academic register.
- **Don't** wrap everything in a container. Most elements can align to natural page flow. Reserve max-width containers for prose content and centered layouts.
- **Don't** make the interface feel like corporate LMS platforms (Cornerstone, Workday) with cold bureaucratic aesthetics, generic SaaS dashboards with bland blue-and-cream schemes, or overly playful/childish designs with excessive gamification. This system is warm, refined, and professionally supportive.
