import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { loadContent } from './content-data.mjs';

export function validateRelease(legalText) {
  const errors = [];
  function normalize(html) {
    const decoded = html
      .replace(/&#(x[0-9a-f]+|\d+);?/gi, (match, code) => {
        const value = code[0].toLowerCase() === 'x' ? parseInt(code.slice(1), 16) : Number(code);
        return value <= 0x10ffff ? String.fromCodePoint(value) : match;
      })
      .replace(/&(lbrack|lsqb);/gi, '[').replace(/&(rbrack|rsqb);/gi, ']')
      .replace(/&nbsp;/gi, ' ').replace(/&ouml;/gi, '\u00f6').replace(/&auml;/gi, '\u00e4')
      .normalize('NFKC').replace(/\p{Default_Ignorable_Code_Point}/gu, '');
    // Blocks separate words; inline emphasis must still join Place<strong>holder.
    const plain = decoded
      .replace(/<\/?(?:address|article|aside|blockquote|br|caption|dd|details|dialog|div|dl|dt|fieldset|figcaption|figure|footer|form|h[1-6]|header|hgroup|hr|li|main|nav|ol|p|pre|section|summary|table|tbody|td|tfoot|th|thead|tr|ul)\b[^>]*>/gi, ' ')
      .replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    return { decoded, plain };
  }
  for (const locale of ['en', 'de']) for (const name of ['disclaimer', 'privacy', 'imprint']) {
    const record = legalText?.[locale]?.[name];
    const field = `legalText.${locale}.${name}`;
    if (typeof record?.title !== 'string' || !record.title.trim() || typeof record.html !== 'string') {
      errors.push(`${field}: required legal title and HTML missing`);
      continue;
    }
    const title = normalize(record.title), body = normalize(record.html);
    if (!body.plain) errors.push(`${field}: empty legal body`);
    const markers = /\[[^\]]*\]|\bplaceholder\b|\bplatzhalter\b|\bTODO\b|\bTBD\b|complete before public publication|vor \u00f6ffentlicher ver\u00f6ffentlichung vervollst\u00e4ndigen|not a complete.{0,40}(privacy policy|provider identification)|keine vollst\u00e4ndige.{0,40}(datenschutzerkl\u00e4rung|anbieterkennzeichnung)|complete operator details|vervollst\u00e4ndige betreiberangaben/i;
    if ([title, body].some(value => markers.test(value.plain) || /placeholder-notice/i.test(value.decoded))) errors.push(`${field}: unresolved publication placeholder; operator must supply and review real legal information`);
  }
  return errors;
}

if (process.argv[1] && pathToFileURL(fs.realpathSync(process.argv[1])).href === import.meta.url) {
  try {
    if (process.argv.length > 2) throw new Error('Usage: node scripts/check-release.mjs');
    const errors = validateRelease(loadContent().legalText);
    if (errors.length) throw new Error(errors.join('\n'));
    console.log('Legal placeholder gate passed. This is not legal approval; complete the release checklist and operator review.');
  } catch (error) { console.error(`Publication blocked:\n${error.message}`); process.exitCode = 1; }
}
