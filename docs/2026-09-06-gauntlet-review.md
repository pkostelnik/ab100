# AB-100 Field Guide: Gauntlet Review

Date: 2026-09-06
Reviewed commit: a11bbc02d91dc397e286d9888cc74090e099fa04
Verdict: REQUEST CHANGES

## Method and Scope

This is an implementation review, not a rerun of the gstack Autoplan CEO/design/engineering/DX planning pipeline. The review loop was: inspect current code and approved requirements; independently review runtime and content; reproduce findings in a local Chromium browser; cross-check findings and prioritize. Previous agent approvals were not evidence. No inference about model authorship was made from commit history.

Application files were not edited. No commit, push, deployment, or changes to the user's study data were performed. Browser tests used the isolated localhost origin http://127.0.0.1:8766. Test data was cleared after fault injection.

Tested widths: 320, 390, 768, 1024, 1440 CSS pixels. Explicit Light, Dark, and High contrast themes were inspected. Auto loaded successfully in the test browser; an OS-theme-change test was not run. This is not a full cross-browser or screen-reader certification.

## Blocking Findings

The blocker set is G01-G05 plus storage-initialization failure G09, documented under Functional Findings.

### G01 [P1] Exam attempts reuse persisted learning answers

References: app.js:116, app.js:144-157.

Starting an exam selects new question IDs but creates no independent answer state. Scoring uses state.answers from learning and earlier attempts.

Browser reproduction: seed the same persisted answers that a fully completed learning session would contain, start a new exam, navigate to its final question without answering, press Finish. Actual result: EXAM COMPLETE, 20/20 CORRECT (100%). Seeding was a controlled fixture, not a claim that all questions were answered manually during this review.

Required correction: separate attempt answers from learning history; start every attempt empty and freeze its result on completion.

### G02 [P1] Correct answers are revealed during an active exam

References: app.js:103-129.

Option coloring and explanations depend only on whether an answer exists. They ignore whether the exam is still running. Browser test confirmed an explanation and a marked correct option immediately after the first answer. Multiple-choice questions expose the full correct selection after the first checkbox, before the user completes their response.

Required correction: distinguish draft selection, submitted learning response, active exam, and completed exam. Do not expose answers during an active attempt.

### G03 [P1] Answer length alone solves all single-choice questions

References: questions.js:21-121.

Both independent content analysis and a separate browser-data calculation confirmed: 83 of 83 single-choice questions have a correct option strictly longer than every distractor, measured by JavaScript string length. Choosing the longest option scores 100% across the single-choice bank.

Required correction: rewrite distractors to be plausible and comparable in length/detail. Shuffling letter positions does not address this leak.

### G04 [P1] Repeated scenarios inflate the bank's breadth

References: questions.js:37 and :65; questions.js:55 and :92; questions.js:56 and :106; scripts/validate-content.mjs:26.

Independent review identified 27 disjoint pairs with substantially the same scenario, decision and answer. This is a reviewer classification, not a claim of byte-identical questions. Separately, the controller measured 17 pairs with identical unordered option sets after only lowercasing and whitespace normalization. Zero exact duplicate stems does not establish independent scenario coverage.

Conservative manually identified pairs:

```text
2/51, 3/52, 5/64, 7/81, 8/74, 12/44, 14/48, 15/53, 17/42,
18/49, 19/56, 21/46, 22/58, 23/57, 24/59, 25/50, 26/68,
27/71, 28/73, 29/79, 30/78, 31/66, 32/65, 33/60, 35/69,
36/83, 37/82
```

Required correction: replace redundant scenarios with distinct constraints, tradeoffs and currently uncovered objectives. Do not merely prefix stems to pass exact-text validation.

### G05 [P1] Learn alignment is confused with official authorship

References: questions.js:16; docs/superpowers/plans/2026-08-25-ab100-field-guide.md:197. README.md:16-17 describes Learn alignment more accurately than the question metadata.

45 generated practice items receive official: true, sourceType: Microsoft Learn and verification: Official Microsoft Learn aligned. Linking a Learn module supports an explanation; it does not make the question Microsoft-authored. This misleading convention was explicitly requested by the plan, so the plan itself needs correction. The site-wide disclaimer does not remove the ambiguity of per-question labels.

Required correction: use a label such as Unofficial practice, Learn-aligned and distinguish authorship, adaptation source and verification evidence. Label questions Original only where their provenance supports that claim.

## Functional Findings

### G06 [P2] Matching selections disappear visually

References: app.js:117, app.js:129.

Browser reproduction: open Q4, choose A in the first select. state.answers[4] becomes {"0":"A"}, but the newly rendered select has value "" and shows Choose. The explanation is already visible. Saved values are never restored into the generated options.

