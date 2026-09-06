# Runtime Correction Report

Date: 2026-09-06
Scope: work package 1 of `docs/superpowers/plans/2026-09-06-gauntlet-corrections.md`; G01, G02, G06-G09.
Checkout: existing `main`. No commits, pushes, deployment, production build, or content edits.

## Changes

- `study-state.js`: DOM-independent CommonJS/browser API for response validation, exact scoring, answer submission, exam creation/editing/completion/resume, revisioned persistence, legacy migration, lab validation, and injected storage fallback.
- `app.js`: separate learning drafts, checked learning records, weak-review IDs, and exam state. Native radio/checkbox/select inputs retain focus during drafting. Every learning format requires Check answer; Try again explicitly opens a new draft without destroying the last checked record.
- Exam attempts use Fisher-Yates sampling of 20 distinct questions and start with no responses. Each has an absolute 20-minute deadline. Attempts never read or write learning answers for scoring.
- Active exam cards contain no grading classes, explanation, answer key, verification links, or related-lab help. Completion deep-freezes responses and numeric results; subsequent answer operations cannot change them. Results are formatted in the current language rather than stored as translated strings.
- Explicit Finish and timeout use the same completion transition. An answer event at or after the deadline cannot submit a late response. Background-tab return checks the absolute deadline.
- Search/topic filters are disabled throughout exam/result review, with defensive event guards. Starting an exam scrolls and focuses the question heading; resumed attempts do so after the mandatory startup disclaimer closes.
- Mode/area changes, explicit Abort, links away from the question view, and opening lab/insight material require confirmed abort during an active attempt. Cancellation preserves the attempt. Confirmed abort clears the session without affecting learning progress.
- Empty weak review stays empty; it never falls back to the full bank. Question counts describe the displayed set.
- `index.html`: state-script loading, warning region, focusable heading, Finish/Abort controls. Existing styles and visual structure retained.
- `i18n.js`: English and German keys for new runtime controls and messages only. Full localization remains a later work package.
- Test-only npm dependency/lockfile, Node test suite, static loopback test server, and Playwright projects for all three engines. Generated test artifacts and `node_modules` are ignored.

## Persistence Contract

| Key | Storage | Contract |
| --- | --- | --- |
| `ab100-study-v1` | localStorage | `{ schemaVersion: 1, answers: { [id]: { revision, value } } }`; checked learning responses only |
| `ab100-exam-v1` | sessionStorage | Versioned active/completed attempt with selected `{ id, revision }` references, response drafts, index, start time, absolute deadline, completed result, and `learningApplied` promotion marker (final follow-up) |
| `ab100-reset-v1` | localStorage | Retained opaque reset UUID for cross-tab draft invalidation; no answers or identity (final follow-up) |
| `ab100-answers` | localStorage | Legacy raw source left untouched during migration |
| `ab100-answers-backup` | localStorage | First verbatim legacy backup; never overwritten during migration |
| `ab100-lab-progress` | localStorage | Existing key; known boolean checklist entries accepted and percentages recomputed |
| `ab100-theme`, `ab100-language` | localStorage | Validated preference values; retained by Reset |

Question revisions default to `q.revision ?? 1`. Numeric and string question IDs work; navigation no longer coerces IDs to numbers. The content agent must preserve IDs for unchanged questions and increment revisions when meaning, options/order, matching labels, or the answer contract changes. Replaced questions must not inherit unrelated IDs. No runtime can infer semantic changes that retain both ID and revision.

Legacy migration occurs only when the new key is absent. It preserves the original raw string (including malformed JSON), creates a backup when none exists, and imports only existing IDs with revision 1 and structurally valid complete responses. Unknown, malformed, partial, and revised mappings are excluded with a warning. An existing new-format key, even an empty or invalid one, prevents fallback to legacy records. Stale revisioned records are never treated as current answers.

Exam resume requires the correct schema, exactly 20 unique existing IDs, matching revisions, valid response shapes, bounded index, valid start/deadline relationship, and valid completion metadata. Completed results are recomputed and compared before acceptance. Invalid/incompatible sessions are discarded with a warning; expired valid sessions complete instead of restarting the clock.

Storage property access, reads, writes, removals, JSON parsing, and stored shapes are guarded. A per-store memory overlay keeps the current visit functional after failures and displays a warning. A failed write does not hide other still-readable persisted data. Reset clears learning records, drafts, lab progress, legacy source/backup, and the exam session; it retains theme/language. In denied storage, reset applies in memory but cannot promise deletion from the inaccessible backing store.

## Test Evidence

