# Release Checklist

## Current Disposition

G17 has automated integrity regressions and a deterministic Markdown check. G18 remains an **external publication blocker**: no operator name/entity, service address, or contact details have been supplied. Development, documentation, and normal test completion are permitted; publication is not. Never invent these details.

## Technical Gates

Run from the repository root on Node.js 22 or later:

```bash
npm ci
npm test
npm run validate:content
npm run docs:check
npx playwright install chromium firefox webkit
npm run test:browser
```

- [ ] All Node suites pass, not just content counts. Review study-state migration, timeout, answer isolation, matching, and frozen-result coverage.
- [ ] Content validation has no errors; counts remain at least 90 questions, exactly 9 labs/3 correct areas, at least 5 insights, and the required resources.
- [ ] Review both locales' length and duplicate diagnostics. They do not establish plausible distractors, distinct scenarios, or psychometric validity.
- [ ] Reassess question wording, answer keys, technical qualifications, source relevance, and provenance. Advance explicit revisions on material changes and update corresponding German records without changing answer indices/letters.
- [ ] Inspect source links manually for current availability and relevance. Offline structural URL checks are not live verification, copyright permission, or proof of item lineage.
- [ ] If content changed, run `npm run docs:generate`, inspect the full `AB100.md` diff, and rerun `npm run docs:check`. The check must not rewrite stale files to hide drift.
- [ ] Browser tests pass in Chromium, Firefox, and WebKit. Record unavailable browsers or untested behavior as limitations rather than passing evidence.
- [ ] Manually exercise EN/DE at mobile and desktop widths, keyboard navigation, dialogs, themes, storage warnings, and source links. Automated browser coverage is not a complete accessibility audit.

The static application has no production build or backend. Do not add a build/deployment claim to substitute for these checks.

## Operator Gate

```bash
npm run check:release
```

**Expected current result: exit 1, `Publication blocked`, identifying `legalText.en.privacy`, `legalText.en.imprint`, `legalText.de.privacy`, and `legalText.de.imprint`.** This intentional failure is separate from normal application tests. When the operator supplies real reviewed legal content, the command should exit 0; that means only that the marker gate passed, not that legal compliance was certified.

- [ ] The operator supplies actual provider/controller identity, address, and email, plus any applicable register, VAT, or profession-specific information. Applicability requires operator judgment and appropriate legal review.
- [ ] Replace template content in `legalText` in `i18n.js` in **both** English and German. Do not erase placeholders or warnings without supplying accurate replacement content.
- [ ] Review privacy statements against `app.js` and `study-state.js`: all local/session keys, revision archive, legacy backup, reset retention of preferences, and storage-denial behavior.
- [ ] Review the real hosting provider, request logs, external Google Fonts, Microsoft badge request, linked sites, and any newly added services. Do not promise that no personal data leaves the browser.
- [ ] Remove incomplete-policy/provider warnings only when the notices are genuinely completed. Keep the independent-project disclaimer truthful.
- [ ] Run the release marker gate again and record operator review separately. Missing legal documents fail closed. Pattern checks cannot verify whether supplied details are genuine or sufficient.

## Publication

- [ ] Record the reviewed revision/commit and actual results of all commands above in release evidence. No release on an unresolved gate.
- [ ] Obtain explicit permission before committing, pushing, or deploying.
- [ ] After approval, configure GitHub Pages for the intended branch and repository root. Publish static assets directly, not `node_modules`, test results, or private operator evidence.
- [ ] Smoke-test the resulting HTTPS URL, browser storage behavior on its distinct origin, English/German legal notices, and external resource links.

This checklist is an engineering release process, not legal advice or a promise of certification readiness.