### G07 [P2] Exam transitions are incomplete

References: app.js:120-132, app.js:135-157, app.js:161, app.js:165-170.

Browser reproduction: start exam, then type an unmatched search. Mode changes to learn while examStarted remains true; the old timer briefly remains visible on the empty state until the next one-second timer callback hides it. Filtering silently abandons the attempt. Finished exams also remain editable while the displayed score is a previously calculated string (independent runtime test).

The Start exam button starts the timer without scrolling to the question area. At 1440px, the browser measured the question section over 3300px below the viewport top immediately after starting from the mode card.

### G08 [P2] Empty weak-spot review falls back to all questions

References: app.js:75, app.js:167.

Browser fixture: all answers correct, then Review weak spots. Actual: 95 question buttons. An empty review ID list is interpreted as the full bank instead of a completed/empty state.

### G09 [P1] Invalid or unavailable browser storage can disable the app

References: app.js:5, :9, :19, :27, :70-71, :173.

Browser reproduction: set ab100-answers to malformed JSON "{" and reload. Actual: uncaught JSON parse error; zero questions and zero labs render. Independent runtime tests also reproduced failures on null answer data and rejected storage reads/writes. Startup writes a language preference before rendering, so storage write failures can break even a fresh visit.

Required correction: guarded storage access, shape validation, and an in-memory fallback. This does not require a backend.

## Design and Accessibility

### G10 [P2] High contrast mode has low-contrast active text

References: styles.css:44-61, styles.css:167.

The active question uses color var(--acid) on background var(--ink). Computed browser colors produce these WCAG relative-luminance contrast ratios for the small text:

| Theme | Foreground / background | Ratio |
| --- | --- | --- |
| Light | #0e7490 / #172b4d | 2.63:1 |
| Dark | #67e8f9 / #f4f7fb | 1.35:1 |
| High contrast | #00ffff / #ffffff | 1.25:1 |

All are below the normal-text AA threshold of 4.5:1. This is a measured defect, not a color preference.

### G11 [P2] Mobile layout overflows; primary answer text is undersized

References: styles.css:93-105, :161-177, :184-185, :219-249.

At 390px viewport width, document width is 401px; at 320px, it remains 401px. Search/topic controls and fixed matching-column sizing contribute to horizontal scrolling. Header branding wraps AB-100 across lines at mobile/tablet widths. Matching labels get an unnecessarily narrow text column beside a fixed 220px select.

The broad .option span rule applies the 0.7rem monospace style to the full answer text, not just its letter. Computed answer font size is 11.2px at default zoom. This is a readability concern, not by itself a WCAG minimum-font-size violation.

### G12 [P2] German mode is word substitution, not localization

References: i18n.js:5-8; app.js:74, :94, :109, :117-118, :161.

Browser example, Q5: "nach the first production week, Contoso wants session outcomes, engagement, und satisfaction ... Welche starting point matches the platform?" All answer options remain English. Insight dialogs and several dynamic messages bypass translation entirely. Search uses English source text rather than visible translated text.

Required correction: complete EN/DE text records and translated dynamic UI, not regex replacement of isolated words.

### G13 [P2] Keyboard focus escapes dialogs and is lost during answers

References: app.js:52-56, :73-74, :108-109, :118-132; index.html:74-81; styles.css:163.

Browser test: focus the final Close button in an open lab, press Tab twice. Focus moves to body, then the background brand link while the modal remains open. There is no focus trap or inert background. Rerendering the entire answer card removes the currently focused control. Checkbox wrappers use aria-pressed instead of aria-checked and nest another focusable checkbox. Search suppresses its outline without a replacement.

Required correction: modal focus containment, predictable post-answer focus, native form semantics and a visible search focus indicator. Screen-reader behavior was not tested directly.

### Design Assessment

At 1440px the visual shell is coherent: recognizable typography hierarchy, restrained color palette, consistent card borders and sufficient spacing. The badge loads. A redesign is unnecessary; repair responsive constraints, reading sizes, contrast and interaction states first.

Labs and Insights lack direct top-navigation entries, and both Course path and Labs repeat the heading Build the path. Combined with the long page and the exam-start scroll omission, this weakens orientation. These are lower-priority usability issues, not blockers equivalent to invalid exam scoring.

## Content and Maintenance

### G14 [P2] C1756 resources are present but not surfaced

References: resources.js:2-6; index.html:70, :84.

The resources array is loaded but never rendered. The Sources section exposes only Study Guide, Learn path and DumpsBase. C1756 lab cards link to individual labs, but the direct Learner Guide and walkthrough resources are not offered in Sources.

