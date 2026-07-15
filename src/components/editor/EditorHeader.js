// src/components/editor/EditorHeader.js
//
// The top-of-screen header for the editor: logo, note title, sync status,
// and menu bar. No background — sits transparently above the content area.

import React from 'react';
import { View, Text, Image } from 'react-native';
import MenuBar from './MenuBar';
import SyncStatus from './SyncStatus';
import { editorHeaderStyles as styles } from '../../styles/editorHeader';

export default function EditorHeader({ title, onFileAction, syncStatus }) {
  return (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Image
          source={require('../../assets/brand/logo_icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title} numberOfLines={1}>
          {title ?? 'Untitled'}
        </Text>
        <SyncStatus status={syncStatus} />
      </View>
      <MenuBar onFileAction={onFileAction} />
    </View>
  );
}