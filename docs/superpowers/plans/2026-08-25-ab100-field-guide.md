# AB-100 Field Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a static GitHub Pages AB-100 study site that reuses the AB-620 Field Guide shell and contains only AB-100 content.

**Architecture:** Clone `https://github.com/pkostelnik/AB620` into this empty repo, then replace branding, storage keys, course areas, labs, questions, insights, resources, i18n, legal copy, and the validator. Keep the existing Learn / Exam / Labs / Insights / Sources behavior. Area filtering stays `question.labIds ∩ courseAreas.labs`.

**Tech Stack:** Static HTML/CSS/JS, no build, `node scripts/validate-content.mjs`, GitHub Pages from `/`.

## Global Constraints

- Work on `main` (user-approved; this empty repo is the product).
- No AB-620 questions, labs, insights, or courseware text may remain.
- No 1:1 copy of C1756 markdown, PPT, Learner Guide, or starter JSON/CSV.
- DumpsBase items must be paraphrased and labeled `sourceType: 'DumpsBase practice'` with a verification note to check Microsoft Learn.
- English is the default UI language; German is toggleable; selection is stored locally.
- Use the Microsoft Certified **Expert** badge, not Associate.
- localStorage keys: `ab100-answers`, `ab100-lab-progress`, `ab100-language`, `ab100-theme`.
- Questions do **not** carry a `domain` field. Area filter is only via `labIds` ∩ `courseAreas.labs`.
- Target ≥90 questions, exactly 9 labs, exactly 3 course areas.
- Independent unofficial project; disclaimer on load; not affiliated with Microsoft.
- Hotspot / drag-drop DumpsBase items become `matching` or `multiple` text formats (no image assets).
- C1756 lab source URLs must point at `https://github.com/tertiarycourses/C1756-AB-100-Microsoft-Certified-Agentic-AI-Business-Solutions-Architect/blob/main/labs/lab-NN-...md`.
- Scenario name: Contoso Service Resolution Accelerator.

---

### Task 1: Clone the AB-620 shell and rebrand to AB-100

**Files:**
- Create: `index.html`, `styles.css`, `app.js`, `i18n.js`, `course.js`, `labs.js`, `questions.js`, `courseware-insights.js`, `resources.js`, `README.md`, `.gitignore`, `scripts/validate-content.mjs`
- These start as copies of https://github.com/pkostelnik/AB620 and are immediately rebranded. Content files may still contain AB-620 placeholders after this task; later tasks replace them. Branding, keys, legal, sources, and lab-filter days→domains must be AB-100 in this task.

**Interfaces:**
- Consumes: empty repo on `main`
- Produces: runnable static shell; `localStorage` keys `ab100-*`; lab filter options for three domains instead of five days

- [ ] **Step 1: Clone AB-620 files into this repo**

```bash
git clone --depth 1 https://github.com/pkostelnik/AB620 /tmp/ab620-src
cp /tmp/ab620-src/index.html /tmp/ab620-src/styles.css /tmp/ab620-src/app.js /tmp/ab620-src/i18n.js /tmp/ab620-src/course.js /tmp/ab620-src/labs.js /tmp/ab620-src/questions.js /tmp/ab620-src/courseware-insights.js /tmp/ab620-src/resources.js /tmp/ab620-src/README.md /tmp/ab620-src/.gitignore .
mkdir -p scripts
cp /tmp/ab620-src/scripts/validate-content.mjs scripts/
rm -rf /tmp/ab620-src
# Do not copy AB620.md
```

- [ ] **Step 2: Rebrand index.html**

