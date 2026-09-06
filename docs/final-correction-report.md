# Final Integrated Correction Report

Date: 2026-09-07. Scope: the two final runtime/test findings only. No commits, staging, pushes, publication, dependency edits, or question-content changes were made in this pass. Existing worktree changes were preserved.

## Findings and Corrections

### Cross-tab learning persistence

Root causes: `safeStorage.get()` permanently cached successful reads, including records and archives subsequently removed by another tab. `app.js` also saved its entire in-memory learning snapshot, overwriting independent answers or restoring deleted records.

- Successful reads now consult the backing store. Memory remains a fallback for unavailable reads and unsuccessful writes/removals. Failed operations remain isolated by method; readable preferences and working removals still work after a quota failure.
- Storage-event invalidation removes cached/fallback values for an externally changed key, or all values for a storage clear.
- `saveAnswers()` accepts only newly checked records and merges them into fresh, compatible persisted answers. It returns the merged records for UI state. Archives are derived only from the fresh envelope, retained/deduplicated in the same write, and never sourced from a tab's stale snapshot. Loading an existing envelope archives incompatible records without resubmitting its answer snapshot.
- Other-tab learning writes refresh checked records and progress without discarding unrelated drafts. A reset clears stale learning drafts and review IDs. Deletion and clear events also invalidate drafts. Refresh is read-only and does not rerun legacy migration.
- Reset still removes the learning/archive envelope, legacy source/backup, labs, and the initiating tab's exam session. It additionally writes `ab100-reset-v1`, an opaque UUID invalidation marker containing no answers, identity, or exam data. This marker intentionally remains after reset. The Check handler reads the marker and current records before accepting a draft, covering delayed event delivery even if another tab has already saved new progress after reset.
- Shared lab changes refresh the local lab view and an open checklist. Theme/language preferences are not deleted. Exam attempts remain in per-tab sessionStorage: a remote learning reset does not abort, replace, or rewrite another tab's attempt, answers, index, deadline, or result.

Changed implementation: `app.js`, `study-state.js`.

### Non-vacuous G01 fixture

The previous fixture seeded raw legacy responses while every current question had revision 2. Migration correctly rejected all of them, so the old assertion accepted zero checked learning answers before the exam and failed to prove isolation from populated learning history.

The replacement seeds a revisioned envelope using each current question's revision and complete correct response (including multiple/matching shapes). It asserts at least 20 bank entries, all 101 checked learning records, and all 101 completed list indicators before starting the exam. START must leave the serialized learning envelope byte-identical and the learning count unchanged, while showing 20 exam questions with zero completed indicators. Unanswered Finish must score 0/20; result freezing and a subsequent empty attempt are still checked.

Policy correction (user-confirmed follow-up): the original approved chat plan explicitly required completion to update learning once. The written execution plan omitted it, and this report's earlier claim that completion should never promote was incorrect. START and active selections leave learning untouched; completion now promotes only complete answered responses once, including incorrect responses. An unanswered completion, as in G01, remains byte-identical for learning history. See the follow-up below.

Legacy revision-1 rejection and verbatim backup now have their own browser test, separate from G01.

Changed tests: `tests/study-state.test.cjs`, `tests/browser/runtime.spec.cjs`.

## Regression Evidence

Before implementation:

- `node --test tests/study-state.test.cjs`: 17 passed, 3 failed. New failures showed `old` instead of `new` after another adapter wrote, loss of the first independent answer, and Q95 revision-1 archive resurrection after another adapter removed the envelope.
- `PLAYWRIGHT_BROWSERS_PATH="/Users/pkostelnik/Library/Caches/ms-playwright" npx playwright test tests/browser/runtime.spec.cjs --project=chromium --grep 'seeded learning|legacy revision-1|two-tab'`: 2 passed, 2 failed (11.7 seconds). Corrected G01 and separate legacy rejection passed. Cross-tab submission failed with 0 checked instead of 1 in the other tab; reset failed with 1 instead of 0 in the stale tab.

