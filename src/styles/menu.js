// src/styles/menu.js
//
// Shared styles for all dropdown menus and their triggers across the app.

import { StyleSheet, Platform } from 'react-native';
import { colors } from './tokens';

export const menuStyles = StyleSheet.create({

  // ── Floating icon button (InsertMenu trigger) ────────────────────────────
  floatingContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    alignItems: 'flex-end',
    zIndex: 100,
    ...Platform.select({ web: { isolation: 'isolate' } }),
  },
  floatingButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.buttonBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingButtonActive: {
    backgroundColor: colors.buttonBgActive,
  },
  floatingButtonIcon: {
    width: 16,
    height: 16,
  },

  // ── Text label trigger (MenuBarItem trigger) ─────────────────────────────
  menuTrigger: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  menuTriggerHovered: {
    backgroundColor: colors.buttonBg,
  },
  menuTriggerText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  menuTriggerTextHovered: {
    color: colors.textBody,
  },

  // ── Dropdown panel ───────────────────────────────────────────────────────
  // Rendered inside a transparent Modal, so position is set inline
  // from measured trigger coordinates rather than here.
  dropdown: {
    position: 'absolute',
    minWidth: 180,
    backgroundColor: colors.pageBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.dropdownBorder,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
      },
      default: {
        shadowColor: '#888',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 8,
      },
    }),
  },

  // ── Dropdown options ─────────────────────────────────────────────────────
  option: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  optionHovered: {
    backgroundColor: colors.buttonBg,
  },
  optionText: {
    fontSize: 14,
    color: colors.textBody,
  },
});