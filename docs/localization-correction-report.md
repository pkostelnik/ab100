# Localization Correction Report

Date: 2026-09-06. Scope: work package 3 of the approved gauntlet-corrections plan, specifically G12. Implemented in the existing checkout. No commits, pushes, deployment, new runtime dependencies, or production build.

## Changes

- `content-de.js`: complete authored German question records keyed by the 101 stable numeric IDs and canonical revision 2. Includes all stems, 403 options, 101 explanations and 15 matching labels. Product names, protocol names, answer positions, matching letters and source URLs remain intact. German numeric examples retain USD amounts, using German separators.
- The same file contains German records for nine lab titles, summaries, 36 checklist entries, 17 artifacts and 23 concepts; six outcomes, three areas, five insights and five resource labels. Lab, area, insight and resource keys reuse canonical IDs. Outcomes receive six explicit semantic IDs through an exact full-English-record lookup, not array position or word replacement.
- `i18n.js`: complete paired UI dictionaries, exact full-topic/status/provenance mappings, interpolation for connected-lab counts, and English/German legal records. No isolated-word replacement or regex translation remains. The privacy text now describes language preferences, revision backups and sessionStorage exams accurately; provider placeholders remain explicit.
- `app.js`: localized display views select only question text fields and require matching revisions. Canonical data continues to drive IDs, grading, storage and exam references. Missing/stale German question records fall back as a whole to English with a visible German warning and English content-language attributes. Language switching does not reset drafts, checked answers, matching selections, lab steps, exam references, deadline or frozen results.
- Search includes current-language stems, options, explanations, matching labels and topics, plus canonical English wording and source URLs. English technical terms remain searchable in German mode. This is case-insensitive substring search, not stemming, fuzzy search, transliteration or semantic retrieval. A selected question is retained by ID if it remains in the changed-language result set; otherwise normal filtered-list rendering applies.
- `index.html`: static UI text, metadata, accessible labels, placeholders, modal controls, headings, source descriptions, theme labels and footer are annotated for localization. `content-de.js` loads before i18n/application initialization. External certification/product names and language autonyms intentionally remain unchanged. Five resource records are rendered as links with localized descriptions; source URLs are unchanged.
- Only two permitted English content corrections were made: Q46's stem now says `supported solution workflow`, removing the answer cue; Q73's fragment is now `Configure environment bindings and separately review post-deployment settings.` No answer keys, revisions, lab mappings or other English questions were changed by this package. These are unreleased revision-2 wording corrections, not new semantic revisions.
- Tests added using the existing conventions: `tests/localization.test.cjs` and `tests/browser/localization.spec.cjs`. Existing runtime tests and `study-state.js` were not edited. The existing `npm test` command still runs its original state suite; use the explicit combined Node command below to include localization.

## Evidence

Tests use isolated local browser contexts at `http://127.0.0.1:8767`, with external HTTPS requests blocked. No personal browser profile or existing user study data was accessed. The existing Playwright desktop projects cover Chromium, Firefox and WebKit on this macOS machine.

| Stage | Exact command | Result |
| --- | --- | --- |
| Initial behavioral red | `npx playwright test tests/browser/localization.spec.cjs --project=chromium` | 2 failures: German placeholder remained English; German content records were absent. |
| Initial focused green | `npx playwright test tests/browser/localization.spec.cjs --project=chromium` | 2 passed. |
| First expanded cross-browser run | `npm run test:browser` | 75 passed, 6 failed. All 60 original runtime cases passed. Two new test defects repeated in each engine: raw HTML comparison did not normalize self-closing `br` tags; direct pointer checking targeted the input covered by its visible label. Tests were corrected to compare browser-normalized HTML and click the visible label, matching existing runtime tests. |
| Expanded focused green | `npx playwright test tests/browser/localization.spec.cjs` | 21 passed before the additional storage/search assertions. |
| Final combined Node run | `node --test tests/localization.test.cjs tests/study-state.test.cjs` | 22 passed, 0 failed: 5 localization and 17 existing study-state tests. |
| Final full browser run | `npm run test:browser` | 84 passed, 0 failed: 28 per engine, comprising 8 localization and 20 existing runtime cases. |
| Final static checks | `node --check app.js && node --check i18n.js && node --check content-de.js && node --check questions.js && node scripts/validate-content.mjs && git diff --check` | All exited 0. Existing content validator reports 101 questions, 9 labs, 3 areas and 5 insights; this does not fix or certify its separate G17 weaknesses. |

### Automated Coverage

- Exact question-ID set and revision matching; nonempty display fields; option and matching-label counts; unchanged matching letters; no unauthorized locale fields; correct answers still score correctly for all 101 localized records.
- All canonical lab/area/insight/resource IDs and outcome identities have translations. UI key parity, HTML annotation coverage and script ordering are checked. Product-only matching options are explicitly permitted to remain unchanged.
- All 101 German stems, option texts, matching labels and explanations are checked against actual browser-rendered DOM. This exhaustive rendering uses controlled in-memory state and direct renders, not 101 manual user submissions.
- Search is exercised through the visible search field for German answer wording and English technical wording; an exhaustive in-browser loop tests each translated field, canonical topic and source URL against the filter. It checks inclusion of the relevant ID, not unique ranking or every possible partial query.
- All nine lab dialogs, five insight dialogs and three legal dialogs are checked in English and German, including status/source labels. Annotated visible and accessible copy and the five resource labels/URLs are checked in both directions. External destinations are not visited.
- User interactions cover single, multiple and partial matching drafts across switches; a checked answer persists; a checked lab step survives an open-dialog language rerender and reload. Open-dialog language switching calls the same handler directly because the header is behind the modal.
- An active exam's serialized session remains byte-for-byte identical across a language change after 61 seconds of simulated elapsed time; its timer reads 19 minutes remaining in German. A completed result remains unchanged when switching back. Existing runtime tests additionally cover every answer format, resume, expiration, frozen results, abort and storage failures.
- German startup with failed storage writes, warning copy, no-match and no-weak-spots messages, abort/reset confirmation text, insufficient-bank error text, and stale-translation warning/fallback are exercised. All new browser cases assert no uncaught page errors.

