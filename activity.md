# Activity Log

## 2026-07-22 — Spec update
- Replaced prd.md placeholder content/task list with the real design-handoff spec (Bartosz Kurek portfolio) per user decision. Source: `design_handoff_portfolio_angular/README.md` + `reference-design.html`.
- Task I1 (migrate to latest stable Angular) — checked `package.json`: project already on `@angular/core ^21.2.0` (current latest). No migration needed; marking N/A.

## Task 1 — Shared data models & assets — COMPLETE
- Added `src/app/models/{experience-entry,stat,project}.{model,data}.ts`, `tech-stack.data.ts`, `index.ts` with verbatim content from prd.md (8 experience entries, 4 stats, 15 projects, 14 tech items).
- Copied 16 asset files into `src/assets/`; wired `src/assets` → `assets` output in `angular.json` build target.
- Reviewer: no findings. Tests/build: PASS.

## Task 3 — Layout shell & Nav component — COMPLETE
- Added standalone `Nav` component (`src/app/components/nav/`) — wordmark, anchor links, "Available now" badge with static glow dot; wired into `AppComponent`, removed default scaffold markup.
- Added `scroll-behavior: smooth` globally.
- Reviewer found non-trivial issue: `app.spec.ts` still asserted on removed scaffold `h1` text, breaking `ng test`. Re-spawned developer to fix — replaced with an assertion that `app-nav` renders. Re-tested: PASS.

## Task 4 — Hero component — COMPLETE
- Added standalone `Hero` component: parallax orbs, fadeInDown eyebrow, verbatim hero copy/CTAs, signal-driven 3D photo tilt + orb parallax on mousemove, `prefers-reduced-motion` guard.
- Reviewer found non-trivial gap: no unit test for tilt/parallax math (prd.md explicitly requires it). Re-spawned developer to add `hero.spec.ts` covering transform calculations and reduced-motion guard.
- Tests/build: PASS (6/6 tests).

## Task 5 — Tech stack marquee component — COMPLETE
- Added standalone `TechMarquee` component: duplicated 14-item stack list into a 28-item seamless CSS marquee loop, `prefers-reduced-motion` guard.
- Reviewer: only trivial style-consistency nits (no fix needed). Tests/build: PASS.

## Task 6 — Experience component — COMPLETE
- Added standalone `Experience` component: 8-entry timeline from `EXPERIENCE_ENTRIES`, IntersectionObserver one-shot scroll-reveal, scroll-driven progress fill via pure `computeProgress()` method.
- Reviewer found 2 issues: (1) critical — `ng test` failed with `IntersectionObserver is not defined` in jsdom; (2) non-trivial — no test coverage for `computeProgress`. Re-spawned developer: added `src/test-setup.ts` IntersectionObserver stub wired via angular.json test target, added `experience.spec.ts` covering progress-calc edge cases.
- Tests/build: PASS (11/11 tests).

## Task 7 — Stats component — COMPLETE
- Added standalone `Stats` component: 4-column hairline grid from `STATS` model, reusing Experience's IntersectionObserver reveal pattern, 4→2 col responsive collapse.
- Reviewer: no findings. Tests/build: PASS (12/12 tests).

## Task 8 — Projects component — COMPLETE
- Added standalone `Projects` component: 15-card responsive grid (3→2→1 col) from `PROJECTS` model, per-card signal-driven 3D tilt + hover lift/shadow, combined with scroll-reveal (translateY baked into the same transform signal per card).
- Reviewer found non-trivial issue: card-to-DOM reveal mapping was a fragile positional zip with no test coverage of the riskiest logic (`ngAfterViewInit`/IntersectionObserver mapping). Re-spawned developer: replaced with a `WeakMap<Element, ProjectCard>` + length-guard, added a test that spies on `IntersectionObserver` and verifies the correct card updates. Re-reviewed: approved.
- Tests/build: PASS (17/17 tests).

## Task 9 — Contact/Footer component — COMPLETE
- Added standalone `Contact` component: reveal-tracked heading + 3 CTA pills (email/LinkedIn/GitHub), always-visible footer row + colophon note. Last of the 7 content sections — full page now assembled (Nav, Hero, TechMarquee, Experience, Stats, Projects, Contact).
- Reviewer: no findings. Tests/build: PASS (18/18 tests).

