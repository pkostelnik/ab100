# AB-100 Field Guide

Static, interactive AB-100 practice site for GitHub Pages.

![Microsoft Certified Expert badge](https://learn.microsoft.com/en-us/media/learn/certification/badges/microsoft-certified-expert-badge.svg)

The page uses the official Microsoft Certified Expert badge as a visual reference only. This project is independent and is not affiliated with, sponsored by, or endorsed by Microsoft. Displaying the badge does not mean you hold the certification.

The site includes 90+ practice questions, six learning outcomes, three exam areas, nine paraphrased hands-on lab briefs, courseware insight cards, lab checklists, and links to the original external lab materials.

The interface supports English and German. English is the default language, and the selected language is stored locally in the browser. The site also supports Auto, Light, Dark, and High contrast themes.

## Attribution

- **Tertiary Courses C1756** — [courseware and connected labs](https://github.com/tertiarycourses/C1756-AB-100-Microsoft-Certified-Agentic-AI-Business-Solutions-Architect). Local lab briefs and courseware-derived questions are paraphrased architecture decisions, not copied courseware.
- **Microsoft Learn** — official modules and the [AB-100 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-100). Learn-aligned items cite those pages.
- **DumpsBase** — unofficial practice stems used **critically**. Items are paraphrased and checked against Microsoft Learn. They are not official exam questions.

Content integrity can be checked with `node scripts/validate-content.mjs`.

## Run locally

Because the site uses only static assets, any local web server works:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000` in a browser. No build step or backend is required.

## Publish with GitHub Pages

1. Push the repository to GitHub.
2. Open **Settings → Pages**.
3. Select **Deploy from a branch**.
4. Select the default branch and the `/ (root)` folder.
5. Save and open the generated Pages URL.

The app stores progress, lab checklist state, language, and theme in the visitor's browser via `localStorage`; no personal data is sent to a server. The default `Auto` theme follows the operating system's light/dark preference.

Local storage keys:

- `ab100-answers`
- `ab100-lab-progress`
- `ab100-language`
- `ab100-theme`
