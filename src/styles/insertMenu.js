// src/styles/insertMenu.js
//
// Styles for the InsertMenu floating button and dropdown.

import { StyleSheet, Platform } from 'react-native';
import { colors } from './tokens';

export const insertMenuStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 8,
    right: 8,
    alignItems: 'flex-end',
    zIndex: 100,
    ...Platform.select({ web: { isolation: 'isolate' } }),
  },

  button: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.buttonBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: colors.buttonBgActive,
  },

  // tintColor is applied as a prop on the Image, not here — see InsertMenu.js
  icon: {
    width: 16,
    height: 16,
  },

  dropdown: {
    position: 'absolute',
    top: 40,
    right: 0,
    minWidth: 160,
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

  option: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 14,
    color: colors.textBody,
    // no fontFamily — inherits system font, consistent with all other UI text
  },
});