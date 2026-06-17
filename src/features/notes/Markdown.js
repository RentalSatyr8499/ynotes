// src/features/notes/markdown.js
//
// Minimal, dependency-free markdown parser used to render a live preview
// of plaintext notes. Two passes:
//   1. parseBlocks  — splits raw text into block-level tokens (headers,
//      lists, quotes, code fences, hr, paragraphs, blank lines)
//   2. parseInline   — within a block's text, tokenizes bold/italic/
//      inline-code/links
//
// Block shape: { type: 'h1'|'h2'|'h3'|'quote'|'code'|'li'|'hr'|'p'|'blank', text? }
// Span shape:  { text, bold?, italic?, code?, link? }

export function parseBlocks(source) {
  const lines = source.split('\n');
  const blocks = [];
  let inCodeBlock = false;
  let codeBuffer = [];

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        blocks.push({ type: 'code', text: codeBuffer.join('\n') });
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }
    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    if (/^###\s+/.test(line)) {
      blocks.push({ type: 'h3', text: line.replace(/^###\s+/, '') });
    } else if (/^##\s+/.test(line)) {
      blocks.push({ type: 'h2', text: line.replace(/^##\s+/, '') });
    } else if (/^#\s+/.test(line)) {
      blocks.push({ type: 'h1', text: line.replace(/^#\s+/, '') });
    } else if (/^>\s?/.test(line)) {
      blocks.push({ type: 'quote', text: line.replace(/^>\s?/, '') });
    } else if (/^\s*[-*]\s+/.test(line)) {
      blocks.push({ type: 'li', text: line.replace(/^\s*[-*]\s+/, '') });
    } else if (/^\s*---\s*$/.test(line)) {
      blocks.push({ type: 'hr' });
    } else if (line.trim() === '') {
      blocks.push({ type: 'blank' });
    } else {
      blocks.push({ type: 'p', text: line });
    }
  }

  // unterminated code block — flush whatever we had
  if (inCodeBlock && codeBuffer.length) {
    blocks.push({ type: 'code', text: codeBuffer.join('\n') });
  }

  return blocks;
}

export function parseInline(text) {
  const spans = [];
  // Order matters: code first (so markup inside backticks isn't parsed),
  // then links, then bold, then italic.
  const pattern = /(`[^`]+`)|(\[[^\]]+\]\([^)]+\))|(\*\*[^*]+\*\*)|(\*[^*]+\*)/g;

  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      spans.push({ text: text.slice(lastIndex, match.index) });
    }

    const token = match[0];
    if (token.startsWith('`')) {
      spans.push({ text: token.slice(1, -1), code: true });
    } else if (token.startsWith('[')) {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      if (linkMatch) {
        spans.push({ text: linkMatch[1], link: linkMatch[2] });
      } else {
        spans.push({ text: token });
      }
    } else if (token.startsWith('**')) {
      spans.push({ text: token.slice(2, -2), bold: true });
    } else if (token.startsWith('*')) {
      spans.push({ text: token.slice(1, -1), italic: true });
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    spans.push({ text: text.slice(lastIndex) });
  }

  return spans.length ? spans : [{ text }];
}

export const DEFAULT_NOTE = `# Welcome to your notes

Type **markdown** on the left, see it rendered on the *right*.

- supports lists
- supports \`inline code\`
- supports [links](https://example.com)

> blockquotes too

\`\`\`
code blocks
\`\`\`
`;