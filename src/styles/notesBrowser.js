// src/styles/notesBrowser.js

import { StyleSheet, useWindowDimensions } from 'react-native';
import { colors } from './tokens';

export function useNotesBrowserStyles() {
  const { width, height } = useWindowDimensions();

  const hMargin = width * 0.12;
  const vMargin = height * 0.06;
  const headingSize = Math.max(width * 0.06, 32);

  const styles = StyleSheet.create({
    screen: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: colors.pageBg,
    },
    container: {
      flex: 1,
      backgroundColor: colors.pageBg,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      paddingHorizontal: hMargin,
      paddingTop: vMargin * 1.5,
      paddingBottom: vMargin * 0.5,
    },
    heading: {
      fontSize: headingSize,
      fontWeight: '200',
      color: colors.textDark,
      lineHeight: headingSize * 1.1,
    },
    refreshButton: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 8,
      backgroundColor: colors.editorBg,
      marginBottom: 4,
    },
    refreshText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.textMuted,
    },
    scrollContent: {
      paddingHorizontal: hMargin,
      paddingTop: vMargin,
      paddingBottom: vMargin * 2,
      gap: 8,
    },
    sectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      color: colors.textFaint,
      marginTop: vMargin * 0.75,
      marginBottom: 12,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingRight: 4,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderSubtle,
    },
    rowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    rowRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    rowActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    rowActionIconWrap: {
      padding: 2,
    },
    rowActionIcon: {
      width: 14,
      height: 14,
      resizeMode: 'contain',
      opacity: 0.25,
    },
    rowActionIconActive: {
      opacity: 1,
      tintColor: colors.textDark,
    },
    rowActionText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.textDisabled,
    },
    rowActionTextActive: {
      color: colors.textDark,
      textDecorationLine: 'underline',
    },
    rowActionDivider: {
      fontSize: 12,
      color: colors.borderXLight,
    },
    rowIcon: {
      width: 18,
      height: 18,
      resizeMode: 'contain',
      opacity: 0.25,
    },
    rowIconActive: {
      opacity: 1,
    },
    rowTitle: {
      fontSize: 16,
      color: colors.textBody,
    },
    rowChevron: {
      fontSize: 18,
      color: colors.borderLight,
    },
    rowChevronOpen: {
      transform: [{ rotate: '90deg' }],
    },
    emptyText: {
      fontSize: 14,
      color: colors.borderLight,
      paddingVertical: 12,
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
    },
    errorText: {
      fontSize: 15,
      color: colors.errorText,
    },
    rowCreateInline: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    rowCreateInput: {
      borderWidth: 0,
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 4,
      fontSize: 12,
      fontStyle: 'italic',
      color: colors.textBody,
      minWidth: 140,
      backgroundColor: colors.inputBg,
      outlineStyle: 'none',
      outlineWidth: 0,
    },
  });

  return { ...styles, indentSize: 24 };
}