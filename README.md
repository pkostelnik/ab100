# AB-100 Field Guide

Static, independent AB-100 practice site. No production build, backend, accounts, or application analytics.

![Microsoft Certified Expert badge](https://learn.microsoft.com/en-us/media/learn/certification/badges/microsoft-certified-expert-badge.svg)

The Microsoft Certified Expert badge is a visual reference only, not evidence of certification. This project is not affiliated with, sponsored by, or endorsed by Microsoft.

## Contents

- 101 unofficial practice scenarios: 89 single-choice, 8 multiple-response, 4 matching; all currently revision 2.
- Six learning outcomes and three exam areas: Plan, Design, Deploy. Question-area filters intersect explicit `labIds` with each area's labs; questions have no `domain` field.
- Nine paraphrased C1756 architecture lab briefs, five insight cards, and five rendered resource records, including the original Learner Guide and lab walkthrough.
- Complete English/German display records, language-aware search, and Auto, Light, Dark, and High contrast themes. English is the default; Auto follows the operating system.
- Learning with explicit answer submission, weak-spot review, and separate 20-question/20-minute exam attempts. Exam answers remain hidden until completion; results are frozen. These practice scores are not certification predictions.

## Sources and Limits

- **Microsoft Learn:** [official study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-100) and documentation support the explanations. Every question is explicitly `official: false`, labeled `Unofficial practice, Learn-aligned`. A documentation link does not establish Microsoft authorship.
- **Tertiary Courses C1756:** [courseware and connected labs](https://github.com/tertiarycourses/C1756-AB-100-Microsoft-Certified-Agentic-AI-Business-Solutions-Architect). Local briefs paraphrase architecture decisions; the full courseware, executable labs, and starter artifacts are not mirrored. Twelve questions (84-95) retain `originSource` lab associations, not a claim that their revised assessment wording was verified upstream.
- **DumpsBase:** the Sources section retains a historical unofficial practice-set link. No item-level DumpsBase lineage is established for the current rewritten bank. Do not describe all questions as copied, adapted, or verified against that site.

`source` is the primary verification-document URL; `verifiedOn` records the documentation-review date, not a tenant/product execution test or permanent correctness guarantee. See [content coverage and review](docs/content-coverage.md) for the authoring review, source evidence, remaining editorial limitations, and technical qualifications. Insight statuses are recorded editorial judgments, not fresh checks made by the validator. Lab checklist completion records your progress, not whether your architecture is correct.

## Run Locally

From the repository root, use any static server, for example:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`. Application assets run directly in the browser; npm dependencies are development/test tools only.

## Tests and Docs

Use Node.js 22 or later and npm. Install the locked development dependencies:

```bash
npm ci
npm test
npm run validate:content
npm run docs:check
```

`npm test` runs every `tests/*.test.cjs` Node suite, including study-state, localization, content mutations, documentation generation, and release-gate behavior. Browser tests are separate:

```bash
npx playwright install chromium firefox webkit
npm run test:browser
```

`npm run test:chromium` is the Chromium-only alternative. Playwright starts an isolated local static server. These checks do not require Azure credentials or a backend. Browser tests do not establish screen-reader certification or Microsoft tenant feature availability.

`scripts/validate-content.mjs` exports the pure `validateContent(data)` function returning `{ errors, diagnostics }`. `scripts/content-data.mjs` loads the trusted repository classic-script data in a VM for command-line tools, without importing the DOM application. The validator checks counts, explicit positive integer IDs/revisions, answer contracts, lab/area relationships, provenance, exact C1756 paths, resource metadata, and EN/DE display contracts. It checks HTML UI annotations and literal application UI keys when loaded through the CLI. URL parsing checks HTTPS and expected hosts/paths; it does not fetch pages, establish their availability, or prove source relevance.

Duplicate normalized stems/option sets and single-answer length distributions are **editorial diagnostics**, not proof of semantic distinctness, distractor plausibility, absence of answer cues, or psychometric validity. Review them for both languages alongside the content coverage report.

After approved content edits, regenerate the full English practice-bank mirror:

```bash
npm run docs:generate
npm run docs:check
```

`AB100.md` is deterministic: every question, revision, option, matching label, answer, explanation, source, and provenance field comes from data. Do not edit it manually. `docs:check` writes nothing and exits nonzero if the mirror is missing or stale. All three script CLIs resolve files relative to their own location, including when invoked by absolute path from another working directory. Regeneration requires valid content, including current German revisions.

## Browser Storage

Storage is scoped to the browser profile and site origin, not synced between devices or different hosts/ports. Constants and migration behavior live in `study-state.js`; storage selection and reset behavior live in `app.js`.

| Storage | Key | Purpose |
| --- | --- | --- |
| `localStorage` | `ab100-study-v1` | Schema-version-1 submitted learning answers `{ revision, value }`, plus incompatible versioned records in `archive` |
| `localStorage` | `ab100-answers` | Legacy unversioned answers, left intact during migration |
| `localStorage` | `ab100-answers-backup` | Verbatim legacy backup, created only if not already present |
| `localStorage` | `ab100-lab-progress` | Known boolean checklist steps and derived lab percentages |
| `localStorage` | `ab100-language` | `en` or `de` preference |
| `localStorage` | `ab100-theme` | Theme preference |
| `localStorage` | `ab100-reset-v1` | Retained opaque reset UUID; invalidates stale learning drafts across tabs, contains no answers or identity |
| `sessionStorage` | `ab100-exam-v1` | Current tab's exam, ordered question IDs/revisions, responses, position, absolute deadline, completed result, and boolean `learningApplied` completion marker |

Legacy answers import only for valid revision-1 question mappings. Since the rewritten bank is revision 2, old unversioned answers are backed up but not silently reused. Versioned answers for changed revisions, removed IDs, or invalid responses are excluded from active progress and archived during the valid versioned save path. Archive and active answers share one write. Corrupt envelopes are not guaranteed an archive; the warning is not a recovery guarantee. Unsubmitted learning drafts remain in memory, not local storage.

Every exam starts empty, and active exam selections never write learning records. On completion (Finish, timeout, or expired-session restore), complete answered responses are promoted into learning history once, including incorrect responses for weak-spot review. Unanswered and incomplete responses leave existing learning records untouched. The frozen score and answers remain independent of later learning changes. The persisted `learningApplied` marker prevents completed-result reload from replaying old responses over newer learning answers. Old completed sessions without that marker are treated as already handled, not retroactively promoted. Reload in the same tab restores a compatible attempt and its original deadline, not a fresh timer; incompatible or malformed stored attempts are discarded with a warning. Session storage normally ends with the tab's session, though browser session restoration may retain it.

**Reset progress** asks for confirmation and removes `ab100-study-v1` (including its archive), both legacy answer keys, lab progress, and the initiating tab's session exam. Theme, language, and the newly written `ab100-reset-v1` marker are retained. Other tabs clear stale learning drafts and recompute weak-spot membership from refreshed answers; after a reset, all unanswered questions are eligible, not mastered. Other tabs' exams remain intact and can promote their answered responses if subsequently completed. Use browser site-data controls to remove preferences and the reset marker too. Storage access failures fall back to in-memory state with a visible warning; persistence and successful physical deletion cannot be guaranteed when the browser denies storage operations.

Learning saves merge fresh records but localStorage read-modify-write is not transactional across processes. Completion claims its session marker before writing learning to prevent replay after reload. A crash between those writes can skip promotion, and denied storage can prevent durable markers or records; this is not an atomic exactly-once transaction across both stores.

The app does not transmit answers to an application server. Hosting may log requests; external fonts and the Microsoft badge contact their providers, and external links lead to third-party sites. This is not a claim that the browser sends no personal data anywhere. Review the actual hosting and external services in the privacy notice before publication.

## Publication Gate

**Publication is currently blocked by missing operator/legal information (G18). Technical development and normal tests may complete while this external dependency remains open.**

```bash
npm run check:release
```

This separate read-only check intentionally exits **1** on the current English/German privacy and legal-notice placeholders. It detects missing documents, bracketed template fields, placeholder notices, and completion markers, including common markup/entity variants. It is not part of the normal passing test command and is not a legal-compliance certification. Its own tests verify marker rejection without requiring fabricated personal information or blocking future operator completion.

Follow [the release checklist](docs/release-checklist.md). The operator must supply accurate English/German provider and privacy information and obtain any appropriate legal review. Do not merely remove warning text to make the gate green. Only after that review and all technical gates pass should an operator enable GitHub Pages using **Settings > Pages > Deploy from a branch**, the intended branch, and `/ (root)`. No deployment/build step is otherwise required.
