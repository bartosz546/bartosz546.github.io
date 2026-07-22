# Personal Portfolio — Product Requirements

## Overview
A single-page personal portfolio for software engineer **Bartosz Kurek**, built with Angular (standalone components): hero intro with photo, tech stack marquee, career timeline, impact stats, a 15-project work grid, and a contact/footer section. Built with bold scroll/mouse-driven animation (parallax orbs, photo/card 3D tilt, scroll-reveal, animated timeline progress line).

Source of truth for visuals, copy, and data: the design handoff at
`C:\Users\barto\Downloads\Personal portfolio webpage With Angular Translation Explanation\design_handoff_portfolio_angular\` (`README.md` + `reference-design.html` + `assets/` + `screenshots/`). Colors, typography, spacing, copy, and layout are **final — recreate pixel-for-pixel**. The reference HTML is a design prototype only (inline styles, tiny React-like runtime) — re-implement idiomatically in Angular, don't port the runtime.

## Goals
- Present a polished, high-signal personal brand (recruiters, clients, collaborators).
- Showcase 15 real projects and 8 real experience entries with enough detail to demonstrate skill.
- Make it effortless for a visitor to reach out directly (email / LinkedIn / GitHub).
- Fully responsive (mobile, tablet, desktop) with the animation/interaction behavior described below.

## Non-goals
- No CMS or backend — content is static, edited directly in components/data files.
- No authentication/user accounts.
- No blog (out of scope for v1).
- No contact form — contact is direct links only (mailto, LinkedIn, GitHub); no form validation or submit-stub needed.

## Infrastructure tasks

- **Task I1 — Migrate to latest stable Angular:** Upgrade the project from its scaffolded Angular version to the current latest stable Angular major version, updating all npm dependencies (Angular packages, CLI, RxJS, zone.js, TypeScript, test tooling, etc.) to versions compatible with that release. Apply any required code migrations (e.g. control-flow syntax, schematics-driven updates), ensure `ng build` and `ng test` both pass afterward. Follows the same subagent workflow as feature tasks (plan → implement → review → test → log).

## Tech constraints
- Angular, standalone components — see Task I1 for migration off the scaffolded baseline.
- Single-page scroll layout with anchor navigation (`#experience`, `#work`, `#contact`); no Angular Router pages for v1 (`app.routes.ts` stays empty or handles only a 404/redirect if added later).
- Component-scoped SCSS with a shared `_tokens.scss` of CSS custom properties (see Design Tokens) — no third-party UI framework.
- Static assets copied from the design handoff's `assets/` folder into `src/assets/`.

## Sections (in scroll order)

### 1. Nav (fixed header)
Fixed top, full width, `padding:20px 48px`, background `oklch(0.16 0.02 250 / 0.75)` + `backdrop-filter: blur(10px)`, bottom border `1px solid oklch(1 0 0 / 0.06)`.
- Left: wordmark "Bartosz Kurek", Bricolage Grotesque 700, 17px.
- Right: text links (Experience / Work / Contact → `#experience` / `#work` / `#contact`, JetBrains Mono 13px) + a pill badge "Available now" with a pulsing green dot (`oklch(0.75 0.14 145)`, glow via box-shadow).
- Nav links smooth-scroll to their section.

### 2. Hero
- Two-column flex (`gap:64px`), min-height 100vh, `padding:140px 48px 80px`, max-width 1360px centered.
- Two blurred radial-gradient "orb" divs (420px / 360px) positioned top-left / bottom-right, drift via `floatSlow` keyframes (translate Y ±24px, 9s/11s ease-in-out infinite) AND track the mouse (parallax offset, see Interactions).
- Left column: eyebrow label "CHAPTER 01 · INTRO" (mono, accent color, fades/slides in on load via `fadeInDown`), H1 "Speed of AI.<br/>Judgment of **a decade.**" (Bricolage Grotesque 800, `clamp(40px,5.4vw,84px)`, "a decade." in accent color), bio paragraph (19px, Inter): *"I'm **Bartosz Kurek**, a software engineer who pairs modern AI tooling with 10+ years of production experience — shipping AI agent evaluation frameworks, enterprise maritime platforms, and blockchain systems that don't break."*, meta line "10+ years shipping · Warsaw, Poland (Remote)" (mono, muted), a highlighted pill/badge (accent-tinted background, amber dot, bold lead-in): *"**This entire site was built in 2 hours** — it was designed with Claude Code, translated to Angular, and published."*, then two CTA buttons: solid accent "Email me →" (`mailto:Bartosz546@gmail.com`) and outlined "LinkedIn" (`https://www.linkedin.com/in/bartosz546/`).
- Right column: 340×420px portrait photo card, rounded 16px, heavy drop shadow, 3D-tilts on mouse move within the hero (see Interactions). Image: `assets/My-Portrait.jpg`.

