# Package 4: Presentation Correction Report

Date: 2026-09-06

Scope: approved package 4 in `docs/superpowers/plans/2026-09-06-gauntlet-corrections.md`; findings G10, G11, G13 and G14 in `docs/2026-09-06-gauntlet-review.md`.

## Changes

- Preserved the AB620-like visual language: Space Grotesk headings, DM Sans body, DM Mono utility labels, italic serif accents, existing navy/blue/teal palette, bordered cards and circular progress display.
- Repaired header, navigation, filters, grid sizing, matching layout and answer navigation through wrapping, shrinkable tracks and responsive stacking. No page-level overflow hiding or clipping is used. The question index retains intentional local scrolling; screen-reader-only status text uses a visually hidden utility.
- Mobile theme/language selects occupy two full columns, with reset below. Direct Labs and Insights navigation remains visible on mobile. Course path and Labs now have distinct localized headings.
- Answer copy no longer inherits the letter's monospace styling. Answer copy, matching prompts and matching selects compute to 16px at default zoom.
- Active question text and its completed indicator use the existing button foreground/background tokens. Native radio buttons, checkboxes and selects remain intact; removed pointer-event suppression from answer inputs. Current question buttons expose `aria-current="step"`.
- Dialogs make the application shell inert and wrap forward/backward keyboard focus. Escape closes the dialog. Closing restores the original trigger or its stable replacement after lab progress/language rerenders; missing triggers fall back to the main landmark. Existing post-submission explanation focus and post-navigation question focus are preserved.
- Added a focus-visible skip link, restored the search input's outline, and added a localized polite live result count. Existing storage warnings remain status regions. Timer ticks are not placed in the new live region.
- Reduced motion disables CSS animation, transitions and smooth anchor scrolling, including hover translation. The existing instant JavaScript question navigation remains instant; no JavaScript smooth override was introduced.
- Retained the localization package's rendering of all five `resources` entries and corrected their numbered source-grid alignment. All three C1756 original destinations remain exposed. Existing Study Guide/Learn/DumpsBase URLs are retained; DumpsBase is explicitly named and labeled unofficial in EN/DE.

Implementation files changed by this package: `styles.css`, `index.html`, presentation portions of `app.js`, and five new UI keys per language in `i18n.js`. Added `tests/browser/presentation.spec.cjs` and this report. No changes to `questions.js`, `study-state.js`, resource URLs, German question content, legal text or other packages' tests. Pre-existing worktree changes were preserved. No commits, push or publication.

## Regression Evidence

Tests were added before implementation. Initial Chromium runs reproduced:

- Document width 394px at a 320px viewport and 394px at 390px.
- Answer text at 11.2px, including at desktop widths.
- Active Light contrast 2.632:1.
- Missing inert modal background and skip link.
- Smooth CSS scrolling despite reduced-motion preference.
- Unnamed DumpsBase destination.

A subsequent actual-font screenshot exposed an additional problem that page-width checks alone missed: header selects squeezed to roughly 56px in the offline German fixture. A new minimum-width assertion failed before the two-column header correction. After correction, the online Chromium check measured both selects at 136px at 320px viewport width.

Final verification commands, after the last production and test changes:

| Command | Actual result |
| --- | --- |
| `npm test` | 22 passed; 0 failed, skipped or cancelled |
| `npm run test:browser` | 159 passed across Chromium, Firefox and WebKit; 0 failures; 2.2 minutes |
| `git diff --check` | Exit 0; no whitespace errors |

The 159 browser executions are 53 cases per engine: 25 presentation, 20 runtime and 8 localization. Runtime and localization tests were run unchanged.

## G10: Contrast

Measured from computed foreground/background styles using WCAG sRGB relative luminance. Active text, child text and completed checkmark use these pairs in both languages and all three engines:

| Theme | Foreground | Background | Ratio |
| --- | --- | --- | --- |
| Light | `#ffffff` | `#0969da` | 5.192:1 |
| Dark | `#ffffff` | `#2563eb` | 5.169:1 |
| High contrast | `#000000` | `#00ffff` | 16.748:1 |
| Auto, light OS | `#ffffff` | `#0969da` | 5.192:1 |
| Auto, dark OS | `#ffffff` | `#2563eb` | 5.169:1 |

Tests also assert at least 4.5:1 for featured-card utility copy, top-navigation links, eyebrows, answer text/letters after checking, source metadata and primary small-button text. Auto is separately exercised through light/dark/light OS changes without altering its stored preference.

Computed measurements persist under `test-results/presentation-*/computed-contrast.json` for all five theme conditions and three browser projects. These are generated test artifacts, not committed data.

## G11: Responsive Layout

Automated matrix: 320, 390, 560, 768, 900, 1024 and 1440 CSS pixels; EN and DE; Chromium, Firefox and WebKit. Each matrix case opens representative single, multiple and matching questions, checks document and control bounds, checks answer font sizes, exercises direct Labs/Insights links, and opens a lab dialog.

All cases passed: document width never exceeded viewport width, tested containers/controls had no horizontal clipping, answers/matching text were at least 16px, and narrow header selects met the added width floor. Native select popup rendering is supplied by the browser/OS; long option strings can require opening the native popup to read in full.

The deterministic suite blocks external HTTPS assets, so these checks exercise fallback fonts as well. A separate online Chromium pass loaded DM Sans, DM Mono and Space Grotesk and verified EN/DE single and matching views at all seven widths: document width equaled viewport width in all 28 measurements. Final German 320px and 1440px header/hero screenshots were visually inspected after the correction.

Generated fallback-font matching screenshots are under `test-results/presentation-{en,de}-{320,1440}px-*/`. Online actual-font screenshots are in:

```text
/var/folders/rn/8trqjc692z1gc_t9tpnnpn240000gn/T/opencode/ab100-package4-de-320.png
/var/folders/rn/8trqjc692z1gc_t9tpnnpn240000gn/T/opencode/ab100-package4-de-1440.png
```

## G13: Keyboard And State

All three engines passed automated checks for:

- Initial dialog focus, reverse traversal from the panel, wrap from last to first and first to last control, and inert-background rejection of attempted search focus.
- Enter/Escape opening/closing and return to lab, insight and legal triggers.
- Return to a replaced lab card after checklist progress plus language change; return to a replaced inline lab trigger after question-card rendering.
- Skip-link activation focusing main, visible search outline, and localized live result count including zero results.
- Native answer selection, explicit answer checking with explanation focus, and Next navigation with question-heading focus.
- Reduced-motion CSS, zero hover movement and no requested JavaScript smooth scrolling.
- Byte-identical active/frozen exam storage across language, theme, viewport and legal-dialog changes.

macOS WebKit keyboard traversal uses Option-Tab, consistent with the existing runtime test convention. The unchanged runtime suite additionally verifies learning/exam isolation, hidden active-exam grading, all three response formats, deadline/reload behavior, immutable results, abort cancellation, storage resilience, revision archives and reset.

## G14: Resources

Both languages and all three engines verify exact DOM hrefs and localized titles against every entry in `resources`, including `c1756-labs`, `c1756-learner-guide` and `c1756-lab-guide`. Existing Study Guide and Learn titles are asserted, and DumpsBase is explicitly identified. Source links retain `target="_blank"` and `rel="noreferrer"`.

The Microsoft Learn training-path page was fetched during this task and confirmed its current title as "Architect AI solutions for business productivity". This package verifies DOM destinations, not continued availability or factual accuracy of every external resource. No source URL was invented or replaced.

## Remaining Limits

