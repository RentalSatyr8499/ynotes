// src/components/editor/MenuBar.js
//
// The horizontal bar under the title row: File | Format
// Sync status has moved up to EditorHeader's title row.

import React from 'react';
import { View } from 'react-native';
import MenuBarItem from './MenuBarItem';
import { editorHeaderStyles as styles } from '../../styles/editorHeader';

const FORMAT_OPTIONS = [
  { label: 'Heading',     onPress: () => {} },
  { label: 'Image',       onPress: () => {} },
  { label: 'Inline code', onPress: () => {} },
  { label: 'Code block',  onPress: () => {} },
  { label: 'Bold',        onPress: () => {} },
  { label: 'Italic',      onPress: () => {} },
  { label: 'Link',        onPress: () => {} },
];

export default function MenuBar({ onFileAction }) {
  const fileOptions = [
    { label: 'Share note',    onPress: () => onFileAction?.('share')    },
    { label: 'Delete note',   onPress: () => onFileAction?.('delete')   },
    { label: 'Download note', onPress: () => onFileAction?.('download') },
  ];

  return (
    <View style={styles.menuBar}>
      <MenuBarItem label="File"   options={fileOptions}    />
      <MenuBarItem label="Format" options={FORMAT_OPTIONS} />
    </View>
  );
}