Environment: macOS arm64, Node `v26.7.0`, npm `11.19.0`, locked `@playwright/test@1.63.0`. Playwright Chromium 153 / Firefox 155 / WebKit 26.6. Tests use isolated browser contexts at `http://127.0.0.1:8767`; external HTTPS requests are blocked. No existing user browser profile or study data was used.

Commands below are exactly the commands run (repeated green commands are summarized).

| Stage | Command | Result |
| --- | --- | --- |
| Initial Node red | `npm test` | 13 failed, 0 passed. API-existence assertion failed; dependent contracts reported missing state functions. No production state module existed. |
| Install test dependencies | `npm install` | 3 packages added; audit reported 0 vulnerabilities. |
| Browser setup failure, not a behavioral red | `npm run test:chromium -- --grep 'draft selection\|seeded learning\|all-correct'` | 5 launch failures: Chromium binary absent. |
| Install Chromium | `ls -d /Users/pkostelnik/Library/Caches/ms-playwright && npx playwright install chromium` | Installed Chromium and headless shell. Playwright also removed its unused cached Chromium 1208. |
| Browser behavioral red | `npm run test:chromium -- --grep 'draft selection\|seeded learning\|all-correct'` | 5 failed against old runtime: no Check answer for all three formats, absent start focus, 95 questions instead of empty weak review. |
| Full initial browser red | `npm run test:chromium` | 15 failed: above failures, missing state/resume API, unguarded navigation, malformed/denied storage startup failure, and missing explicit submit/reset flow. |
| First state green | `npm test` | 13 passed. |
| First browser green | `npm run test:chromium` | 15 passed. |
| Quota edge-case red | `npm test` | 13 passed, 1 failed: readable theme became null after a failed write. |
| Navigation edge-case red | `npm run test:chromium -- --grep 'opening labs\|revised questions\|keyboard draft'` | 2 passed, 1 failed: lab modal opened despite requested abort cancellation. Revision rejection and keyboard draft tests already passed. |
| Edge-case green | `npm test` | 14 passed after retaining reads on write failure. |
| Edge-case green | `npm run test:chromium` | 18 passed after capture-phase lab/insight navigation guard. |
| Install other engines | `ls -d /Users/pkostelnik/Library/Caches/ms-playwright && npx playwright install firefox webkit` | Both installed successfully. |
| First cross-browser run | `npm run test:browser` | 53 passed, 1 WebKit keyboard test failed. macOS WebKit plain Tab skipped checkboxes under its native keyboard-navigation setting. |
| Platform-specific test correction | `npm run test:browser -- --project=webkit --grep 'keyboard draft'` | 1 passed using Option-Tab for WebKit; no application workaround or focusable wrapper added. |
| Resume-focus red | `npm run test:chromium -- --grep 'seeded learning\|active exam hides'` | 1 passed, 1 failed: restored matching values/deadline survived but heading was not focused after disclaimer close. Legacy seeding test also tightened to assert actual migration and backup. |
| Final Node green | `npm test` | **15 passed, 0 failed.** Includes added nested-freeze/copy assertions that passed existing behavior. |
| Final cross-browser green | `npm run test:browser` | **54 passed, 0 failed: 18 Chromium, 18 Firefox, 18 WebKit** (25.4 seconds). |
| Syntax/content/whitespace | `node --check app.js && node --check study-state.js && node scripts/validate-content.mjs && git diff --check` | All exited 0. Existing validator reports 95 questions, 9 labs, 3 areas, 5 insights. This is not a claim that its known G17 weaknesses are fixed. |
| Dependency readback | `git status --short && npm ls --depth=0` | Intended runtime/test changes only, plus the two pre-existing untracked review/plan documents; Playwright 1.63.0. |

## Acceptance Coverage

| Finding | Evidence |
| --- | --- |
| G01 | Migrated correct learning records do not mark or score a new exam; unanswered completion scores 0/20; subsequent attempt starts empty. |
| G02 | All three formats draft before checking; exam responses reveal no grading/help DOM until completion. Multiple-choice accepts all selections before checking. |
| G06 | Matching drafts survive language rerenders and navigation/reload in an exam; checked learning matching values survive reload. |
| G07 | Start/resume focus and scrolling, disabled filters, cancellation/confirmed abort, frozen results, live timeout, expired reload, and reset covered. |
| G08 | All-correct weak-review fixture yields zero question buttons and a dedicated empty message. |
| G09 | Malformed JSON, null/array shapes, denied reads/writes/storage getters, quota-read preservation, legacy backup, revision rejection and reset tested. |

## Limitations and Handoff