Nine brief-style labs meet the user's narrowed scope. Full local courseware, executable labs and starter artifacts were explicitly excluded; their absence is not a new implementation failure. Generic repeated checklist steps are useful only as basic progress markers, not verification that a lab was completed correctly.

### G15 [P2] Broad topic mappings and module citations overstate coverage

References: questions.js:41, :44, :69, :82, :124-145; course.js:2-4.

Equivalent Q21/Q46 scenarios appear under different areas through different lab mappings. A2A questions Q24/Q59 map to Lab 6 instead of the directly relevant multi-agent Lab 5. Area membership is derived from these links, so mapping accuracy affects filtering.

All 11 Learn modules are cited, but independent review found no dedicated assessment for several explicit objectives: code-first generative pages/agent feeds, Power Platform Well-Architected, Foundry Tools selection, and reasoning/voice-mode design. Some process questions answer only "the documented process." These are coverage gaps, not proof every existing answer is wrong.

Stored area memberships are Plan 27, Design 31, Deploy 37. The approved plan did not require weighted sampling, so their deviation from exam weights is a design opportunity rather than a broken contractual requirement.

### G16 [P2] Some technical explanations need explicit qualifications

References: questions.js:31, :43, :56, :80, :106, :116.

Purview's data governance contribution is grouped with residency without distinguishing environment placement, model processing location and cross-region routing controls. Local MCP utility questions omit a reachable endpoint and supported transport prerequisite for Copilot Studio. Independent source checks found these statements underqualified; they do not prove Purview or MCP are categorically wrong choices.

Source checks used:
- https://learn.microsoft.com/en-us/training/modules/design-responsible-ai-security-governance-risk-management-compliance/7-validate-data-residency-movement-compliance
- https://learn.microsoft.com/en-us/power-platform/admin/geographical-availability-copilot
- https://learn.microsoft.com/microsoft-copilot-studio/mcp-add-existing-server-to-agent

### G17 [P2] The validator passes important invalid data

References: scripts/validate-content.mjs:14-26.

The actual validator passes with 95 questions, 9 labs, 3 areas and 5 insights. Independent in-memory mutation tests found it also accepts answer index 999, empty labIds, missing verification-source URL, duplicate question ID, the wrong Tertiary repository and empty resources. No application file was changed for these tests.

Required correction: validate answer/format contracts, IDs, nonempty valid mappings, source URLs, exact courseware repository and rendered resources. Runtime regression tests are also needed; content counts do not exercise exam behavior.

### G18 [P2] Legal documents remain publication placeholders

References: app.js:45-49.

Privacy and Legal Notice still include operator/address/email placeholders. Applicability depends on the operator and use; this review is not legal advice. The placeholder notice itself says it must be completed before publication. Do not represent the site as publication-ready on the strength of a disclaimer alone.

## Evidence and Positive Checks

- node scripts/validate-content.mjs: PASS, 95 questions / 9 labs / 3 areas / 5 insights.
- Initial desktop render: 95 questions and 9 labs; Expert badge loads; no horizontal overflow at 1440px.
- Three-domain lab data and filter are present; all nine original lab filenames were checked upstream by the content reviewer.
- AB100.md matches the bank's stems/options/answers/explanations in the independent Node comparison.
- Exact AB-620/C1760 content replacement is not the current blocker.
- Browser screenshots are in the approved temporary directory, not committed assets:
  /var/folders/rn/8trqjc692z1gc_t9tpnnpn240000gn/T/opencode/ab100-desktop.png
  /var/folders/rn/8trqjc692z1gc_t9tpnnpn240000gn/T/opencode/ab100-390.png
  /var/folders/rn/8trqjc692z1gc_t9tpnnpn240000gn/T/opencode/ab100-768.png
  /var/folders/rn/8trqjc692z1gc_t9tpnnpn240000gn/T/opencode/ab100-mobile-matching.png
  /var/folders/rn/8trqjc692z1gc_t9tpnnpn240000gn/T/opencode/ab100-german.png
  /var/folders/rn/8trqjc692z1gc_t9tpnnpn240000gn/T/opencode/ab100-high-contrast.png

## Recommended Correction Order

1. Exam state/answer disclosure, matching restoration, storage resilience and behavioral regression tests.
2. Plausible distractors, duplicate replacement, truthful provenance and objective-level coverage.
3. Complete localization, contrast, mobile constraints and keyboard accessibility.
4. Surface C1756 resources, strengthen validation and finish operator/legal information before publication.

This review did not fact-check every answer, establish original DumpsBase lineage for every item, audit all external links, or test Safari/Firefox. No fix has been applied or verified. Earlier Ready to ship claims should not be relied on for these tested behaviors.
