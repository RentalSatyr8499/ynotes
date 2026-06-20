// src/features/notes/lineState.js
//
// Pure state-machine functions for the editable preview pane's line list.
// Every line is { id, text } — no committed/active flag. Focus is tracked
// separately in React state (focusedLineId) so any line can be edited at
// any time just by tapping it.
//
// No React/RN imports — this file is unit-testable in plain Node.

let _nextId = 1;
function makeId() {
  return String(_nextId++);
}

// Builds a line list from a flat note string. All lines start unfocused;
// focus is managed separately as React state.
export function linesFromText(text) {
  const rawLines = text.split('\n');
  return rawLines.map((lineText) => ({
    id: makeId(),
    text: lineText,
  }));
}

// Flattens the line list back to the canonical note string.
export function linesToText(lines) {
  return lines.map((l) => l.text).join('\n');
}

// Updates the text of one line by id.
export function updateLineText(lines, id, newText) {
  return lines.map((l) => (l.id === id ? { ...l, text: newText } : l));
}

// Inserts a new blank line directly after the line with the given id.
// Returns { nextLines, newId } so the caller can focus the new line.
export function insertLineAfter(lines, id) {
  const idx = lines.findIndex((l) => l.id === id);
  if (idx === -1) return { nextLines: lines, newId: null };
  const newLine = { id: makeId(), text: '' };
  const nextLines = [
    ...lines.slice(0, idx + 1),
    newLine,
    ...lines.slice(idx + 1),
  ];
  return { nextLines, newId: newLine.id };
}

// Deletes the line with the given id. Returns { nextLines, focusId } where
// focusId is the id of the line that should receive focus after deletion
// (the preceding line, or the next one if there is no preceding line).
export function deleteLine(lines, id) {
  const idx = lines.findIndex((l) => l.id === id);
  if (idx === -1) return { nextLines: lines, focusId: null };
  const nextLines = lines.filter((l) => l.id !== id);
  if (nextLines.length === 0) {
    // Always keep at least one line
    const fallback = { id: makeId(), text: '' };
    return { nextLines: [fallback], focusId: fallback.id };
  }
  const focusIdx = Math.max(0, idx - 1);
  return { nextLines, focusId: nextLines[focusIdx].id };
}

// Ensures the line list is never empty (safety net).
export function ensureOneLine(lines) {
  if (lines.length > 0) return lines;
  return [{ id: makeId(), text: '' }];
}