### 3. Tech stack marquee
- Full-width strip, `padding:36px 0`, top/bottom hairline borders, `overflow:hidden`.
- One row of pill chips (tech names, mono 13px, bordered, rounded 100px) duplicated end-to-end and scrolled via `translateX(0)→translateX(-50%)` over 26s linear infinite — seamless loop, pure CSS.
- Stack list (verbatim, order matters): `TypeScript, JavaScript, .NET, Node.js, Angular, React, SQL, Docker, Kubernetes, PixiJS, Ionic, Cordova, CI/CD, Git`.

### 4. Experience (id="experience")
- Max-width 1100px, `padding:140px 48px`.
- Eyebrow "CHAPTER 02 · CAREER" + H2 "Ten years **of shipping.**" (second phrase muted color).
- Vertical timeline: 2px track line at `left:0`, with an accent-colored fill overlay whose height animates 0→100% as the user scrolls the section into view (see Interactions). Each entry: small ringed dot marker, mono date+location line, role (Bricolage Grotesque 700 22px) + company name (accent, 15px), a blurb paragraph, and a row of tech-tag pills. Entries fade/slide up on scroll into view.
- Content (verbatim, in this order — define as a typed `ExperienceEntry[]` data array, rendered with `*ngFor`):

  | Dates | Location | Role | Company | Blurb | Tags |
  |---|---|---|---|---|---|
  | 03.2026 – 06.2026 | Warsaw (Remote) | AI Agent Evaluation Engineer | Quesma | Developed custom, Docker-based evaluation frameworks to test the performance of autonomous AI coding agents. | LLMs, Python, Node.js, Docker, CI/CD |
  | 10.2025 – 03.2026 | Dubai (Remote) | Architect | Provably Fair | Designed the Provably Fair certification framework for casino game fairness verification — a transparent architecture for digital trust. | Node.js, Angular, TypeScript, SQL |
  | 02.2023 – 05.2025 | Boston (Remote) | Senior Full Stack Engineer | Veson Nautical | Led design and development of mobile apps for the maritime industry, delivering full-stack solutions across web and mobile at enterprise scale. | .NET, Angular, Ionic, Kubernetes, iOS |
  | 11.2024 – 03.2025 | Remote | Founder | Dapp Connects | Created and pitched a prototype to the Cardano Foundation — an authorization system for Cardano blockchain dApps. | Node.js, Angular, TypeScript |
  | 02.2019 – 02.2023 | New York (Remote) | Full Stack Developer | Q88 LLC | Led management, design and advisory for mobile projects in the maritime industry — critical systems for vessel tracking and specifications. | .NET, WebForms, Cordova, Kubernetes, MSSQL |
  | 04.2018 – 07.2018 | Remote | Founder | STEEM Secure Login | Built one of the first browser-extension wallets for Web 3.0, for the STEEM blockchain. | JavaScript, Gulp, Babel |
  | 02.2017 – 02.2019 | Cracow, Poland | Game Developer | NetEnt | Led development of slot game logic and client-side implementations for core casino platform features and high-performance animations. | JavaScript, PixiJS, Java |
  | 03.2016 – 02.2017 | Cracow, Poland | Full Stack Developer | Idealogic | Enhanced core features in web applications and scalable APIs, focused on back-end performance and system stability. | C++, C#, .NET, Entity Framework |

### 5. Stats
- Max-width 1200px, `padding:80px 48px`. 4-column grid, 1px gap simulating hairline dividers (grid background = border color, cells = card background), each cell centered: big number (Bricolage Grotesque 800, 38px, amber accent `oklch(0.78 0.14 70)`) + mono label below. Fades up on scroll.
- Values (typed `Stat[]` data array): `$20M+` Revenue generated · `$500K` Costs cut for Q88 · `3 mo` Fastest full app delivery · `60%` Faster than market avg.

