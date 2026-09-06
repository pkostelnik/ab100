# AB-100 Gauntlet Corrections

Approved scope: repair G01-G18 from docs/2026-09-06-gauntlet-review.md.
Execution: subagent implementation, independent review, fixes and re-review.
No commits, pushes or publication without a separate user request.
Continue in the existing checkout as previously approved. Preserve existing files.

## Constraints

- Static HTML/CSS/JavaScript; no production build or backend.
- English default; complete German translations, not word substitutions.
- Nine paraphrased labs with external original resources; no courseware mirror.
- Question area filtering stays labIds intersect courseAreas.labs; no domain on questions.
- Stable explicit question IDs and revisions; preserve old answer data safely when meaning changes.
- No invented operator information. Missing legal information blocks publication, not development.

## Work Packages

1. Runtime and regression tests: extract pure study-state logic; separate exam attempts from learning, explicit submit, preserve matching selections, freeze results, handle abort/timeout/reload/empty review; guarded storage and migration. Node and Playwright tests.
2. Content: rewrite implausible/length-leaking distractors, replace redundant scenarios, truthful provenance, explicit lab mappings, objective coverage and verified technical qualifications. At least 90 reviewed questions, revision tracking.
3. Localization: complete English/German content and UI, language-aware search, preserve state on language changes.
4. Presentation and resources: fix responsive overflow, contrast, answer size, keyboard semantics and modal focus, reduced motion, navigation, render resource links.
5. Integrity and documentation: strong validator with mutation tests, reproducible Markdown mirror, updated README and publication checklist.
6. Final gauntlet: independent code/content review, browser testing Chromium/Firefox/WebKit where available, per-finding disposition and evidence. No passing claim for untested checks.

## Acceptance

- Seeded learning answers never score a new exam; no answer keys visible until exam completion.
- Matching values survive renders; empty weak review stays empty; completed attempt immutable.
- Invalid/denied storage still permits use; reload preserves absolute deadline; old revised answers not silently reused.
- Answer length and duplicate warnings require editorial review, not count-only approval.
- No official authorship claimed for generated questions. All local content has German equivalents.
- 320-1440px no page overflow; small active text >=4.5:1 contrast; keyboard-only workflow works.
- Validator rejects out-of-range answers, missing source, empty mappings, duplicate IDs, wrong courseware repository and empty resources.
- AB100.md reproducible; operator data remains an explicit external release gate.

## Progress

- Runtime: implemented, independently reviewed; persistence and multi-tab follow-up fixes approved.
- Content: implemented and independently reviewed; 101 unofficial scenarios, explicit IDs/revision 2, coverage report.
- Localization: implemented and reviewed; EN/DE complete, residual German length bias documented.
- Presentation/resources: implemented and reviewed; responsive, contrast, keyboard/modal and resource tests.
- Integrity/docs: implemented and reviewed; mutation tests, deterministic mirror and separate release gate.
- Final review: approved after correction loops; controller verified 154 Node tests and 210 browser tests. G18 remains externally blocked.
