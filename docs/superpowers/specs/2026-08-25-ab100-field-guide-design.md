# AB-100 Field Guide Design

Date: 2026-08-25
Status: Approved

## Problem

Build a static GitHub Pages study site for Microsoft exam AB-100 (Agentic AI Business Solutions Architect). The empty `AB100` repo should reuse the AB-620 Field Guide shell and none of its exam content.

## Decisions

- Clone the AB-620 static app (`index.html`, `app.js`, `styles.css`, `i18n.js`, validator). Replace branding and data only.
- Taxonomy is the official AB-100 domains: Plan 25–30%, Design 25–30%, Deploy 40–45%.
- Area filter stays `question.labIds ∩ courseAreas.labs`. Questions do **not** get a `domain` field.
- DumpsBase V10.02 questions are paraphrased, labeled unofficial, verified against Microsoft Learn.
- C1756 labs appear as 9 paraphrased briefs with checklists and original-repo links. No courseware copy, no starter JSON/CSV.
- English default, German toggle, localStorage keys `ab100-*`.
- Work on `main` (empty product repo). Expert badge, not Associate.

## Sources

1. Official study guide: https://aka.ms/AB100-StudyGuide
2. Learn path: https://learn.microsoft.com/en-us/training/paths/architect-agentic-ai-business-solutions/
3. DumpsBase V10.02 free set (critical / unofficial)
4. Tertiary C1756 courseware + labs: https://github.com/tertiarycourses/C1756-AB-100-Microsoft-Certified-Agentic-AI-Business-Solutions-Architect

## Out of scope

Backend, build step, starter-pack artifacts, live lab runner, GitHub Pages settings, completed imprint data.
