// src/styles/tokens.js
//
// Shared design tokens used across editor and preview stylesheets.
// Import from here rather than hardcoding values in individual style files.

import { Platform } from 'react-native';

export const MONO = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

export const colors = {
  // surfaces
  editorBg:    '#1e1e1e',
  previewBg:   '#fafafa',
  divider:     '#333',

  // editor text
  editorText:  '#d4d4d4',

  // preview text
  textDark:    '#111',
  textBody:    '#1a1a1a',
  textMuted:   '#555',
  textLabel:   '#888',

  // accents
  inlineCodeBg:   '#eee',
  inlineCodeText: '#c7254e',
  linkText:       '#0969da',
  quoteBorder:    '#ccc',
  hrColor:        '#ddd',
};