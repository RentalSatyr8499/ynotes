// src/features/notes/lineState.js
//
// Manages the right pane's "dual-surface" editing model: the note is split
// into lines, where each line is either:
//   - active (committed: false)   -> shown as an editable raw-text TextInput
//   - committed (committed: true) -> shown as locked, rendered output
//
// Exactly one line is active at a time: the "current" line being typed.
// Pressing Enter commits the current line and opens a new active line
// after it. There is no un-commit step (matches product decision: once
// rendered, a line can only be removed and retyped, not edited in place).
//
// This file deliberately has no React/RN imports so the state machine can
// be unit tested on its own.

// A "Line" is { id, text, committed }. ids are stable so React keys don't
// thrash as lines are added/removed.

let _nextId = 1;
function makeId() {
  return _nextId++;
}

// Builds the initial line list from a flat note string. Every line except
// the last is committed (since the last line is, by definition, the one
// still being actively typed). This matters when seeding from DEFAULT_NOTE
// or from a note string coming from the plaintext pane.
export function linesFromText(text) {
  const rawLines = text.split('\n');
  return rawLines.map((lineText, i) => ({
    id: makeId(),
    text: lineText,
    committed: i < rawLines.length - 1,
  }));
}

// Flattens the line list back into a single note string (what the
// plaintext pane / shared note state actually stores).
export function linesToText(lines) {
  return lines.map((l) => l.text).join('\n');
}

// Finds the index of the active (uncommitted) line. Returns -1 if every
// line happens to be committed (shouldn't normally happen, but callers
// should handle it defensively).
export function activeLineIndex(lines) {
  return lines.findIndex((l) => !l.committed);
}

// Updates the text of the currently-active line. No-op if there is no
// active line.
export function updateActiveLineText(lines, newText) {
  const idx = activeLineIndex(lines);
  if (idx === -1) return lines;
  const next = lines.slice();
  next[idx] = { ...next[idx], text: newText };
  return next;
}

// Commits the active line (locks it as rendered output) and opens a fresh
// active line after it. This is what happens on Enter.
export function commitActiveLine(lines) {
  const idx = activeLineIndex(lines);
  if (idx === -1) return lines;
  const next = lines.slice();
  next[idx] = { ...next[idx], committed: true };
  next.splice(idx + 1, 0, { id: makeId(), text: '', committed: false });
  return next;
}

// Removes a committed line entirely (the "delete and retype" affordance).
// Used e.g. when the user backspaces at the very start of the active line
// and there's a committed line above it to remove.
export function removeLine(lines, id) {
  return lines.filter((l) => l.id !== id);
}

// Ensures there is always exactly one active line at the end. Useful as a
// safety net after removeLine, in case the removed line was the only one
// and we need to guarantee an editable line exists.
export function ensureActiveLine(lines) {
  if (lines.length === 0) {
    return [{ id: makeId(), text: '', committed: false }];
  }
  if (activeLineIndex(lines) === -1) {
    return [...lines, { id: makeId(), text: '', committed: false }];
  }
  return lines;
}