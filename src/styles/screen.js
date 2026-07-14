// src/styles/screen.js

import { StyleSheet } from 'react-native';
import { colors } from './tokens';

export const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pageBg,
  },
  // Outer row/column that holds both panes. The 10% horizontal margin
  // is applied dynamically in index.js via useWindowDimensions since
  // StyleSheet doesn't support screen-relative values.
  panes: {
    flex: 1,
    flexDirection: 'row',
  },
  panesStacked: {
    flexDirection: 'column',
  },
  // Each pane fills its half of the inner (80%-wide) area.
  pane: {
    flex: 1,
  },
  paneLeft: {
    backgroundColor: colors.editorBg,
    borderRadius: 0,
    // no border, no outline — square corners, flat
  },
  paneRight: {
    backgroundColor: colors.previewBg,
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
    color: colors.textLabel,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  editablePreviewScroll: {
    flex: 1,
    backgroundColor: colors.previewBg,
  },
  editablePreviewContent: {
    padding: 16,
    paddingTop: 4,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});