After implementation, regression coverage includes:

- Two live pages in one browser context submit different questions. Both persisted records survive, both counts synchronize, the pending draft remains selected, and reload retains both answers.
- Q95 revision 1 is actually archived before another page resets. The stale page loses checked answers and retry draft; a new unrelated Check stores only its new record and an empty archive, with one checked answer after reload.
- A stale page deliberately suppresses storage-event handlers. Another page resets and saves fresh progress. Invoking the stale Check without refreshing its DOM does not alter that fresh envelope and clears the old draft.
- A live answered exam survives another page's learning write and reset byte-for-byte, including after reload. The second page starts without an inherited exam session.
- Node coverage also verifies invalidation of failed-write overlays and full-clear invalidation. Existing denied getter/read/write/removal, quota-reset, legacy migration, revision archive, deadline, grading, and immutable-result tests remain passing.

The initial three Node regressions and two browser regressions were observed failing before the fix. The extra delayed-event, session-isolation, and overlay-invalidation checks were added afterward as boundary coverage; no red-run claim is made for those extra checks.

## Verification

The existing reports document `/Users/pkostelnik/Library/Caches/ms-playwright`. That directory was absent at the start of this pass (`ls` and `npx playwright install --list` returned ENOENT). It was restored using the already-installed dependency:

```sh
PLAYWRIGHT_BROWSERS_PATH="/Users/pkostelnik/Library/Caches/ms-playwright" npx playwright install chromium firefox webkit
```

No npm install or package/lockfile edit occurred. `npm ls --depth=0` reports existing `@playwright/test@1.63.0`. Downloaded browser builds: Chromium/headless shell 1243 (153.0.8010.12), Firefox 1543 (155.0), WebKit 2359 (26.6), and FFmpeg 1011. Browser commands below explicitly use the documented cache path rather than changing Playwright config.

| Command | Actual result |
| --- | --- |
| `node --test tests/study-state.test.cjs` | 21 passed; 0 failed/skipped/cancelled |
| `PLAYWRIGHT_BROWSERS_PATH="/Users/pkostelnik/Library/Caches/ms-playwright" npx playwright test tests/browser/runtime.spec.cjs --grep 'seeded learning\|legacy revision-1\|two-tab'` | 18 passed across Chromium/Firefox/WebKit; 19.1 seconds |
| `npm test` | 151 passed; 0 failed/skipped/cancelled |
| `PLAYWRIGHT_BROWSERS_PATH="/Users/pkostelnik/Library/Caches/ms-playwright" npm run test:browser` | 195 passed across Chromium/Firefox/WebKit; 2.4 minutes |
| `npm run validate:content` | Exit 0; 101 questions, 9 labs, 3 areas, 5 insights, 5 resources; EN/DE contracts valid |
| `npm run docs:check` | Exit 0; AB100.md current, no writes |
| `npm run check:release` | Exit 1 as expected: unresolved EN/DE privacy and imprint placeholders |
| `git diff --check` | Exit 0 |

The complete browser suite contains 65 cases per engine: 25 runtime, 32 presentation, and 8 localization. The focused 18 cases are a subset, not additional unique full-suite cases. Editorial answer-length diagnostics remain visible in Node/content output and are not claimed resolved by these changes.

## Limits and Disposition

- Both reported findings are corrected for the reproduced and tested paths. This is not publication approval: real operator/privacy/imprint information is still missing in both languages, and the release gate intentionally fails.
- Fresh merge is not a cross-process transaction. localStorage has no atomic read-modify-write primitive; truly simultaneous writes interleaved between the fresh read and set can still conflict. These tests prove independent sequential submits from already-open tabs, real storage-event synchronization, and delayed-event reset protection, not serializability under every process interleaving. Concurrent edits of the same question use the last persisted Check.
- When backing storage access fails, local memory remains usable but cross-tab synchronization, durable reset markers, and backing deletion cannot be guaranteed. Working remove operations still clear backing data after quota errors. The reset marker contains no learning data and must not be mistaken for resurrected progress.
- Lab events refresh/reset the view, but this pass does not make simultaneous lab-checklist saves transactional. Tabs running older application code do not gain the new synchronization until reload.
- Browser tests are automated desktop-engine tests on macOS; no physical mobile device, screen-reader session, live-source verification, psychometric audit, or independent reviewer sign-off was performed in this pass. Existing broader review limitations remain applicable.

