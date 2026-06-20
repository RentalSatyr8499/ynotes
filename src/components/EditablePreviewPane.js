// src/components/EditablePreviewPane.js
//
// The "type directly into the rendered preview" pane. Renders the line
// list from useLineEditor: committed lines as locked styled output,
// the one active line as an editable raw-text TextInput.
//
// Enter commits the active line and opens a new one below it.
// Backspace at the very start of an empty active line removes the
// committed line directly above it (the only supported way to "edit" a
// rendered line, per product decision — delete and retype, not edit
// in place).

import React, { useEffect, useRef } from 'react';
import { View, ScrollView, Text } from 'react-native';
import RenderedLine from './RenderedLine';
import { screenStyles } from '../styles/screen';
import { activeLineIndex } from '../features/notes/lineState';

export default function EditablePreviewPane({
  lines,
  onChangeActiveLineText,
  onCommitActiveLine,
  onDeletePrecedingCommittedLine,
  style,
}) {
  const activeInputRef = useRef(null);
  const activeIdx = activeLineIndex(lines);

  // Re-focus the active input whenever a new one is created (e.g. right
  // after committing a line), so typing can continue uninterrupted.
  useEffect(() => {
    activeInputRef.current?.focus?.();
  }, [activeIdx]);

  const handleKeyPress = (e) => {
    const key = e.nativeEvent.key;
    const activeLine = lines[activeIdx];
    if (key === 'Backspace' && activeLine && activeLine.text === '') {
      // Cursor is in an empty active line with nothing to delete locally —
      // treat as "delete the committed line above" per spec.
      onDeletePrecedingCommittedLine();
    }
  };

  return (
    <View style={style}>
      <Text style={screenStyles.paneLabel}>Preview (editable)</Text>
      <ScrollView
        style={screenStyles.editablePreviewScroll}
        contentContainerStyle={screenStyles.editablePreviewContent}
        keyboardShouldPersistTaps="handled"
      >
        {lines.map((line, idx) => (
          <RenderedLine
            key={line.id}
            line={line}
            isActive={idx === activeIdx}
            onChangeText={onChangeActiveLineText}
            onSubmitEditing={onCommitActiveLine}
            onKeyPress={handleKeyPress}
            inputRef={idx === activeIdx ? activeInputRef : null}
          />
        ))}
      </ScrollView>
    </View>
  );
}