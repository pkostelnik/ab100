# Integrity and Documentation Correction Report

Date: 2026-09-06. Scope: package 5 of the approved gauntlet-corrections plan, G17/G18. No commits, pushes, publication, runtime edits, or changes to personal study data.

## Changes

- `scripts/validate-content.mjs` now exports pure `validateContent(data) -> { errors, diagnostics }`. Importing it does not load content or print results. CLI errors produce exit 1; success produces exit 0.
- `scripts/content-data.mjs` loads trusted local classic-script arrays and EN/DE dictionaries in a bounded VM. Data paths are relative to the script, not the caller's working directory. It collects HTML-annotated and literal application UI keys; the validator also covers the renderer's dynamic label keys.
- Counts, unique explicit integer question IDs/revisions, all answer formats, complete matching keys/unique letters, nonempty supported lab mappings, no question `domain`, and truthful unofficial provenance are validated.
- Question verification requires a real HTTPS Microsoft Learn document URL and a real calendar review date. Origin associations must use an exact original C1756 lab path and a mapped lab. The current bank has no supported item-level DumpsBase lineage, so a historic website link is not accepted as a newly asserted question origin. Lab/resource links use exact repository/path checks, not substring matching.
- Resource validation requires the C1756 Learner Guide, labs directory, walkthrough, official study guide, and Learn path with their current type/title/mapping contracts. Labs, areas, outcomes, and insight display metadata are also checked.
- Locale coverage matches the actual runtime shapes: strings for area/resource titles; objects for question, lab, and insight display records; stable outcome/topic maps; complete UI/legal dictionaries. Question revisions, option/label lengths, matching letters, and UI interpolation tokens must agree. Unsupported locale overrides of answer or provenance fields are rejected.
- Editorial diagnostics expose normalized duplicate stems, duplicate unordered option sets, and single-answer length distributions separately in English and German. They are not proof of semantic distinctness, answer validity, translation accuracy, or psychometric quality.
- `scripts/generate-docs.mjs` produces the complete English `AB100.md` mirror from data: IDs/revisions, formats, lab mappings, all options/matching labels, answer keys, explanations, official status, verification statements/dates/URLs, and origin associations. Generation is deterministic. `--check` never writes and fails for missing/stale content. Unknown flags and invalid/missing data cannot overwrite the mirror.
- `scripts/check-release.mjs` exports the pure legal marker gate and provides the separate `npm run check:release` command. It fails closed for missing EN/DE documents and detects the current bracket placeholders, notices, and incomplete-publication markers, including common entity, case, whitespace, markup, and zero-width variants. It does not validate real-world identities or certify legal compliance.
- README now documents 101 questions, qualified provenance, static operation, Node/browser commands, all seven actual local/session keys, revision/legacy backup behavior, archive limits, reset semantics, and third-party request caveats. `docs/release-checklist.md` distinguishes passing technical checks from G18's external publication requirement.
- Added npm commands `validate:content`, `docs:generate`, `docs:check`, and `check:release`. Preserved `npm test`'s all-Node-suite glob and the existing browser scripts. No production build was introduced.

## Regression Evidence

The initial test-first run failed because the old validator exported no pure function and could not run outside the repository cwd. Generator and release tests initially failed because those tools were absent. After implementation, a temporary-directory integration test caught macOS `/var` versus `/private/var` entry-point comparison behavior that skipped CLI execution; realpath normalization corrected it. Final self-review added regressions for prototype-named resource IDs and dynamic UI keys removed in both languages, observed both failures, and corrected them.

`tests/content.test.cjs` includes independent mutation cases for all six G17 audit examples: answer index 999, empty lab IDs, missing verification source, duplicate question ID, wrong Tertiary repository, and empty resources. Additional mutations cover the revisioned schema, metadata, answer/matching shapes, malformed records, URL spoofing, exact resource paths, and locale contracts. Tests use in-memory copies, not edits to runtime data.

