// src/hooks/useLineEditor.js
//
// Manages the editable preview pane's line list and focus state.
//
// Key design decisions:
//   - `focusedLineId` is explicit React state (not derived from the line
//     list), so any line can be focused at any time by tapping it.
//   - All mutations target lines by id, so stable ids mean React doesn't
//     re-key/re-mount unrelated TextInputs on every keystroke.
//   - `lastEmittedText` ref prevents the external-sync useEffect in
//     index.js from rebuilding lines when the note change originated here.

import { useCallback, useRef, useState } from 'react';
import {
  linesFromText,
  linesToText,
  updateLineText,
  insertLineAfter,
  deleteLine,
  ensureOneLine,
} from '../features/notes/lineState';

export default function useLineEditor(initialText, onChangeNoteText) {
  const [lines, setLines] = useState(() => linesFromText(initialText));
  const [focusedLineId, setFocusedLineId] = useState(
    () => {
      const initial = linesFromText(initialText);
      // Start focused on the last line, matching the old behaviour of
      // the active line always being at the bottom on first load.
      return initial[initial.length - 1]?.id ?? null;
    }
  );

  const lastEmittedText = useRef(linesToText(linesFromText(initialText)));

  // Emits a new line list: updates React state, syncs note text upward.
  const emit = useCallback(
    (nextLines) => {
      setLines(nextLines);
      const text = linesToText(nextLines);
      lastEmittedText.current = text;
      onChangeNoteText(text);
    },
    [onChangeNoteText]
  );

  // Called by RenderedLine's onChangeText for the focused input.
  const onChangeLineText = useCallback(
    (id, text) => {
      // Strip newlines — Enter is handled separately via onKeyPress.
      emit(updateLineText(lines, id, text.replace(/\n/g, '')));
    },
    [lines, emit]
  );

  // Called on Enter: insert a blank line after the current one and focus it.
  const onEnter = useCallback(
    (id) => {
      const { nextLines, newId } = insertLineAfter(lines, id);
      emit(nextLines);
      setFocusedLineId(newId);
    },
    [lines, emit]
  );

  // Called on Backspace when the focused line is empty: delete it and focus
  // the preceding line (standard document-editor behaviour).
  const onDeleteEmptyLine = useCallback(
    (id) => {
      const { nextLines, focusId } = deleteLine(lines, id);
      emit(ensureOneLine(nextLines));
      setFocusedLineId(focusId);
    },
    [lines, emit]
  );

  // Called when a line's TextInput gains focus (tap or programmatic).
  const onLineFocus = useCallback((id) => {
    setFocusedLineId(id);
  }, []);

  // Re-derives line list from external text change (e.g. left pane edit).
  // Skips if the text matches what we last emitted ourselves.
  const syncFromExternalText = useCallback((text) => {
    if (text === lastEmittedText.current) return;
    lastEmittedText.current = text;
    const nextLines = linesFromText(text);
    setLines(nextLines);
    // Keep focus on the last line after an external sync, since we have
    // no way to know which line the user was editing in the left pane.
    setFocusedLineId(nextLines[nextLines.length - 1]?.id ?? null);
  }, []);

  return {
    lines,
    focusedLineId,
    onChangeLineText,
    onEnter,
    onDeleteEmptyLine,
    onLineFocus,
    syncFromExternalText,
  };
}