Replace AB-620 chrome with AB-100 chrome:
- `<title>AB-100 Field Guide</title>`
- meta description for AB-100 Agentic AI Business Solutions Architect
- eyebrow: `Microsoft Certified: Agentic AI Business Solutions Architect`
- brand label `AB-100` / `FIELD GUIDE`
- Expert badge URL: `https://learn.microsoft.com/en-us/media/learn/certification/badges/microsoft-certified-expert-badge.svg`
- hero headline about architecting agentic AI business solutions (not “agents that actually ship”)
- course-path caption: 9 labs, Contoso Service Resolution Accelerator
- lab filter default option: all three domains (not “All five days”)
- sources:
  1. Official exam study guide → `https://aka.ms/AB100-StudyGuide`
  2. Architect AI solutions for business productivity → `https://learn.microsoft.com/en-us/training/paths/architect-agentic-ai-business-solutions/`
  3. Unofficial practice set → `https://www.dumpsbase.com/freedumps/microsoft-ab-100-updated-dumps-v10-02-for-agentic-ai-business-solutions-architect-exam-preparation-pass-your-exam-in-2026.html`
- footer: `AB-100 FIELD GUIDE`

- [ ] **Step 3: Switch app.js storage keys and lab filter**

In `app.js`:
- Replace every `ab620-` localStorage key with the matching `ab100-` key.
- Replace the day loop `for (let day = 1; day <= 5; day += 1)` with three domain options: `plan`, `design`, `deploy` (labels Plan / Design / Deploy).
- Lab cards and `renderLabs` must filter on `lab.domain` (or keep `lab.day` as 1=plan, 2=design, 3=deploy — pick one and use it consistently). Prefer `lab.domain` with values `'plan'|'design'|'deploy'`.
- Legal modal copy must name AB-100, C1756, and DumpsBase. Remove AB-620 and C1760 names.

- [ ] **Step 4: Update i18n chrome strings**

In `i18n.js` `uiText`, change AB-620-specific user-facing strings to AB-100 (heroIntro, allDays → allDomains, labs caption). Leave `termTranslations` mostly intact; later tasks can extend it.

- [ ] **Step 5: Smoke the shell**

Open `index.html` via `python3 -m http.server 8000` is optional. At minimum grep that no `ab620-` storage key remains in `app.js` and that `index.html` no longer says AB-620.

- [ ] **Step 6: Commit**

```bash
git add index.html styles.css app.js i18n.js course.js labs.js questions.js courseware-insights.js resources.js README.md .gitignore scripts/validate-content.mjs
git commit -m "feat: clone AB-620 shell and rebrand to AB-100"
```

Placeholder AB-620 *data* in `questions.js` / `labs.js` / `course.js` is allowed until later tasks replace it. Branding and keys are not.

---

### Task 2: Replace course.js with AB-100 domains

**Files:**
- Modify: `course.js`

**Interfaces:**
- Consumes: `app.js` area cards and `filtered()` using `courseAreas[].id`, `.title`, `.weight`, `.labs`
- Produces:

```js
const courseAreas = [
  { id: 'plan', title: 'Plan AI-powered business solutions', weight: '25–30%', labs: ['lab-01', 'lab-02', 'lab-03'], sources: ['https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-100'] },
  { id: 'design', title: 'Design AI-powered business solutions', weight: '25–30%', labs: ['lab-04', 'lab-05', 'lab-06'], sources: ['https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-100'] },
  { id: 'deploy', title: 'Deploy AI-powered business solutions', weight: '40–45%', labs: ['lab-07', 'lab-08', 'lab-09'], sources: ['https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-100'] }
];
```

Six `learningOutcomes` covering: grounding/CAF; platform/ROI; Copilot Studio/D365; MCP/A2A/Computer Use; evaluation/ALM; RAI/security/governance.

- [ ] **Step 1: Rewrite course.js** with the objects above. No AB-620 area ids.
- [ ] **Step 2: Commit** `git commit -m "feat: map course areas to AB-100 plan/design/deploy"`

---

### Task 3: Replace labs.js with 9 paraphrased C1756 briefs

**Files:**
- Modify: `labs.js`

**Interfaces:**
- Consumes: `app.js` `openLab` / `renderLabs` expecting `{ id, number, title, summary, artifacts, concepts, domain, sourceUrl, sourceType, verificationStatus, checklist }`
- Produces: exactly 9 labs, ids `lab-01` … `lab-09`

Lab table (paraphrase titles/summaries; do not copy C1756 markdown):

