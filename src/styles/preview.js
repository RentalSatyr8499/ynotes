// src/styles/preview.js
//
// Styles for rendered markdown output — used by both the read-only
// PreviewPane and the committed lines in EditablePreviewPane.

import { StyleSheet } from 'react-native';
import { MONO, colors } from './tokens';

export const previewStyles = StyleSheet.create({
  // Read-only PreviewPane scroll container
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 4,
  },

  // Block types
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textBody,
    marginBottom: 2,
  },
  h1: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textDark,
    marginTop: 8,
    marginBottom: 4,
  },
  h2: {
    fontSize: 21,
    fontWeight: '700',
    color: colors.textDark,
    marginTop: 8,
    marginBottom: 4,
  },
  h3: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textDark,
    marginTop: 6,
    marginBottom: 4,
  },
  quoteBlock: {
    borderLeftWidth: 3,
    borderLeftColor: colors.quoteBorder,
    paddingLeft: 12,
    marginVertical: 4,
  },
  quoteText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  codeBlock: {
    backgroundColor: colors.inlineCodeBg,
    borderRadius: 6,
    padding: 10,
    marginVertical: 6,
  },
  codeBlockText: {
    fontFamily: MONO,
    fontSize: 13.5,
    color: colors.textBody,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingLeft: 4,
  },
  bullet: {
    width: 16,
    color: colors.textBody,
  },
  listItemText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textBody,
  },
  hr: {
    height: 1,
    backgroundColor: colors.hrColor,
    marginVertical: 10,
  },
  blankSpace: {
    height: 8,
  },

  // Inline styles (applied as nested Text spans within any block)
  bold: {
    fontWeight: '700',
  },
  italic: {
    fontStyle: 'italic',
  },
  inlineCode: {
    fontFamily: MONO,
    fontSize: 13.5,
    backgroundColor: colors.inlineCodeBg,
    color: colors.inlineCodeText,
    paddingHorizontal: 4,
    borderRadius: 3,
  },
  link: {
    color: colors.linkText,
    textDecorationLine: 'underline',
  },
});