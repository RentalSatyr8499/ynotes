// src/styles/tokens.js

import { Platform } from 'react-native';

export const APP_NAME = "yeeva's notes";
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
  inputBg:     '#fafafa',

  // editor text
  editorText:  '#1a1a1a',

  // preview / body text
  textDark:     '#111',
  textBody:     '#1a1a1a',
  textMuted:    '#555',
  textLabel:    '#888',
  textDisabled: '#aaa',
  textFaint:    '#bbb',

  // borders
  borderSubtle: '#f0f0f0',
  borderXLight: '#ddd',
  borderLight:  '#ccc',

  // interactive
  buttonBg:       'rgba(26,26,26,0.06)',
  buttonBgActive: 'rgba(26,26,26,0.12)',
  dropdownBorder: 'rgba(0,0,0,0.08)',

  // semantic aliases kept for preview.js back-compat
  quoteBorder:  '#ccc',  // == borderLight
  hrColor:      '#ddd',  // == borderXLight

  // accents
  inlineCodeBg:   '#eee',
  inlineCodeText: '#c7254e',
  linkText:       '#0969da',

  // status
  errorText: '#c0392b',
};