| id | title | domain | artifacts |
|---|---|---|---|
| lab-01 | Qualify the process and grounding data | plan | Use-case record, data-readiness register |
| lab-02 | Choose the platform and agent boundaries | plan | Platform decision record, agent-boundary map |
| lab-03 | Build the value case and AI operating model | plan | ROI model, AI strategy charter |
| lab-04 | Design the core agent, grounding, and prompt contracts | design | Agent-design record, prompt-library contract |
| lab-05 | Design multi-agent, MCP, and Computer Use extensibility | design | Extensibility map |
| lab-06 | Map Dynamics 365, Power Platform, and Microsoft 365 integration | design | Integration map, data contracts |
| lab-07 | Create the evaluation, telemetry, and tuning plan | deploy | Evaluation plan, telemetry scorecard |
| lab-08 | Design ALM, environments, and operational ownership | deploy | ALM record, RACI |
| lab-09 | Complete the security, Responsible AI, and governance record | deploy | Security/governance record, final ADR |

Each lab:
- `sourceUrl` = C1756 blob URL for that lab file
- `sourceType` = `Tertiary Courses C1756 Courseware`
- `verificationStatus` = `Courseware-derived; verify against Microsoft Learn`
- `checklist` = 4 paraphrased steps (read brief, make the design decision, record evidence, checkpoint)
- scenario mentioned as Contoso Service Resolution Accelerator

Slug list for `sourceUrl`:
- `lab-01-qualify-the-process-and-grounding-data.md`
- `lab-02-choose-the-platform-and-agent-boundaries.md`
- `lab-03-build-the-value-case-and-ai-operating-model.md`
- `lab-04-design-the-core-agent-grounding-and-prompt-contracts.md`
- `lab-05-design-multi-agent-mcp-and-computer-use-extensibility.md`
- `lab-06-map-dynamics-365-power-platform-and-microsoft-365-integration.md`
- `lab-07-create-the-evaluation-telemetry-and-tuning-plan.md`
- `lab-08-design-alm-environments-and-operational-ownership.md`
- `lab-09-complete-the-security-responsible-ai-and-governance-record.md`

- [ ] **Step 1: Write labs.js** with the 9 objects. Delete all 20 AB-620 labs.
- [ ] **Step 2: Confirm `app.js` lab filter works with `lab.domain`.**
- [ ] **Step 3: Commit** `git commit -m "feat: add nine paraphrased AB-100 lab briefs"`

---

### Task 4: Paraphrase DumpsBase V10.02 practice questions

**Files:**
- Modify: `questions.js` (replace AB-620 dumpsbase array; keep helper `q` / `community` patterns)

**Interfaces:**
- Consumes: existing question shape `{ question, options, answer, explanation, topic, source, sourceType, verification, format, labIds, official }`
- Produces: ~35–40 paraphrased DumpsBase items, each with `sourceType: 'DumpsBase practice'`, `verification` telling the reader to verify against Microsoft Learn, at least one valid `labIds` entry from lab-01…lab-09, and a Learn URL in `source` for the skill being tested.

Topics to use (no `domain` field):
Requirements & Grounding; AI Strategy & CAF; ROI & Build-Buy-Extend; Copilot in Dynamics 365; Copilot Studio Agents; Foundry & Extensibility; Ecosystem Integration; Monitor & Tune; Testing & Evaluation; ALM & Environments; Responsible AI & Security.

Rewrite these free-set themes (do not copy stem wording):
model registry vs quality gate; task vs autonomous agent; D365 business terms; Contoso prebuilt/custom/MCP; Copilot Studio analytics; AP invoice copilot role; Responsible AI dashboard; ALM solution vs X++; Foundry vs Power Platform pipeline; Contact Center transfer; Purview/Defender; CAF vs Success by Design; Dataverse as SSOT; horizon-based ROI; generative orchestration; CLU vs NLP vs generative.

Hotspot / drag-drop items become `format: 'matching'` or `format: 'multiple'`.

- [ ] **Step 1: Delete AB-620 question arrays.**
- [ ] **Step 2: Write paraphrased DumpsBase questions (~35–40).**
- [ ] **Step 3: Commit** `git commit -m "feat: add paraphrased AB-100 DumpsBase practice questions"`