## Follow-up: Review Membership and Approved Completion Policy

Date: 2026-09-07. This section supersedes the earlier completion-policy claim and verification totals. No commits or dependency changes.

### Corrections

- `syncLearning()` now derives review membership from refreshed answers whenever the tab is in review mode. A remote reset makes all 101 unanswered questions eligible, rather than interpreting cleared review IDs as mastery. Remote correct and incorrect Check saves also update membership.
- `finishExam()` freezes a completed attempt with `learningApplied: false`. `applyExamLearning()` accepts completed, unhandled attempts only, constructs revision-compatible records for complete answered responses, claims `learningApplied: true` in the existing session key, and merges those records into fresh learning history. Incorrect answers are included so weak spots remain meaningful. Missing, empty, or incomplete responses do not erase prior learning.
- The application invokes this shared step from `saveExam()`, covering explicit Finish, timer expiry, a response arriving at the deadline, and expired active-session restore. Active attempts perform no learning writes. An unanswered completion makes no learning-envelope write, preserving G01.
- Completed result/response objects remain deeply frozen; changing the bookkeeping flag creates a new frozen wrapper without changing the score or answers. Resume rejects non-boolean completion flags and any promotion flag on an active record. Legacy completed sessions without a flag are treated as already handled to avoid retroactively overwriting newer learning. Legacy active sessions still promote when they finish.
- The original user-approved chat plan required completion-to-learning promotion once. The previous report inferred policy from an incomplete execution-plan file; that inference was wrong and has been corrected explicitly above and in README.
- README now inventories retained `ab100-reset-v1` and session `learningApplied`, explains promotion/reset behavior, and states storage limits. The runtime report's storage-key table is updated too. The content validator does not maintain a storage-key inventory; no validator code change was needed.

### Red/Green Evidence

Before implementation, `node --test tests/study-state.test.cjs` had 21 passes and 2 failures: the promotion API did not exist and resume accepted an invalid promotion flag. The Chromium browser command below had five failures: review remained empty after reset, and learning did not update on completion. The expired-reload fixture initially failed earlier because the application's `beforeunload` replaced it with live state; after correcting the fixture, its separate red run reached completed 1/20 but retained one learning record instead of three.

During the first cross-engine green run, 15 cases passed and the three late-answer cases failed only at reload: a one-page Date.now override reverted on navigation, making completion appear to be in the future. Replacing that fixture override with Playwright's navigation-persistent fixed clock resolved the test artifact without relaxing production timestamp validation.

```sh
PLAYWRIGHT_BROWSERS_PATH="/Users/pkostelnik/Library/Caches/ms-playwright" npx playwright test tests/browser/runtime.spec.cjs --project=chromium --grep 'two-tab review|exam promotion'
```

Final verification:

| Command | Actual result |
| --- | --- |
| `node --test tests/study-state.test.cjs` | 24 passed; no failures/skips/cancellations |
| `PLAYWRIGHT_BROWSERS_PATH="/Users/pkostelnik/Library/Caches/ms-playwright" npx playwright test tests/browser/runtime.spec.cjs --grep 'two-tab review\|exam promotion\|seeded learning'` | 18 passed across all three engines; 22.9 seconds |
| `npm test` | 154 passed; no failures/skips/cancellations |
| `PLAYWRIGHT_BROWSERS_PATH="/Users/pkostelnik/Library/Caches/ms-playwright" npm run test:browser` | 210 passed across Chromium/Firefox/WebKit; 2.7 minutes |
| `npm run validate:content` | Passed; existing EN/DE editorial length diagnostics remain |
| `npm run docs:check` | Passed; no generated-file writes |
| `git diff --check` | Exit 0 |

