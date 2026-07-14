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

  // Brand logo
  logo: {
    width: 28,
    height: 28,
    marginBottom: 10,
  },

  // Note title
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textBody,
    marginBottom: 6,
  },

  // Row containing File, Format, … Syncing
  menuBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    paddingBottom: 2,
  },

  // ── Sync status ───────────────────────────────────────────────────────────
  syncItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginLeft: 'auto',
  },
  syncIcon: {
    width: 12,
    height: 12,
  },
  syncText: {
    fontSize: 13,
    color: colors.textDisabled,
  },
});