## Task 10 — Global responsive & accessibility polish — COMPLETE
- Manually browser-tested the assembled page (all 7 sections render correctly, all 16 images return 200, content verbatim-matches prd.md) and found a real bug: nav overflowed horizontally at mobile widths (479px content in a 375px viewport), clipping the Contact link and "Available now" badge off-screen.
- Fixed: `nav.scss` gets a `max-width:575px` media query (reduced padding/gap/link size, hides the decorative badge); added global `:focus-visible` outline (previously no focus styling existed anywhere); computed WCAG contrast for `--color-text-muted` on `--color-bg` = 6.01:1 (passes AA, no token change needed).
- Reviewer independently re-verified selector correctness and the contrast math. Re-tested live in browser post-fix: nav scrollWidth now exactly 375px (no overflow). Tests/build: PASS (18/18).

## Task 11 — Performance pass — COMPLETE (final task)
- Adopted `NgOptimizedImage` for the hero portrait (`ngSrc` + `priority` + explicit dimensions) and all 15 project cards (`fill` mode in a positioned wrapper).
- Ran a real Lighthouse audit against a production build: Accessibility 100/100. Performance scored 66-71/100 under default simulated throttling but 100/100 with throttling disabled.
- Reviewer pushed back on accepting that gap at face value. Re-spawned developer to dig into diagnostics: LCP element is actually the hero bio text (not an image), Render Delay is 91% of LCP, real main-thread work is ~0.5s, zero render-blocking resources, font-display already correct. Root cause: Lighthouse's Lantern simulator amplifies CSR-bootstrap time under 4x CPU/slow-4G simulation — an inherent characteristic of this prd.md-specified static CSR architecture (no SSR in scope; would be an inappropriate scope change at the last task), not a fixable defect.
- Also cleaned up a stray `lighthouse-report.json` left in the repo root and added it to `.gitignore`.
- Reviewer re-reviewed and approved. Tests/build: PASS (18/18).

## Task 12 — Cipher/decode text reveal animation (Hero badge) — COMPLETE
- Added to prd.md as a new task (user request, outside the original 11-task breakdown).
- Implemented a signal-driven state machine in `Hero`: 2s scrambled → 1.2s left-to-right sequential reveal with flicker on unrevealed chars → 3.5s holding real text → loops indefinitely. Core scramble/reveal logic extracted as pure, testable methods (`pickRandomChar`, `buildDisplayText`); literal spaces never scramble so layout stays stable; bold/plain split preserved via string slicing in the template. Respects `prefers-reduced-motion` (shows real text immediately, no interval created).
- Developer found and fixed a real regression while adding tests: `Hero.ngOnInit` now calls `matchMedia` unconditionally, which crashed `app.spec.ts` in jsdom (no `matchMedia` there) — added a global polyfill in `src/test-setup.ts`, guarded so it doesn't override any test's local mock.
- Reviewer hand-traced the state machine for off-by-one/stuck-phase bugs, verified text reconstruction and the test-setup change's blast radius: no non-trivial findings, approved.
- Live browser check: confirmed scrambled initial state, a mid-reveal frame (left portion locked to real text, right portion still scrambling), and an exact full-text match at completion. Couldn't observe a full loop cycle live because the browser pane was in a backgrounded/hidden state in this tool session (confirmed via `document.hidden` and a tool timeout message), which throttles timers — an environment artifact, not an app bug; the re-scramble transition was independently verified correct by code review.
- Tests/build: PASS (24/24 tests).

## Task 13 — Refine cipher animation: reverse hide + 5s ciphered hold — COMPLETE
- User request: after the revealed hold, cipher the badge text back over the same duration as `REVEALING_DURATION_MS`, sweeping right-to-left (last character re-scrambles first, front stays real longest), then hold fully ciphered ~5s before the next reveal.
- Added a `'hiding'` phase to Hero's state machine (`scrambled → revealing → revealed → hiding → scrambled → ...`), implemented by reusing the existing `buildDisplayText` pure function unchanged — the reverse sweep comes purely from decreasing `revealedCount` over time instead of increasing it. Added `HIDDEN_HOLD_DURATION_MS=5000` and a `scrambledHoldMs` field so only the very first page-load hold stays short; every subsequent loop iteration holds ciphered for 5s.
- Important: discovered the file's three original duration constants had been hand-tuned by the user (1000/1400/10000ms) since Task 12 finished, differing from what was originally implemented (2000/1200/3500ms) — explicitly instructed the developer NOT to touch those, only add the new phase on top of whatever values were already there.
- Reviewer hand-traced the full loop and the hiding-phase math, confirmed correct sweep direction, no stuck/skipped phases, and confirmed the protected constants were untouched. Approved.
- Tests/build: PASS (26/26 tests).