The full browser suite now has 70 cases per engine: 30 runtime, 32 presentation, 8 localization. New browser cases prove review transitions from 0 eligible (all checked correct), to 101 (reset), to 100 (remote correct), back to 101 (remote incorrect). Four completion cases each prove active selections leave learning byte-identical, two answered records promote while a blank question retains prior learning, weak spots reflect correctness, and a newer learning correction survives completed-result reload with byte-identical frozen session data. Node tests additionally cover complete multiple/matching promotion, incomplete matching omission, empty completion no-op, and marker validation/legacy behavior.

### Persistence Limits

The flag is claimed before learning is written, prioritizing no replay over newer answers. A crash between those writes can skip promotion. If session storage denies writes, its in-memory flag prevents repeats during the visit but cannot guarantee replay protection after reload; denied local storage can prevent durable learning updates. There is no atomic transaction across localStorage and sessionStorage. Exactly-once promotion is verified for normal successful persistence and reload, not arbitrary failures, tampering, or process-interleaving scenarios. Existing concurrent-localStorage and publication limitations still apply. Remote reset preserves active exams; intentionally completing such an exam can add its answered responses to learning afterward.
# Controller Final Acceptance

Final independent review approved the correction delta after the cross-tab reset and completion-to-learning follow-ups. The controller then independently reran the full current suites:

- `npm test`: 154 passed, zero failed.
- `npm run test:browser`: 210 passed, zero failed across Chromium, Firefox and WebKit (2.6 minutes).
- `npm run docs:check`: current, no writes.
- `node scripts/validate-content.mjs`: 101 questions, 9 labs, 3 areas, 5 insights, 5 resources, complete EN/DE contracts.
- `git diff --check`: passed.
- `npm run check:release`: intentionally blocked by four EN/DE privacy/imprint placeholders; operator action required.

An earlier controller browser run could not launch because the expected Playwright browser binaries were absent. This was an environment failure, not a passing test or product regression; after browser setup was restored, the controller reran the suite successfully as recorded above.

## Original Finding Disposition

| Finding | Status and evidence |
| --- | --- |
| G01-G02 | Corrected; populated current-learning isolation test, fresh attempts, no active grading DOM; completed answers update learning once. |
| G03 | Deterministic length leak removed; English strictly longest correct 22/89, German 29/89. Residual guessing bias remains an editorial diagnostic, not a psychometric approval. |
| G04 | 27 audited pairs replaced; zero normalized duplicate stems/option sets; independent editorial review accepted distinctness. |
| G05 | Generated/adapted questions explicitly unofficial; source evidence distinct from origin. |
| G06-G08 | Matching restoration, lifecycle transitions, immutable results, empty/remote-reset review tests pass. |
| G09 | Guarded storage, revision archives, migration backups, quota/reset and cross-tab tests pass. |
| G10-G11 | EN/DE responsive and contrast tests across all engines pass; readable answer text. |
| G12 | Full keyed translations and translated search; editorial wording corrections reviewed. |
| G13 | Native controls, modal trap/inert/scroll lock and actual-pointer trigger restoration tested across engines. |
| G14 | All five resource records rendered, including C1756 learner guide and lab references. |
| G15-G16 | Explicit lab mappings, objective coverage and documented product qualifications; independent technical spot-checks accepted. |
| G17 | Mutation tests reject original invalid examples; documentation mirror reproducible and checked. |
| G18 | EXTERNALLY BLOCKED: genuine operator/legal details required before publication. |

No commits, pushes or deployment performed. Physical-device/screen-reader certification, independent SME certification and learner psychometrics remain outside the evidence. Cross-storage crash atomicity and truly simultaneous localStorage writes remain documented limitations. Original audit retained unchanged as historical evidence.