`tests/content-docs.test.cjs` checks every current question's full mirrored fields and actual answer key, deterministic rendering, stale/missing-file failure with unchanged bytes and modification time, repeat generation, unknown flags, missing-source refusal, and invocation outside the repository. Scratch writes/deletions are restricted to test-created temporary directories.

`tests/content-release.test.cjs` checks each EN/DE marker independently with synthetic, non-personal fixtures, missing/empty documents, purity, and CLI agreement. Normal tests are not hard-coded to require legal placeholders forever; supplying legitimate operator content later can make the release command pass without invalidating these regression tests.

## Command Results

Environment: macOS, Node.js v26.7.0. No browser application code was changed by this package.

| Command | Result |
| --- | --- |
| `npm run docs:generate` | PASS: regenerated 101-question mirror |
| `npm test` | PASS: 147 tests across all Node suites, 0 failures/skips (after release-gate follow-up) |
| `npm run validate:content` | PASS: 101 questions, 9 labs, 3 areas, 5 insights, 5 resources and EN/DE contracts |
| `npm run docs:check` | PASS: current mirror, no writes |
| `npm run check:release` | INTENTIONAL FAIL, exit 1: EN/DE privacy and imprint placeholders |
| `git diff --check` | PASS |
| Browser suites | Not rerun in package 5: no runtime/browser changes. Existing browser packages/final gauntlet own this verification. |

Current editorial output has no normalized duplicate-stem/option-set groups. Of 89 single-choice questions, the correct option is strictly longest in 22 English and 29 German items, and strictly shortest in 20 English and 13 German items. These are JavaScript string-length observations, not evidence that distractors are good or that the bank is unbiased.

## Disposition

**G17: technical correction implemented with mutation coverage.** Automated structural checks do not perform fresh upstream source verification, measure learning outcomes, prove editorial distinctness, or certify translation semantics. Explicit property validation also cannot establish historical ID stability from one data snapshot; revision/ID review remains part of maintenance.

**G18: release gate implemented; operator completion remains outstanding.** Current `legalText.en.privacy`, `legalText.en.imprint`, `legalText.de.privacy`, and `legalText.de.imprint` each block publication. Technical completion is not a publication-ready claim. No personal information was fabricated or legal warning removed.

This report is package-level implementation/self-review evidence, not the independent final gauntlet or legal approval.

## Release-Gate P2 Follow-Up

Two independently reported false passes were reproduced and corrected on 2026-09-06. Only `scripts/check-release.mjs`, `tests/content-release.test.cjs`, and this report changed in this follow-up. No commits or runtime/legal-content edits.

- **Block-boundary loss:** stripping all tags concatenated `<p>Operator</p><p>TODO</p><p>Contact</p>` into `OperatorTODOContact`, hiding the marker's word boundaries. Normalization now inserts separators for block, line-break, list, and table-cell tags before removing remaining inline tags. Inline `Place<strong>holder</strong>` still joins into `Placeholder` and is rejected, including between neighboring blocks.
- **Encoded empty body:** checking raw HTML treated `&#32;`, `&#160;`, and `&#x200B;` as content. Title and body now undergo decoding and normalization independently; body emptiness is checked after removing markup, collapsing whitespace, and removing Unicode default-ignorable code points. A nonempty title cannot conceal an empty body.

Added 14 regression/control tests using otherwise clean synthetic legal fixtures, injecting one fault at a time in each language and requiring exactly the corresponding field error. The test-first run reproduced 12 failures; the named-space and visible-content controls already passed. Coverage includes paragraphs, blocks, line breaks, lists, table cells, inline-split markers inside blocks, each reported numeric entity independently, mixed entities, named nonbreaking space, literal zero-width space, and encoded word joiner. Visible body text surrounded by encoded spacing still passes.

Verification after correction: `node --test tests/content-release.test.cjs` passed 38/38; `npm test` passed 147/147; content validation, read-only docs check, and `git diff --check` passed. `npm run check:release` still intentionally exits 1 for the four current EN/DE privacy/imprint placeholders. No browser tests were needed for this Node-only gate change. The gate remains a template-marker check, not a full HTML rendering audit or legal-compliance certification.