### 6. Projects / Selected Work (id="work")
- Max-width 1200px, `padding:100px 48px 140px`.
- Eyebrow "CHAPTER 03 · SELECTED WORK" + H2 "Real projects. **Real production.**"
- 3-column grid (`gap:24px`) of 15 cards. Each card: 160px-tall cover image (object-fit cover), padding block with mono tag/category label (accent), title (Bricolage Grotesque 700, 18px), 1-line blurb (14px). Cards 3D-tilt toward the cursor on mousemove (see Interactions) and fade up on scroll.
- All 15 entries (typed `Project[]` data array, image path relative to `assets/`):

  | Image | Tag | Name | Blurb |
  |---|---|---|---|
  | visit-pieniny.png | Prototype · CSS | Visit Pieniny | Webpage promoting the Pieniny region with playful modern CSS animations and an interactive, scalable map. |
  | Provably-Fair.png | Architecture · Trust | Provably Fair Certification Standard | A provably-fair certification framework validating fairness logic and ensuring transparent, auditable game verification. |
  | Position-List-Q88_Android.png | Mobile · Android | Position List — Q88 (Android) | Android app helping shipping brokers and shipowners find the best market opportunities. |
  | Position-List-Q88_iOS.png | Mobile · iOS | Position List — Q88 (iOS) | iOS counterpart of the maritime market-opportunity platform, delivered in just 3 months. |
  | CardanoConnect.png | Founder · Blockchain | Dapp Connect | Authorization system for Cardano, Solana & Ethereum dApps, built with modern Angular web components and Node.js. |
  | Q88.png | Platform · Maritime | Q88 | Maritime data platform centralizing vessel documentation, questionnaires, and operational data. |
  | lost_relics.webp | Game Dev · NetEnt | Lost Relics — Slot Game | Core game logic and high-performance client animations for a top-selling slot title generating $20M+ in revenue. |
  | steem-secure-login.png | Founder · Web3 | STEEM Secure Login | One of the first browser-extension wallets for Web 3.0, built for the STEEM blockchain. |
  | hive-lottery.png | Blockchain · HIVE | Provably Fair Lottery | HIVE blockchain lottery prototype implementing the Provably Fair protocol for verifiable, tamper-proof draws. |
  | thumbnail-crypto-miner.webp | Game Dev · HIVE | Crypto Miner | A dark cyber slot experience where cryptocurrency mining meets neon hacker aesthetics and high-energy spins. |
  | EuropeanRoulette-thumbnail.webp | Game Dev · HIVE | European Roulette | Modern European Roulette built for seamless gameplay and authentic casino mechanics on the HIVE blockchain. |
  | Video-Poker-thumbnail.webp | Game Dev · HIVE | Video Poker | A lightweight video poker game designed for reliable performance and fluid gameplay across platforms. |
  | BlackJack-thumbnail.webp | Game Dev · HIVE | Blackjack | An immersive blackjack table letting players control three hands at once, splitting up to four for deeper strategy. |
  | SteemStone-thumbnail.webp | Game Dev · HIVE | Hive Stone | A gem-mining themed slot game for the HIVE blockchain with vibrant visuals and reward mechanics. |
  | thumbnail-to-the-mars.webp | Game Dev · HIVE | To The Mars | A Dogecoin-themed arcade crypto game built for the HIVE ecosystem — playful visuals, fast rounds. |

### 7. Contact / Footer (id="contact")
- Centered text block, `padding:140px 48px 60px`, top hairline border.
- Eyebrow "CHAPTER 04 · LET'S TALK" + H2 "Have a project in mind?<br/>Let's build it." + subline *"Reach out directly — I read everything myself."* + 3 pill CTAs: `Bartosz546@gmail.com` → `mailto:Bartosz546@gmail.com` (solid accent), "LinkedIn ↗" → `https://www.linkedin.com/in/bartosz546/` (outline), "GitHub ↗" → `https://github.com/bartosz546` (outline).
- Footer row: `© 2026 Bartosz Kurek` + `Warsaw, Poland · +48 728 913 242`, then a small centered 2-line colophon note (mono, muted, 12px), verbatim: *"Built with Claude Code, Claude Design & Gemini, directed by 10 years of engineering judgment."* / *"Designed with Claude Code, translated to Angular and published."*