- G18 remains an explicit release blocker: operator/address/email placeholders are unchanged. This is not publication approval or legal advice.
- No screen-reader session, real mobile hardware session, browser zoom audit, or comprehensive WCAG certification was performed. Keyboard, semantics, contrast and responsive claims above are limited to the specified evidence.
- Full cross-browser layout tests use fallback fonts; actual web-font inspection was Chromium-only.
- This package does not adjudicate question quality, validator integrity or other packages' review findings. Node diagnostics concerning German answer-length distribution remain editorial signals, not failures fixed by presentation changes.

## Reviewer 3 Follow-Up: P2 Interaction Corrections

Date: 2026-09-06. This addendum supersedes the initial report's modal return/scroll claims where they were based only on pre-focused keyboard opening. No commits or question-bank changes.

### Reproduction Before Fixes

Seven new WebKit regressions all failed before implementation:

- Keyboard activation of the skip link during an answered active exam produced the abort confirmation. The capture-phase navigation guard treated `#top` like an exit from the attempt.
- Pointer opening of lab, inline lab, insight and privacy dialogs returned focus incorrectly. WebKit did not focus the clicked buttons; `document.activeElement` was therefore not a reliable invoking element. Prior tests explicitly focused those buttons and missed this path.
- At both 320px and 1440px, a real 650px wheel event over the backdrop moved the background by 650px. `inert` blocks focus/interaction but is not a document scroll lock.

### Corrections

- The skip-link branch now runs before the exam-exit guard, prevents default navigation, focuses main and scrolls it into view instantly. It does not call `leaveExam`, render, or modify responses, session storage or deadline. Other navigation retains the existing abort guard.
- All four modal button entry paths explicitly pass the invoking element through the opener to `showModal`. Stable trigger selectors are derived from that element and survive lab-card/question-card replacement and locale refreshes.
- Opening a modal records page coordinates, fixes the body at the saved vertical offset and applies a modal-only root scroll lock. Closing unlocks and restores those coordinates instantly. Reopening content within an already-open dialog does not overwrite the saved position. The panel uses `overscroll-behavior: contain`, retains its own scrolling, and does not chain scrolling to the page.
- Focus restoration normally preserves the restored page position. If rerendering moved the trigger outside the viewport, it is brought into view with an instant nearest-edge scroll. Close calls on an already-closed modal are no-ops.
- Every expected contrast selector must resolve to at least one element. Missing targets now fail explicitly instead of silently omitting measurements.

The modal-only `overflow-y: hidden` rule is a deliberate scroll lock, not horizontal overflow masking. The existing EN/DE 320-1440px layout tests still pass with the dialog closed, and modal-width checks still pass when open.

### Verification

| Command | Actual result |
| --- | --- |
| `npx playwright test tests/browser/presentation.spec.cjs --project=webkit --grep 'keyboard skip during\|pointer modal return\|modal wheel lock'` before fixes | 7 failed, reproducing all three defects |
| `npx playwright test tests/browser/presentation.spec.cjs --grep 'keyboard skip during\|pointer modal return\|modal wheel lock\|computed small-text'` after fixes | 36 passed across all three engines, 24.2 seconds |
| `npm run test:browser` after fixes | 180 passed across Chromium, Firefox and WebKit, 2.2 minutes |
| `npm test` | 22 passed; 0 failed/skipped/cancelled |
| `git diff --check` | Exit 0 |

The full browser run now contains 60 cases per engine: 32 presentation, 20 unchanged runtime and 8 unchanged localization. Added tests verify no abort prompt and exact exam/session equality after keyboard skip; real pointer opening without pre-focusing each trigger; focus and viewport visibility after closing; backdrop wheel movement in both directions; internal panel scrolling; upper/lower panel boundary containment; exact page-position restoration; and normal document scrolling after close. Wheel tests run at 320px and 1440px using real Playwright wheel input with a 350ms settle period per event.

Scope of this follow-up: `app.js`, `styles.css`, `tests/browser/presentation.spec.cjs` and this report. The existing limitations still apply, including no physical touch-device or screen-reader test. Legal/operator placeholders remain a publication blocker.
