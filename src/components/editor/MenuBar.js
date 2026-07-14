// src/components/editor/MenuBar.js
//
// The horizontal bar under the note title: File | Format | … | Syncing
// Menus are defined here and passed down to MenuBarItem.

import React from 'react';
import { View } from 'react-native';
import MenuBarItem from './MenuBarItem';
import SyncStatus from './SyncStatus';
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

// onFileAction is called with the action key so the parent screen can handle
// navigation/logic (e.g. 'share', 'delete', 'download').
export default function MenuBar({ onFileAction, syncStatus }) {
  const fileOptions = [
    { label: 'Share note',    onPress: () => onFileAction?.('share')    },
    { label: 'Delete note',   onPress: () => onFileAction?.('delete')   },
    { label: 'Download note', onPress: () => onFileAction?.('download') },
  ];

  return (
    <View style={styles.menuBar}>
      <MenuBarItem label="File"   options={fileOptions}   />
      <MenuBarItem label="Format" options={FORMAT_OPTIONS} />
      <SyncStatus status={syncStatus} />
    </View>
  );
}