## Editorial Diagnostics

All 101 German question records were authored against the current complete English bank. The authoring pass retained technical qualifications and the reasoning against distractors, including preview/region limits, MCP transport, A2A prerequisites, service identity scope, governance versus residency, and numeric assumptions. Selected German wording was shortened where translation added unnecessary length; this is not independent editorial acceptance.

The Node diagnostic uses UTF-16 string length, with equal credit split across tied lengths. No numerical threshold is treated as proof of translation quality or distractor plausibility.

| Final German measurement | Result |
| --- | --- |
| Single / multiple / matching | 89 / 8 / 4 |
| Correct single option strictly longest | 28/89 (31.46%) |
| Correct single option strictly shortest | 13/89 (14.61%) |
| Longest-first expected correct count, split ties | 30.3333/89 (34.08%) |
| Shortest-first expected correct count, split ties | 14.5/89 (16.29%) |
| Duplicate normalized stems | 0 |
| Identical normalized unordered option sets | 0 |

Strict-longest German IDs: 3, 14, 17, 23, 25, 27, 31, 33, 34, 44, 46, 47, 51, 60, 63, 65, 68, 70, 71, 73, 75, 84, 85, 86, 88, 90, 98, 99.

The initial German draft had 38 strictly-longest correct answers and a 40.3333/89 tie-split longest-first count. A wording review reduced unnecessary expansion without changing answer order or meaning. The final longest-first strategy still outperforms uniform 25% guessing in this bank and is more predictive than the English measurements in the content report. This remains an editorial risk for independent review, not a claim of psychometric equivalence. The universal longest-answer leak from G03 is not present.

## Limits and Handoff

- This is an authored translation, not externally certified, professionally accredited, or independently SME-reviewed. Automated coverage proves presence, contracts and rendering, not semantic equivalence or idiomatic quality. Independent translation/content review and learner discrimination testing remain outstanding.
- No independent reviewer/subagent facility was available in this tool set. Work package 6 remains the independent acceptance gate.
- No new viewport/overflow, visual screenshot, contrast, screen-reader, focus-trap or mobile-device audit was performed. Existing G10/G11/G13 presentation work remains separate. Longer German copy and the resource container require responsive review by that package.
- Browser-native beforeunload warning wording, browser error pages and external websites follow browser/provider language settings and are outside application localization. Native confirmation message content is localized, but browser-owned buttons are not controlled by this app.
- English is the canonical bank. Matching question revisions are enforced at runtime. Non-question records have stable keys but no revision field in their current canonical schemas; tests catch missing/count changes, not arbitrary semantic drift. Meaning changes in those records require paired translation review. Missing/incompatible content files themselves are not handled as a network-offline recovery feature.
- The permitted Q46/Q73 corrections make portions of the prior English content report and generated `AB100.md` stale. Their maintenance belongs to work package 5; neither file was rewritten here.
- No tenant-based product verification or fresh external source audit was performed. Technical scope comes from the current English bank and its documentation-review report. Product terms and preview caveats are preserved rather than re-certified.
- Legal/provider details remain placeholders and block public publication. No operator information was invented, and no legal sufficiency is claimed.

## Review Gate Follow-up

Date: 2026-09-06. Focused corrections requested by the reviewer; no commit or publication.

- Q87 option D now uses `Bibliotheksaufrufe auf niedriger Abstraktionsebene` instead of the misleading `Niedrige Bibliotheksaufrufe`.
- Q93 option D now explicitly requires reconciling already executed partial steps before retry: `Test neu binden, den vollständigen Toolpfad prüfen und bereits ausgeführte Teilschritte vor einem erneuten Versuch abgleichen.` This preserves the recovery requirement rather than suggesting comparison of errors.
- `package.json` now runs `node --test tests/*.test.cjs` for `npm test`, including both Node suites by default. This supersedes the earlier note that localization needs a separate command. No test dependencies or lockfile changes were needed.
- No other question wording, keys, revisions, explanations or application behavior changed. No optional length-driven rewrites were made: clarity and faithful meaning take precedence over a length threshold.

| Verification | Result |
| --- | --- |
| `npm test` | 22 passed, 0 failed: 5 localization and 17 study-state tests, both discovered by the default glob. |
| `npx playwright test tests/browser/localization.spec.cjs` | 24 passed, 0 failed: 8 cases each in Chromium, Firefox and WebKit. Includes rendering all 101 questions, search, dialogs, state preservation and timer checks. |
| `node --check content-de.js && git diff --check` | Both exited 0. |

The Node length diagnostic now reports 29/89 strictly-longest correct options (32.58%), adding Q93 to the earlier list. Tie-split longest-first expected correctness is 31.3333/89 (35.21%); strictly-shortest remains 13/89 and shortest-first remains 14.5/89. Duplicate normalized stems and unordered option sets remain zero. These measurements supersede the earlier length values, not the stated editorial limitations. Q93's added length expresses the required recovery step; distractors were not padded to conceal it.

The separate runtime browser suite was not rerun in this follow-up; its earlier 60-case result remains historical evidence. All study-state Node tests and localization browser cases were rerun. No new mobile visual audit, external certification or independent full-bank semantic review is claimed.