The combined bank may be under 90 until Tasks 5–6. That is expected.

---

### Task 5: Add Microsoft Learn / study-guide questions

**Files:**
- Modify: `questions.js`

**Interfaces:**
- Consumes: same question shape
- Produces: ~40–50 additional items with `official: true`, `sourceType: 'Microsoft Learn'`, `verification: 'Official Microsoft Learn aligned'`, `source` pointing at a real Learn URL (study guide or a module in the architect-agentic-ai-business-solutions path), and `labIds` mapped to the matching lab.

Cover the 11 Learn modules and the three skill groups. Prefer architecture judgment questions (which platform, which control, which ALM carrier) over click-path trivia.

- [ ] **Step 1: Append Learn-aligned questions.**
- [ ] **Step 2: Commit** `git commit -m "feat: add Microsoft Learn aligned AB-100 questions"`

---

### Task 6: Courseware-derived questions, insights, resources, i18n, validator, README

**Files:**
- Modify: `questions.js`, `courseware-insights.js`, `resources.js`, `i18n.js`, `scripts/validate-content.mjs`, `README.md`
- Create: `AB100.md`

**Interfaces:**
- Consumes: 9 labs from Task 3; question helpers from Tasks 4–5
- Produces: complete site data + passing validator once Task 7 runs

Courseware-derived (~10–12):
- `sourceType: 'Courseware-derived'`
- `coursewareSource` = C1756 lab blob URL
- `verification` = courseware-derived; verify against Microsoft Learn
- `labIds` include the lab the decision comes from

Insights (5 paraphrased architecture cards), each with a Microsoft Learn `source` and `status` `confirmed` or `partially confirmed`:
1. Grounding readiness
2. Platform and agent boundaries
3. Prompt / MCP contracts
4. Evaluation and telemetry gates
5. Responsible AI and residency

Resources: link to C1756 `labs/` and the Learner Guide. Do not copy files.

Validator changes:
- `questions.length >= 90`
- `labs.length === 9`
- `areas.length === 3`
- `insights.length >= 5`
- every question has `sourceType` and `verification`
- every `labIds` entry exists
- courseware-derived questions have a C1756 GitHub `coursewareSource`
- every lab `sourceUrl` includes `/blob/main/labs/lab-`
- no duplicate question text

README: how to run (`python3 -m http.server 8000`), GitHub Pages, attribution (C1756, Learn, DumpsBase used critically), localStorage keys, Expert badge disclaimer.

`AB100.md`: markdown mirror of the question bank (question, options, answer letter, explanation). Generate from the JS data or write in parallel; keep answers consistent.

i18n: AB-100 chrome complete; extend `termTranslations` only for new repeated stems if needed.

- [ ] **Step 1: Add courseware-derived questions.**
- [ ] **Step 2: Rewrite insights and resources.**
- [ ] **Step 3: Update validator, README, AB100.md, remaining i18n.**
- [ ] **Step 4: Commit** `git commit -m "feat: finish AB-100 content pack and validator"`

---

### Task 7: Verify

**Files:** none new

- [ ] **Step 1: Run validator**

```bash
node scripts/validate-content.mjs
```

Expected: `Content validation passed: N questions, 9 labs, 3 exam areas, M insights` with N ≥ 90.

- [ ] **Step 2: Grep leftovers**

```bash
rg -n "ab620-|AB-620|C1760" --glob '!docs/**' --glob '!.superpowers/**' .
```

Expected: no matches in site files.

- [ ] **Step 3: Smoke checklist** (manual, record in the report)
Theme / language toggle; disclaimer on load; 3 area cards; 9 labs; learn filter; 20-question exam; review weak spots; reset progress; source links open.

- [ ] **Step 4: Commit only if a fix was required** `git commit -m "fix: pass AB-100 content validation"`

---

## Execution notes for SDD

- Empty repo: Task 1 creates the first commit on `main`.
- Do not copy `AB620.md`.
- Do not add a `domain` field on questions.
- Implementer commits are required per task.
- Controller works in `/Users/pkostelnik/Library/CloudStorage/OneDrive-Persönlich/Documents/github/AB100`.
