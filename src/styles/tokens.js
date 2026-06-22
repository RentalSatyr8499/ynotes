// src/styles/tokens.js

import { Platform } from 'react-native';

export const MONO = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

export const colors = {
  // surfaces
  pageBg:      '#ffffff',
  editorBg:    '#f5f0eb',  // eggshell
  previewBg:   '#ffffff',

  // editor text
  editorText:  '#1a1a1a',

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