// src/features/sync/syncService.js
//
// Pure functions for three-way line-based merge.
// No React, no API calls — operates only on strings and arrays.
// Every function here is independently testable.

// Splits plaintext into a line array.
// Single canonical definition so all callers agree on what a "line" is.
// A trailing newline produces a trailing empty string, which we strip —
// the Docs API adds one and we don't want it to produce a phantom line.
export function splitLines(text) {
  if (!text) return [];
  const lines = text.split('\n');
  if (lines[lines.length - 1] === '') lines.pop();
  return lines;
}

// Joins a line array back to plaintext.
export function linesToText(lines) {
  return lines.join('\n');
}

// Compares two line arrays and returns a Map of { lineIndex → newContent }
// for every line that differs. Lines beyond the end of `base` that exist
// in `changed` are included (additions); lines in `base` beyond the end
// of `changed` are recorded as null (deletions).
export function diffLines(base, changed) {
  const diff = new Map();
  const len  = Math.max(base.length, changed.length);

  for (let i = 0; i < len; i++) {
    const baseLine    = i < base.length    ? base[i]    : undefined;
    const changedLine = i < changed.length ? changed[i] : undefined;

    if (baseLine !== changedLine) {
      // undefined means the line was deleted on that side
      diff.set(i, changedLine);
    }
  }

  return diff;
}

// Three-way line merge.
//
// base   — line array at the last confirmed sync point
// local  — current client line array
// remote — freshly fetched remote line array
//
// Resolution rules per line index:
//   changed locally only  → take local
//   changed remotely only → take remote
//   changed by both       → take local  (client wins)
//   unchanged by either   → take base
//
// Returns the merged line array.
export function mergeLines(base, local, remote) {
  const localDiff  = diffLines(base, local);
  const remoteDiff = diffLines(base, remote);

  const len    = Math.max(base.length, local.length, remote.length);
  const merged = [];

  for (let i = 0; i < len; i++) {
    const hasLocalChange  = localDiff.has(i);
    const hasRemoteChange = remoteDiff.has(i);

    if (hasLocalChange) {
      // Client wins — covers "local only" and "both changed"
      const line = localDiff.get(i);
      if (line !== undefined) merged.push(line);
    } else if (hasRemoteChange) {
      const line = remoteDiff.get(i);
      if (line !== undefined) merged.push(line);
    } else {
      // Unchanged on both sides — keep base (will be undefined if i >= base.length,
      // which can't happen here since len = max of all three)
      if (i < base.length) merged.push(base[i]);
    }
  }

  return merged;
}