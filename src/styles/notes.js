// src/styles/notes.js
//
// Styles for the split-pane note editor/preview. Kept together since the
// two panes are visually a matched pair, but feel free to split further
// (e.g. editor.js / preview.js) as the app grows.

import { StyleSheet, Platform } from 'react-native';

export const MONO = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' });

export const noteScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  panes: {
    flex: 1,
    flexDirection: 'row',
  },
  panesStacked: {
    flexDirection: 'column',
  },
  pane: {
    flex: 1,
  },
  paneLeft: {
    borderRightWidth: 1,
    borderRightColor: '#333',
  },
  paneRight: {
    backgroundColor: '#fafafa',
  },
  paneStacked: {
    flex: 1,
    minHeight: 0,
  },
  paneLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#888',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
});

export const editorStyles = StyleSheet.create({
  input: {
    flex: 1,
    color: '#d4d4d4',
    fontFamily: MONO,
    fontSize: 14,
    lineHeight: 20,
    padding: 16,
    paddingTop: 4,
  },
});

export const previewStyles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 4,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1a1a1a',
    marginBottom: 2,
  },
  h1: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111',
    marginTop: 8,
    marginBottom: 4,
  },
  h2: {
    fontSize: 21,
    fontWeight: '700',
    color: '#111',
    marginTop: 8,
    marginBottom: 4,
  },
  h3: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
    marginTop: 6,
    marginBottom: 4,
  },
  bold: {
    fontWeight: '700',
  },
  italic: {
    fontStyle: 'italic',
  },
  inlineCode: {
    fontFamily: MONO,
    fontSize: 13.5,
    backgroundColor: '#eee',
    color: '#c7254e',
    paddingHorizontal: 4,
    borderRadius: 3,
  },
  link: {
    color: '#0969da',
    textDecorationLine: 'underline',
  },
  quoteBlock: {
    borderLeftWidth: 3,
    borderLeftColor: '#ccc',
    paddingLeft: 12,
    marginVertical: 4,
  },
  quoteText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
    fontStyle: 'italic',
  },
  codeBlock: {
    backgroundColor: '#eee',
    borderRadius: 6,
    padding: 10,
    marginVertical: 6,
  },
  codeBlockText: {
    fontFamily: MONO,
    fontSize: 13.5,
    color: '#1a1a1a',
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingLeft: 4,
  },
  bullet: {
    width: 16,
    color: '#1a1a1a',
  },
  listItemText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#1a1a1a',
  },
  hr: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  blankSpace: {
    height: 8,
  },
});