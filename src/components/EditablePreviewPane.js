// src/components/EditablePreviewPane.js
//
// Renders the line list as a mix of editable TextInputs and rendered
// markdown output. Any line can be focused at any time — tapping a
// rendered line focuses it; the focused line is always a raw TextInput.

import React, { useEffect, useRef } from 'react';
import { View, ScrollView, Text } from 'react-native';
import RenderedLine from './RenderedLine';
import { screenStyles } from '../styles/screen';

export default function EditablePreviewPane({
  lines,
  focusedLineId,
  onChangeLineText,
  onEnter,
  onDeleteEmptyLine,
  onLineFocus,
  style,
}) {
  // A map of line id -> TextInput ref, so we can programmatically focus
  // whichever line needs it after state changes (Enter, delete, tap).
  const inputRefs = useRef({});

  // Programmatically focus the right input whenever focusedLineId changes,
  // and move the caret to the end of that line's text.
  useEffect(() => {
    if (!focusedLineId) return;
    const timer = setTimeout(() => {
      const ref = inputRefs.current[focusedLineId];
      if (!ref) return;
      ref.focus?.();
      // On web, the ref is a DOM textarea — move caret to end explicitly.
      if (typeof ref.setSelectionRange === 'function') {
        const len = ref.value?.length ?? 0;
        ref.setSelectionRange(len, len);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [focusedLineId]);

  // Clean up refs for lines that have been removed.
  useEffect(() => {
    const currentIds = new Set(lines.map((l) => l.id));
    Object.keys(inputRefs.current).forEach((id) => {
      if (!currentIds.has(id)) delete inputRefs.current[id];
    });
  }, [lines]);

  return (
    <View style={style}>
      <Text style={screenStyles.paneLabel}>Preview (editable)</Text>
      <ScrollView
        style={screenStyles.editablePreviewScroll}
        contentContainerStyle={screenStyles.editablePreviewContent}
        keyboardShouldPersistTaps="handled"
      >
        {lines.map((line) => (
          <RenderedLine
            key={line.id}
            line={line}
            isFocused={line.id === focusedLineId}
            onChangeText={(text) => onChangeLineText(line.id, text)}
            onEnter={() => onEnter(line.id)}
            onDeleteEmptyLine={() => onDeleteEmptyLine(line.id)}
            onFocus={() => onLineFocus(line.id)}
            inputRef={(ref) => {
              if (ref) inputRefs.current[line.id] = ref;
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}