## Interactions & Behavior
- **Scroll-reveal**: elements marked with a reveal flag start at `opacity:0; transform:translateY(20–30px)` and animate to visible (`opacity 1`, `translateY(0)`, ~0.6–0.7s ease) once their top edge is within 88% of viewport height. Implement with `IntersectionObserver` (threshold ~0.12 or rootMargin `-12% 0px`) per revealed element, set up in `ngAfterViewInit` and torn down in `ngOnDestroy` — not a scroll-position loop.
- **Timeline progress fill**: the accent line inside the experience track grows in height proportional to how far the whole experience block has scrolled past a `60vh` reference line, clamped to the track's height. Recompute on scroll (or via IntersectionObserver + scroll delta) while the section is on screen.
- **Hero photo tilt + orb parallax**: on `mousemove` over the hero section (`HostListener`), compute cursor position as a -0.5..0.5 fraction of the section's bounding box; apply `rotateY(x*16deg) rotateX(-y*16deg)` to the photo card (with `perspective` on its wrapper, via `ViewChild`/`ElementRef`) and opposite-signed small translations to the two background orbs. Reset transforms to neutral on `mouseleave`.
- **Project card tilt**: same tilt technique per-card on mousemove (smaller angle, ~8deg) plus a `translateY(-6px)` lift and shadow on hover; reset on mouseleave.
- **Marquee**: pure CSS `@keyframes` loop, no JS.
- **Nav/eyebrow entrance**: a simple one-shot `fadeInDown` keyframe animation on page load for the hero eyebrow label.
- No routing — single scrolling page with in-page anchor links (`#experience`, `#work`, `#contact`).

## State Management
No real app state. Only ephemeral, purely presentational, DOM-driven state:
- Which reveal elements have already fired (track via a `Set` of revealed indices, or leave DOM elements alone once their `IntersectionObserver` fires and unobserve them).
- Current tilt transform per hovered card/hero photo — transient; bind directly via template `[style.transform]` driven by a signal/property updated on mousemove, no need to persist.

## Non-functional requirements
- Responsive layout: mobile (<576px), tablet (576–991px), desktop (≥992px) — grids collapse (projects 3→2→1 col, stats 4→2 col, hero two-column→stacked).
- Basic accessibility: semantic HTML, alt text on all images, sufficient color contrast, keyboard-navigable nav and links; respect `prefers-reduced-motion` for the marquee/tilt/parallax/reveal animations.
- Lighthouse performance/accessibility score ≥ 90 on the built app.
- Unit tests for components with logic (scroll-reveal / IntersectionObserver wiring, timeline progress calculation, tilt transform calculation).

## Design Tokens

### Colors (oklch)
- Background: `oklch(0.16 0.02 250)` (deep navy-black)
- Surface / card: `oklch(0.19 0.02 250)`
- Text primary: `oklch(0.96 0.01 250)`
- Text secondary/body: `oklch(0.78 0.015 250)`
- Text muted: `oklch(0.6–0.7 0.015–0.02 250)`
- Accent (teal/cyan — links, CTAs, highlights): `oklch(0.75 0.14 200)`
- Accent (amber — stat numbers, status dot): `oklch(0.78 0.14 70)`
- Success dot (available badge): `oklch(0.75 0.14 145)`
- Hairline borders: `oklch(1 0 0 / 0.06–0.16)` (white at low opacity)

### Typography
- Headings: **Bricolage Grotesque**, weight 700–800
- Body: **Inter**, weight 400–600
- Labels / mono / eyebrows / tags / dates: **JetBrains Mono**, weight 400–600
- Load via Google Fonts (`Bricolage+Grotesque:opsz,wght@12..96,500..800`, `Inter:wght@400;500;600`, `JetBrains+Mono:wght@400;500;600`).
- Scale: H1 `clamp(40px,5.4vw,84px)`; H2 `clamp(30–32px, 3.6–4.4vw, 48–56px)`; H3 18–22px; body 14–19px; mono labels 11–15px.

### Spacing / shape
- Section padding: 80–140px vertical, 48px horizontal, content max-width 1100–1360px.
- Card radius: 14–16px. Button radius: 8px. Pill radius: 100px.
- Card border: `1px solid oklch(1 0 0 / 0.08)`.

Port all of the above into `src/app/_tokens.scss` (or similar) as CSS custom properties, consumed by every component's SCSS — avoid re-typing oklch values per component.

