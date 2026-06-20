// src/styles/screen.js
//
// Layout styles for the top-level split-pane screen: the outer container,
// pane splitting (side-by-side vs. stacked), pane labels, and the scroll
// containers used by the editable preview pane.

import { StyleSheet } from 'react-native';
import { colors } from './tokens';

export const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.editorBg,
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
    borderRightColor: colors.divider,
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
});