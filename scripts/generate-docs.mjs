import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { contentRoot, loadContent } from './content-data.mjs';
import { validateContent } from './validate-content.mjs';

export function renderMarkdown(data) {
  const lines = [
    '# AB-100 practice bank', '',
    'Generated from `questions.js` by `npm run docs:generate`. Do not edit this mirror manually.', '',
    `Total: ${data.questions.length} questions. English is canonical; complete German display records are in \`content-de.js\`.`, '',
    'All questions are unofficial practice, not Microsoft-authored exam questions. Source URLs are supporting documentation, not authorship or endorsement. Review dates describe the recorded documentation review, not product execution or permanent correctness.', '',
    'C1756 origin links record existing lab associations, not verified upstream assessment lineage. No item-level DumpsBase lineage is asserted. See [content coverage and review](docs/content-coverage.md) for evidence and limitations.', '',
    'Single and multiple answers use option letters below (zero-based indices in data). Matching prompts are numbered from 1 below (zero-based keys in data); their actual answer key is `matches`, not the retained numeric `answer: 0` sentinel.', '',
  ];
  for (const q of data.questions) {
    const matching = q.format === 'matching';
    const answer = matching
      ? Object.entries(q.matches).map(([index, letter]) => `${Number(index) + 1} -> ${letter}`).join(', ')
      : (q.format === 'multiple' ? q.answer : [q.answer]).map(index => String.fromCharCode(65 + index)).join(', ');
    lines.push(`## Q${q.id} - ${q.topic}`, '', `**Revision:** ${q.revision}`, '', `**Format:** ${q.format}`, '', `**Labs:** ${q.labIds.join(', ')}`, '', q.question, '');
    q.options.forEach((option, index) => lines.push(matching ? `${index + 1}. ${option}` : `- **${String.fromCharCode(65 + index)}.** ${option}`));
    if (matching) lines.push('', '**Match labels:**', '', ...q.matchLabels.map(label => `- ${label}`));
    lines.push('', `**Answer:** ${answer}`, '', '**Explanation:**', '', q.explanation, '',
      `**Source type:** ${q.sourceType}`, '', `**Official:** ${q.official}`, '',
      `**Verification:** ${q.verification}`, '', `**Documentation reviewed on:** ${q.verifiedOn}`, '',
      `**Verification source:** <${q.source}>`, '',
      `**Origin association:** ${q.originSource ? `<${q.originSource}>` : 'No item-level external origin claimed.'}`, '');
  }
  return lines.join('\n');
}

if (process.argv[1] && pathToFileURL(fs.realpathSync(process.argv[1])).href === import.meta.url) {
  try {
    const args = process.argv.slice(2);
    if (args.length > 1 || (args.length && args[0] !== '--check')) throw new Error('Usage: node scripts/generate-docs.mjs [--check]');
    const data = loadContent();
    const { errors } = validateContent(data);
    if (errors.length) throw new Error(`Invalid content; mirror unchanged:\n${errors.join('\n')}`);
    const markdown = renderMarkdown(data);
    const target = new URL('AB100.md', contentRoot);
    if (args[0] === '--check') {
      const existing = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null;
      if (existing !== markdown) throw new Error('AB100.md is missing or stale. Run npm run docs:generate and review the diff. No files were written.');
      console.log('AB100.md is current; no files were written.');
    } else {
      fs.writeFileSync(target, markdown);
      console.log(`Generated AB100.md: ${data.questions.length} questions.`);
    }
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
