// src/components/editor/SyncStatus.js
//
// Displays the current sync state. Accepts a `syncStatus` prop shaped as:
//   { state: 'idle' | 'syncing' | 'error', error?: string, lastSyncedAt?: Date }
// which matches the return value of useSyncStatus directly — no mapping needed.

import React from 'react';
import { View, Text, Image } from 'react-native';
import { editorHeaderStyles as styles } from '../../styles/editorHeader';

const SYNC_ICONS = {
  idle:    require('../../assets/icons/online.png'),
  syncing: require('../../assets/icons/idle.png'),
  error:   require('../../assets/icons/close.png'),
};

const DEFAULT_LABELS = {
  idle:    'Synced',
  syncing: 'Syncing',
  error:   'Error',
};

export default function SyncStatus({ syncStatus = { state: 'syncing' } }) {
  const { state, error } = syncStatus;
  const icon  = SYNC_ICONS[state]        ?? SYNC_ICONS.syncing;
  const label = DEFAULT_LABELS[state]    ?? 'Syncing';
  const text  = state === 'error' && error ? error : label;

  return (
    <View style={styles.syncItem}>
      <Image
        source={icon}
        style={styles.syncIcon}
        resizeMode="contain"
      />
      <Text style={styles.syncText}>{text}</Text>
    </View>
  );
}