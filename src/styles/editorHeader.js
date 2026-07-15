// src/styles/editorHeader.js
//
// Styles for the editor screen header shell: logo, note title, menu bar row,
// and sync status. Dropdown and trigger styles live in styles/menu.js.

import { StyleSheet } from 'react-native';
import { colors } from './tokens';

export const editorHeaderStyles = StyleSheet.create({
  // Outer shell — no background, sits above the panes
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 0,
  },

  // Top row: [logo] [title] [sync status]
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 20,
    marginBottom: 6,
  },

  // Brand logo
  logo: {
    width: 50,
    height: 50,
  },

  // Note title
  title: {
    fontSize: 38,
    fontWeight: '600',
    color: colors.textBody,
    flexShrink: 1,
  },

  // Row containing File, Format
  menuBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    paddingBottom: 2,
  },

  // ── Sync status (in title row, after the title) ───────────────────────────
  syncItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  syncIcon: {
    width: 12,
    height: 12,
  },
  syncText: {
    fontSize: 12,
    color: colors.textDisabled,
  },
});