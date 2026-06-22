// src/styles/editor.js
//
// Styles for the plaintext editor pane (left) and the active-line
// TextInput within the editable preview pane (right).

import { StyleSheet } from 'react-native';
import { MONO, colors } from './tokens';

export const editorStyles = StyleSheet.create({
  // Full-pane raw markdown TextInput (left pane)
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

  // Single-line raw TextInput shown for the active (uncommitted) line
  // in the editable preview pane (right pane)
  activeLineInput: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textBody,
    padding: 0,
    margin: 0,
    outlineWidth: 0,
  },
});