## Task 14 — Hero background particle/node network (canvas) — COMPLETE
- User request following a design discussion: canvas-based particle/node network behind the Hero section (drifting dots, distance-based connecting lines, cursor-reactive) to make a stronger first impression — chosen over cheaper alternatives (gradient mesh, code-rain) for its "systems/AI/engineering" read, at the cost of being the most implementation/perf-expensive option.
- New `ParticleNetwork` plain-TS class (`src/app/components/hero/particle-network.ts`) encapsulating particle physics (wrap-around drift), O(n²) distance-based connection-line alpha, and rendering — kept separate from `Hero` so the physics/geometry math stays unit-testable without a real canvas context.
- `Hero` drives it via a `requestAnimationFrame` loop wired into `ngAfterViewInit`/`ngOnDestroy`, reusing the existing tilt-related `onMouseMove`/`onMouseLeave` handlers for cursor-line interaction (no second mousemove listener). Canvas sized via `devicePixelRatio`, `aria-hidden="true"`, `pointer-events:none`, layered behind the existing orbs and content.
- Respects `prefers-reduced-motion` (renders one static frame, no motion) and Page Visibility (pauses the rAF loop when the tab is hidden).
- Reviewer found one non-trivial bug: reduced-motion was bypassed when a hidden tab became visible again (the resume branch didn't re-check the media query). Re-spawned developer: extracted a `shouldAnimate()` helper, gated the resume path on it, added tests exercising that exact regression. Also fixed two unrelated pre-existing stale test literals ("2 hours" vs the actual "4 hours" badge copy, apparently hand-edited outside this workflow) that were blocking a fully green suite.
- Re-reviewed and approved. Tests/build: PASS (41/41 tests).
- Live browser verification was limited this session: the tool's browser pane wasn't compositing at all (confirmed via `window.innerWidth` reporting 0 and a direct screenshot call failing with "the Browser pane is not displayed"), so on-screen canvas sizing couldn't be confirmed visually. Verified everything not dependent on real viewport dimensions instead (DOM structure, aria-hidden, pointer-events, z-index/layering, no console errors) — all correct. Recommended the user do a final visual check in their own browser.

## Task 15 — Projects card hover: HUD corner reticle + image micro-zoom — COMPLETE
- Followed a design discussion where the user correctly pushed back on an earlier suggestion to reuse the cipher/scramble text effect on project card tags (risk: users naturally sweep the cursor across a 15-card grid while scanning, so a scramble-on-hover would repeatedly fight against fast readability). Landed on a trimmed, text-free alternative instead.
- Added 4 static `<span class="corner corner-{tl,tr,bl,br}">` elements per card (pure CSS, no new component logic) that fade/slide in as teal L-shaped "reticle" brackets on hover, plus a clipped image micro-zoom (`scale(1.06)`, `overflow:hidden` on `.card-image` to prevent bleed into the text below). Both layer on top of the existing JS-driven tilt/shadow without conflicting. `prefers-reduced-motion` extended to zero out the new transitions too.
- Reviewer verified corner orientation (no copy-paste L-shape mix-ups), confirmed no visual collision between the bottom corners and blurb text, and confirmed no bleed risk — approved with no code changes needed for Task 15 itself.
- Along the way, reviewer caught a real (non-flaky, reproducible) but unrelated test failure: `hero.spec.ts` expected `HIDDEN_HOLD_DURATION_MS` to be 5000, but `hero.ts`'s actual value is 4000 — another instance of the user hand-tuning Hero's timing constants outside this workflow (same pattern as the "2 hours"/"4 hours" badge text and the reveal-phase durations in Task 14). Fixed the stale test to match reality, left `hero.ts` untouched, matching established precedent.
- Tests/build: PASS (41/41 tests).

## Task 16 — Projects thumbnail desaturate-then-reveal-on-hover — COMPLETE
- User's problem: the 15 project thumbnails (real screenshots/logos from disparate sources) clash visually with the site's dark navy/teal palette. Since recompressing/redesigning the actual image files is out of scope (no image-editing tools), addressed it with a CSS-only fix.
- `projects.scss`: thumbnails now default to `filter: grayscale(60%) brightness(0.85) contrast(1.05)`, fading to full color (`filter: none`) on hover alongside the existing Task 15 zoom — reinforcing the reveal-on-interaction language used elsewhere (cipher text, scroll-reveals, tilt). Reused Task 15's existing `prefers-reduced-motion` rule (`transition: none` on the same selector) with no new selector needed.
- Reviewer approved with no findings. Verified live in a working browser session this time (pane rendered correctly): confirmed the default filter is applied via computed styles and the hover rule (`filter: none`) is correctly registered in the compiled stylesheet.
- Tests/build: PASS (41/41 tests).
- Note: exact filter values (60%/0.85/1.05) are a reasonable starting point per the plan, but were not visually confirmed against the real images since screenshot capture wasn't available this session — flagged to the user to eyeball and request tuning if it reads as washed-out rather than intentional.

## Task 17 — Tune thumbnail filter toward blue-tinted duotone — COMPLETE
- User request: lean the Task 16 desaturation toward blue/navy rather than neutral gray, to better match the site's palette.
- Since screenshots weren't available this session (same browser-pane compositing limitation as before), verified numerically instead: drew each of the 15 real thumbnails through candidate CSS filters on an offscreen canvas (`ctx.filter` supports the same syntax) and computed average HSL. First attempt (`grayscale(100%) sepia(60%) hue-rotate(180deg) saturate(300%) brightness(0.75) contrast(1.1)`) landed consistently on blue (~219° hue across all 15 images) but was fairly muted (~0.24 avg saturation). A lighter-grayscale alternative was rejected — letting original hues bleed through caused inconsistent per-image results (some cards read red/green instead of blue). Strengthened to `grayscale(100%) sepia(80%) hue-rotate(190deg) saturate(500%) brightness(0.7) contrast(1.1)`, confirmed via the same method to keep the consistent ~220-235° blue hue with ~45% higher saturation (~0.35 avg) — a clearly visible tint rather than near-gray, and reliably blue regardless of each thumbnail's original colors.
- Reviewer approved but flagged (and I agree) that numeric HSL sampling confirms the mechanical claim (consistent blue hue, higher saturation) but can't judge overall aesthetic feel or how the new saturated blue sits next to the existing teal accent — recommended a human visual pass before fully signing off.
- Tests/build: PASS (41/41 tests).

## Task 18 — Retune thumbnail duotone from blue to teal accent hue — COMPLETE
- User feedback: Task 17's blue duotone (avg hue ~231°) didn't fit the page's actual theme. Correctly identified that the site's real signature color is the teal/cyan accent (`--color-accent-teal`, oklch hue ~200) used everywhere — links, CTAs, eyebrows, corner brackets, particle network — not generic blue.
- Numerically swept `hue-rotate` (150/160/165/170/175deg) via the same canvas-HSL-sampling method across all 15 real thumbnails to find the best match before implementing anything. `165deg` landed closest: average hue 201° (near-exact match to the teal token), tight 180-213° range (no drift into purple/blue/green on any image), ~0.56 avg saturation (clearly visible, not washed out).
- Applied `hue-rotate(165deg)` (was 190deg), all other filter values (`sepia(80%)`, `saturate(500%)`, `brightness(0.7)`, `contrast(1.1)`) unchanged. Reviewer independently re-verified the value and the HSL/oklch hue-family reasoning. Confirmed live via computed style before/after.
- Tests/build: PASS (41/41 tests).

## ALL TASKS COMPLETE
All 11 tasks (1-11; infrastructure Task I1 was N/A — already on latest Angular) from prd.md are implemented, reviewed, tested, and logged. The Bartosz Kurek portfolio site (design-handoff spec) is fully built: Nav, Hero, TechMarquee, Experience, Stats, Projects, Contact — responsive, accessible (100/100 Lighthouse a11y), and performance-audited.

## Task 2 — Design tokens & global styles — COMPLETE
- Migrated project to SCSS (`styles.scss`, `app.scss`, new component default in angular.json schematics).
- Added `src/app/_tokens.scss` with 32 CSS custom properties (colors, fonts, type scale, spacing, radii) matching prd.md verbatim.
- Added global keyframes (`floatSlow`, `fadeInDown`, `marquee`) to `styles.scss`; added Google Fonts links to `index.html`.
- Reviewer: no findings. Tests/build: PASS.