- This is a static study tool, not a secure examination service. The question bank ships to the browser; developer tools can inspect it or modify local state. DOM nondisclosure and shape/revision validation are not cryptographic tamper resistance.
- Learning drafts are intentionally memory-only. Checked learning responses persist; active exam drafts persist in sessionStorage. Closing a tab normally loses its exam; browser session recovery may restore it.
- Browser-level reload, closing, history traversal, or address-bar navigation uses native `beforeunload` protection, which browsers may suppress. It retains the session because unload cannot reliably distinguish reload from departure or safely observe cancellation. App-controlled navigation uses explicit confirmed abort and clears the session. Native close/back confirmation dialogs were not manually certified; reload recovery was tested in all engines.
- Native confirmation dialogs and the unchanged startup/legal modal are not a full accessibility audit. The existing modal focus-trap, CSS contrast, mobile overflow, and full localization findings remain for later work packages. The keyboard test uses Safari's native Option-Tab convention, not a claim that full keyboard access is enabled in every user profile.
- Explicit stable IDs/revisions must still be authored by the content agent. Current positional IDs are supported as-is; only declared revision changes can invalidate changed meanings reliably.
- The unchanged Privacy Notice needs its later documentation update to describe language, legacy backup, and sessionStorage exam records. Legal/operator placeholders remain publication blockers.
- Tests block fonts/badges/external sources for deterministic runtime checks. No visual, source-link, editorial, or screen-reader certification is implied. No app build is introduced.
- No independent subagent review was available in this tool set. Final independent gauntlet review remains work package 6.

## Review Gate Follow-up

Date: 2026-09-06. Two persistence defects confirmed and corrected; no commit or push.

### Incompatible Learning Records

Previously, revision filtering excluded old new-format records from memory, and the next learning save overwrote them permanently. `loadAnswers` and the new `saveAnswers` now preserve incompatible records in an `archive` array inside `ab100-study-v1`, separate from the active `answers` map:

```json
{
  "schemaVersion": 1,
  "answers": { "2": { "revision": 1, "value": 1 } },
  "archive": [{ "id": "1", "record": { "revision": 1, "value": 1 } }]
}
```

Archived entries never feed scoring, completion counts, or automatic answer restoration. Subsequent loads and saves retain them and deduplicate identical serialized entries. A single storage write contains both active records and the archive, avoiding a separate archive-write/overwrite failure window. Existing revision-1 envelopes without an archive remain readable. The regression changes Q1 from revision 1 to 2, submits Q2, reloads and submits again, and confirms that Q1 remains archived exactly once and only Q2 counts as reviewed.

### Reset After Quota Failure

Storage failures are tracked independently for `getItem`, `setItem`, and `removeItem`. A failed write no longer suppresses backing removals. Reset removes `ab100-study-v1` (including its archive), `ab100-lab-progress`, `ab100-answers`, `ab100-answers-backup`, and the sessionStorage `ab100-exam-v1` key directly instead of relying on replacement writes. Theme and language keys remain untouched. The regression seeds all five study/session keys and preferences, rejects writes in both stores, resets, verifies the actual backing keys are absent, and reloads with zero learning/lab progress and no resumed exam.

If removal itself is denied or the storage object cannot be accessed, only the current visit can be reset; the existing warning and limitation still apply. A quota-only failure with working removal now clears persisted progress reliably.

### Follow-up Evidence

| Stage | Exact command | Result |
| --- | --- | --- |
| Focused Node red | `node --test --test-name-pattern='archive\|quota failure' tests/study-state.test.cjs` | 2 failed: archive-preserving save API absent; backing progress remained `old` after quota failure and removal. |
| Focused browser red | `npm run test:chromium -- --grep 'revision archive\|quota failure then reset'` | 2 failed: archive missing after Q2 submission; all five backing progress/session keys survived reset. |
| Focused Node green | `node --test --test-name-pattern='archive\|quota failure' tests/study-state.test.cjs` | 2 passed. |
| Focused browser green | `npm run test:chromium -- --grep 'revision archive\|quota failure then reset\|reset clears'` | 3 passed, including the existing normal-reset test updated to require removal rather than an empty replacement object. |
| Full Node green | `npm test` | **17 passed, 0 failed.** |
| Full browser green | `npm run test:browser` | **60 passed, 0 failed: 20 Chromium, 20 Firefox, 20 WebKit** (27.2 seconds). |
| Syntax and whitespace | `node --check app.js && node --check study-state.js && git diff --check` | All exited 0. |

This follow-up supersedes the earlier report's incomplete preservation behavior for incompatible new-format records and quota-failure reset. Archive display/export UI is not added; the archive is retained in the versioned storage envelope for later inspection or recovery.