## Assets
Copy everything from the design handoff's `assets/` folder into `src/assets/`: `My-Portrait.jpg` (headshot) and the 15 project thumbnails (`visit-pieniny.png`, `Provably-Fair.png`, `Position-List-Q88_Android.png`, `Position-List-Q88_iOS.png`, `CardanoConnect.png`, `Q88.png`, `lost_relics.webp`, `steem-secure-login.png`, `hive-lottery.png`, `thumbnail-crypto-miner.webp`, `EuropeanRoulette-thumbnail.webp`, `Video-Poker-thumbnail.webp`, `BlackJack-thumbnail.webp`, `SteemStone-thumbnail.webp`, `thumbnail-to-the-mars.webp`). Reference `screenshots/*.png` for visual QA during review.

## Task breakdown

Each task below is implemented independently via the subagent workflow in [CLAUDE.md](CLAUDE.md). Tasks should be completed roughly in order since later ones depend on shared models/tokens/layout from earlier ones.

1. **Shared data models & assets** — Define TypeScript interfaces `ExperienceEntry`, `Stat`, `Project` under `src/app/models/` (or similar) with the verbatim sample data above as typed arrays (plus the tech-stack string list); copy all files from the design handoff `assets/` folder into `src/assets/`.
2. **Design tokens & global styles** — `_tokens.scss` with CSS custom properties for the full palette/typography/spacing scale above; Google Fonts import; shared keyframes (`floatSlow`, `fadeInDown`, `marquee`) available globally.
3. **Layout shell & Nav component** — Fixed header with wordmark, anchor links (Experience/Work/Contact) with smooth scroll, "Available now" pulsing-dot badge; assembled into `AppComponent`.
4. **Hero component** — Two-column hero with parallax orbs, eyebrow entrance animation, headline/bio/meta/badge copy, CTA buttons, 3D-tilting portrait photo (mousemove/mouseleave via `HostListener` + `ElementRef`).
5. **Tech stack marquee component** — Duplicated pill-chip row, pure-CSS infinite scroll loop, verbatim stack list.
6. **Experience component** — Vertical timeline from the `ExperienceEntry[]` model, `IntersectionObserver` scroll-reveal per entry, scroll-driven timeline progress fill.
7. **Stats component** — 4-column stat grid from the `Stat[]` model, scroll-reveal.
8. **Projects component** — 15-card responsive grid from the `Project[]` model, mousemove tilt + hover lift per card, scroll-reveal.
9. **Contact/Footer component** — Eyebrow/H2/subline, 3 CTA pills (email/LinkedIn/GitHub), footer copyright/location line, colophon note.
10. **Global responsive & accessibility polish** — Responsive breakpoints across all sections (mobile/tablet/desktop grid collapses), alt text audit, contrast check, `prefers-reduced-motion` handling, keyboard nav check.
11. **Performance pass** — Lighthouse run on the built app, fix findings (image sizing/lazy-loading, font loading strategy, etc.) to reach ≥90 performance/accessibility.

## Task 12 — Cipher/decode text reveal animation (Hero badge)

Applies to the badge in the Hero section (`src/app/components/hero/hero.html`):
```html
<div class="badge"><span class="dot"></span><span><strong>This entire site was built in 2 hours</strong> — designed with Claude Code, translated to Angular, and published.</span></div>
```

Behavior:
- On page load, the badge's text content (both the bold lead-in and the rest of the sentence) initially renders as random characters/numbers/symbols (e.g. `!x$9 #k...`), same length/word-spacing as the real text so layout doesn't shift.
- ~2 seconds after load, over ~1–1.5 seconds, characters rapidly cycle and lock in sequentially left-to-right to reveal the real text.
- After holding the real text for a few seconds, it ciphers back to random characters — this "hide" animation runs over the same duration as `REVEALING_DURATION_MS`, but in reverse: characters re-scramble starting from the LAST character back to the front (the reveal boundary sweeps right-to-left, mirroring the left-to-right reveal).
- Once fully ciphered again, hold for ~5 seconds before decoding again. The whole cycle loops continuously: scrambled (initial ~2s hold) → reveal (left-to-right) → hold revealed (~3.5s) → hide (right-to-left re-cipher, same duration as reveal) → hold ciphered (~5s) → reveal again → ... (repeats indefinitely).
- Respect `prefers-reduced-motion`: show the real text immediately with no cipher/scramble effect.
- Implemented as an Angular standalone-component-idiomatic effect (signal-driven, not direct DOM string mutation via jQuery-style code), scoped to the Hero component — not a reusable directive/service unless that emerges naturally as the cleanest implementation.

