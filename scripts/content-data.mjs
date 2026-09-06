import fs from 'node:fs';
import vm from 'node:vm';

export const contentRoot = new URL('../', import.meta.url);

// Execute only this repository's trusted classic scripts, never downloaded code.
export function loadContent(root = contentRoot) {
  const context = vm.createContext({});
  for (const file of ['course.js', 'resources.js', 'courseware-insights.js', 'labs.js', 'questions.js', 'content-de.js', 'i18n.js']) {
    vm.runInContext(fs.readFileSync(new URL(file, root), 'utf8'), context, { filename: file, timeout: 1000 });
  }
  const data = JSON.parse(vm.runInContext('JSON.stringify({ questions, labs, courseAreas, learningOutcomes, coursewareInsights, resources, contentDe, uiText, topicTextDe, outcomeIds, legalText })', context));
  const html = fs.readFileSync(new URL('index.html', root), 'utf8');
  const app = fs.readFileSync(new URL('app.js', root), 'utf8');
  data.uiKeys = [...new Set([
    ...Array.from(html.matchAll(/data-ui(?:-aria|-placeholder|-alt|-content)?="([^"]+)"/g), m => m[1]),
    ...Array.from(app.matchAll(/\bui\(['"]([^'"]+)['"]/g), m => m[1]),
  ])];
  return data;
}
