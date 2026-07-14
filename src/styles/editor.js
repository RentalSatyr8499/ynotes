// src/styles/editor.js
//
// Styles for text input surfaces: the raw markdown TextInput in EditorPane
// and the active-line TextInput in EditablePreviewPane.

import { StyleSheet } from 'react-native';
import { MONO, colors } from './tokens';

export const editorStyles = StyleSheet.create({
  // Full-pane raw markdown TextInput (EditorPane)
  input: {
    flex: 1,
    color: colors.editorText,
    fontFamily: MONO,
    fontSize: 14,
    lineHeight: 20,
    padding: 16,
    paddingTop: 4,
    outlineWidth: 0,
  },

  // Single-line raw TextInput for the focused line in EditablePreviewPane
  activeLineInput: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textBody,
    padding: 0,
    margin: 0,
    outlineWidth: 0,
  },
});