## Task 14 — Hero background particle/node network (canvas)

Goal: a first-impression, "shows the workshop" background effect behind the Hero section — decided over simpler alternatives (gradient mesh, code-rain) specifically because it reads as systems/AI/engineering and is real generative motion, not a static decoration. Accepted tradeoff: highest implementation/perf cost of the options considered.

Behavior:
- A full-bleed `<canvas>` layer sits behind the Hero section's content (above the existing background orbs or replacing them — developer's call on visual layering, but must not reduce text legibility) rendering a sparse field of soft dots that drift slowly in random directions (wrap or gently bounce at edges, no jitter).
- Thin lines are drawn between particles that are within a distance threshold of each other, with line opacity fading by distance (closer = more visible).
- When the cursor is over the Hero section, nearby particles also draw a connecting line to the cursor position (reusing/extending the section's existing `(mousemove)`/`(mouseleave)` bindings already used for the photo-tilt/orb-parallax effect — do not add a second competing mousemove listener).
- Visual restraint: low opacity, teal/muted palette consistent with existing tokens (`--color-accent-teal`, hairline-style opacity) — this is ambient texture behind the headline/CTAs, not a focal element.
- Performance: single `requestAnimationFrame` loop, particle count scaled down on narrow viewports, pauses when the tab/page is hidden (Page Visibility API) and on `prefers-reduced-motion` (render either a static single frame of dots with no lines/motion, or skip the canvas entirely — developer's call, document the choice).
- Canvas is `aria-hidden="true"` / `pointer-events: none` (purely decorative, must never block clicks on hero content or interfere with keyboard/screen-reader navigation).
- Proper cleanup of the animation frame loop and any listeners in `ngOnDestroy`.

## Task 15 — Projects card hover personality: HUD corner reticle + image micro-zoom

Goal: give the Projects cards (`src/app/components/projects/`) a bit more "systems/HUD" personality on hover, consistent with the site's identity established by the Hero's cipher text and particle network — without touching the tag/title/blurb TEXT itself. Explicitly rejected: scrambling/ciphering the card's tag text on hover, since users naturally sweep the cursor across a 15-card grid while scanning, and a text-scramble effect firing repeatedly during that scan would compete with the tags' actual job (fast scannability) rather than add personality.

Behavior (pure CSS, no new JS/state — layers on top of the existing mousemove tilt/shadow, which stays unchanged):
- Four small teal "reticle" corner brackets (L-shaped, like a camera viewfinder/selection frame) appear at the four corners of a card on hover: hidden/inset by default, sliding outward slightly while fading in to their resting corner position.
- The card's cover image does a subtle scale-up (micro-zoom, e.g. ~1.05-1.08x) on hover, clipped to the image's own box so it never bleeds into the card's text area below.
- Purely decorative — corner elements are `aria-hidden`/non-interactive, `pointer-events: none`, and don't affect the card's existing keyboard/DOM semantics.
- Respect `prefers-reduced-motion`: corners and zoom still appear/disappear on hover (no animated transition needed to actually see them), just without the animated transition — consistent with this project's existing `prefers-reduced-motion` pattern of using `transition: none` rather than removing the hover state outright.

## Task 16 — Projects thumbnail color unification (desaturate → reveal on hover)

Goal: the 15 project thumbnails are real screenshots/logos from disparate sources (games, mobile apps, blockchain UIs) with inconsistent, often bright/saturated styling that clashes with the site's dark navy/teal "systems/HUD" palette. Since recompressing/redesigning the actual image files is out of scope (no image-editing tooling), fix this with a CSS-only treatment: thumbnails render desaturated/toned-down by default (unifying the grid into "one system" at rest) and reveal full color on hover, alongside the existing corner-bracket + zoom hover treatment from Task 15 — reinforcing the reveal-on-interaction language already used everywhere else on the site (cipher text, scroll-reveals, tilt).

Behavior (pure CSS, layers on top of Task 15's `.card-image img` hover-zoom — no new component logic):
- Default: thumbnail images are desaturated/dimmed with a lean toward the site's TEAL accent hue (`--color-accent-teal`, oklch hue ~200 — the color already used for links/CTAs/eyebrows/corner-brackets/particle-network lines) rather than neutral gray or generic blue — a "duotone" feel that echoes the page's actual signature color instead of an unrelated hue. Exact values need numeric/visual verification to dial in so it reads as intentional/moody and clearly teal, not washed-out gray or the wrong blue family.
- On hover: filter fades back to normal color (`filter: none`) over the same kind of smooth transition already used for the zoom, so color and zoom animate together.
- `prefers-reduced-motion`: filter/color still changes on hover, just without an animated transition (consistent with the project's established reduced-motion pattern elsewhere).

## Task 19 — Project card external links

Each project card (`src/app/components/projects/`) should link out to its real project/store/repo page. `Project` gets an optional `link?: string` field; the whole card becomes a clickable link (`target="_blank" rel="noopener noreferrer"`) when a link is present, keeping all existing hover behavior (tilt, corner reticle, image zoom/color reveal) unchanged. Cards without a link stay as plain non-interactive cards (no href = no navigation, not a fabricated placeholder URL).

Verbatim URLs (13 of 15 projects — `Hive Stone` and `To The Mars` have no URL yet and must NOT be guessed):

| Project | URL |
|---|---|
| Visit Pieniny | https://bartosz546.github.io/visit-niedzica-webpage/ |
| Provably Fair Certification Standard | https://www.provablyfair.org |
| Position List — Q88 (Android) | https://play.google.com/store/apps/details?id=com.q88.qotf |
| Position List — Q88 (iOS) | https://apps.apple.com/us/app/position-list-q88/id1227401979 |
| Dapp Connect | https://dapp-connects.com |
| Q88 | https://veson.com/products/q88 |
| Lost Relics — Slot Game | https://games.evolution.com/slots/lost-relics |
| STEEM Secure Login | https://github.com/bartosz546/Steem-Secure-Login-Browsers-Extensions |
| Provably Fair Lottery | https://cardanocasino.com/en/lottery |
| Crypto Miner | https://crypto-miner-client.hiveslotgames.com/?steemAccountName=FUN_MODE_g9u1nt&funMode=true |
| European Roulette | https://european-roulette-client.hiveslotgames.com/?steemAccountName=FUN_MODE_g9u1nt&funMode=true |
| Video Poker | https://video-poker-client.hiveslotgames.com/?steemAccountName=FUN_MODE_g9u1nt&funMode=true |
| Blackjack | https://blackjack-client.hiveslotgames.com/?steemAccountName=FUN_MODE_g9u1nt&funMode=true |

## Task 20 — Fix Hero badge layout shift during cipher animation

Bug: the Hero badge (`src/app/components/hero/hero.html`, `.badge`) is `display: inline-flex` with no fixed dimensions, so its box shrinks/grows to fit whatever text is currently rendered. Since the cipher effect (Task 12/13) replaces characters with random glyphs from a proportional font every ~50ms, the rendered pixel width of same-length text segments fluctuates frame to frame, which can change word-wrap line breaks and therefore the badge's height — visibly "jumping" the page layout up and down, especially disruptive on narrow/mobile viewports where the badge already wraps across multiple lines.

Fix:
- Give the badge a fixed size (width/max-width and a locked height reserving enough lines for the real revealed text at typical viewport widths) so it never resizes during any cipher phase (scrambled, revealing, revealed, hiding).
- The reserved size must comfortably fit the actual real text without truncation in normal operation.
- As a safety net for the rare case where scrambled characters happen to render wide enough to need more lines than reserved: clip the overflow with a multi-line text-ellipsis truncation (CSS line-clamp — "hide the overflow with an ellipsis / 3 dots") rather than letting the box grow or wrapping further.
- Needs live-in-browser tuning (real device widths, real font rendering) to pick the right line count / height per breakpoint — not just a value guessed from font-size arithmetic.

## Definition of done (per task)
- Implementation matches this spec (pixel-for-pixel on visuals/copy/data, per Fidelity above).
- Code reviewer findings resolved (non-trivial ones re-implemented).
- Unit tests pass where applicable.
- Entry logged in `activity.md` per [CLAUDE.md](CLAUDE.md).
