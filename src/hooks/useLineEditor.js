// src/hooks/useLineEditor.js
//
// Bridges the line-commit state machine (features/notes/lineState.js) with
// React state, and keeps it in sync with the shared flat note string used
// by the plaintext pane (via useNote).
//
// Sync direction: this hook is the source of truth while the user is
// actively editing in the rendered pane. Every change calls back up to
// `onChangeNoteText` so the plaintext pane mirrors it live. If the note
// text changes from *outside* this hook (e.g. user typed in the plaintext
// pane instead), `syncFromExternalText` re-derives the line list so the
// rendered pane catches up.

import { useCallback, useRef, useState } from 'react';
import {
  linesFromText,
  linesToText,
  updateActiveLineText,
  commitActiveLine,
  removeLine,
  ensureActiveLine,
  activeLineIndex,
} from '../features/notes/lineState';

export default function useLineEditor(initialText, onChangeNoteText) {
  const [lines, setLines] = useState(() => linesFromText(initialText));

  // Tracks the last text *this hook* produced, so we can tell the
  // difference between "the plaintext pane changed the note" (need to
  // re-derive lines) vs. "we changed it ourselves" (no-op, avoids
  // clobbering in-progress edits / re-keying lines unnecessarily).
  const lastEmittedText = useRef(linesToText(lines));

  const emit = useCallback(
    (nextLines) => {
      setLines(nextLines);
      const text = linesToText(nextLines);
      lastEmittedText.current = text;
      onChangeNoteText(text);
    },
    [onChangeNoteText]
  );

  const onChangeActiveLineText = useCallback(
    (text) => {
      emit(updateActiveLineText(lines, text));
    },
    [lines, emit]
  );

  const onCommitActiveLine = useCallback(() => {
    emit(commitActiveLine(lines));
  }, [lines, emit]);

  // Backspace at the very start of the active line, when there's a
  // committed line directly above: removes that committed line (the
  // "delete and retype" affordance), per product decision that committed
  // lines can't be edited in place.
  const onDeletePrecedingCommittedLine = useCallback(() => {
    const idx = activeLineIndex(lines);
    if (idx <= 0) return; // no committed line above to delete
    const precedingLine = lines[idx - 1];
    if (!precedingLine.committed) return;
    emit(ensureActiveLine(removeLine(lines, precedingLine.id)));
  }, [lines, emit]);

  // Call this when the note text changed from outside this hook (e.g. the
  // plaintext pane). Re-derives the line list from scratch. Cheap and
  // simple; fine for note sizes a single-pane editor will realistically
  // see. Skips the rebuild if the incoming text matches what we last
  // emitted ourselves, since that's just our own change echoing back.
  const syncFromExternalText = useCallback((text) => {
    if (text === lastEmittedText.current) return;
    lastEmittedText.current = text;
    setLines(linesFromText(text));
  }, []);

  return {
    lines,
    onChangeActiveLineText,
    onCommitActiveLine,
    onDeletePrecedingCommittedLine,
    syncFromExternalText,
  };
}