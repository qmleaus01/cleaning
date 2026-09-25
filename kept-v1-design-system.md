# Kept V1: design system decisions

Brand: Kept. Direction: "Sunday Paper" (editorial), using Direction B's conversion clarity.
References: Sōl Haus (45%), S.DA (25%), Atrium (20%), SOVA (10%).

## Typefaces (two families only)
- Display: Newsreader (Google Fonts), optical sizing, weight 300 for headlines and 400 for titles, italic 300 for emphasis. Headlines use sentence case and end with a full stop.
- Text/UI: Hanken Grotesk 400/500/600. Labels are 12.5px uppercase with 0.14em tracking.

## Palette
| Token | Hex | Use |
|---|---|---|
| paper | #F3F0E8 | Main background |
| linen | #E9E4D8 | Alternate sections (How it works, What's included, Promises) |
| stone | #CFC8B8 | 1px hairlines |
| ink | #1F231E | Text |
| ink-2 / ink-3 | #50564C / #676C61 | Secondary text, captions |
| accent (deep eucalyptus) | #3C5443 | Primary CTA, section numerals, list ticks |
| deep | #222D26 | Closing quote band only |

## Layout
- 12-column grid, max width 1360px, gutter clamp(20px, 4vw, 56px).
- Section labels sit in columns 1–2; content starts at column 3.
- Section padding clamp(64px, 5rem + 3vw, 128px).
- Breakpoints: 1180px, 960px (switches to the mobile nav and sticky CTA), 700px.
- Corners 0–2px. No shadows, gradients, icons or glass effects.

## Images
- Ratios: hero 3:4 (4:5 on mobile), services and included 4:5, statement 1:1, band 21:9 (3:2 on mobile).
- V1 uses rendered light studies with "Image slot" captions. Replace each canvas with photography of the outcome of a clean in natural Sydney light.

## CTA
- Primary: "Get a quote", a filled eucalyptus button in sentence case with an arrow. Secondary: "View services" as an underlined text link.
- Reassurance line: "Instant estimate · No obligation · Takes about a minute".

## Sample content
All prices, reviews, ratings, guarantees, the phone number (02 5550 4821, from the range reserved for fictional use) and the ABN are sample content and are labelled as such. The quote flow is a demo: nothing is sent or stored.

## Sample pricing formula (data.js)
Estimate = base + bedrooms × bed rate + bathrooms × bath rate + add-ons. The range is rounded to $5, from the estimate up to estimate × 1.12.
- Regular: 94 + 25/bed + 30/bath (from $149)
- Deep: 219 + 55 + 55 (from $329)
- End of lease: 250 + 80 + 60 (from $390)
- Apartment: 74 + 25 + 30 (from $129)
