// src/styles/notesBrowser.js

import { StyleSheet, useWindowDimensions } from 'react-native';

export function useNotesBrowserStyles() {
  const { width, height } = useWindowDimensions();

  const hMargin = width * 0.12;
  const vMargin = height * 0.06;
  const headingSize = Math.max(width * 0.06, 32);

  const styles = StyleSheet.create({
    screen: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: '#ffffff',
    },
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
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
      color: '#111',
      lineHeight: headingSize * 1.1,
    },
    refreshButton: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 8,
      backgroundColor: '#f5f0eb',
      marginBottom: 4,
    },
    refreshText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#555',
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
      color: '#bbb',
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
      borderBottomColor: '#f0f0f0',
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
    rowActionIcon: {
      width: 14,
      height: 14,
      resizeMode: 'contain',
      opacity: 0.35,
    },
    rowActionText: {
      fontSize: 12,
      fontWeight: '500',
      color: '#aaa',
    },
    rowActionDivider: {
      fontSize: 12,
      color: '#ddd',
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
      color: '#1a1a1a',
    },
    rowChevron: {
      fontSize: 18,
      color: '#ccc',
    },
    rowChevronOpen: {
      transform: [{ rotate: '90deg' }],
    },
    emptyText: {
      fontSize: 14,
      color: '#ccc',
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
      color: '#c0392b',
    },
  });

  return { ...styles, indentSize: 24 };
}