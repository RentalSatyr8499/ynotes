// src/components/editor/SyncStatus.js
//
// Displays the current sync state. Accepts a `status` prop so the parent
// can drive it from live backend state when that's ready.
//
// status shape:
//   { state: 'synced' | 'syncing' | 'error' | 'offline', label?: string }
//
// Default (no prop): shows 'Syncing' with the neutral icon, ready to be
// wired up.

import React from 'react';
import { View, Text, Image } from 'react-native';
import { editorHeaderStyles as styles } from '../../styles/editorHeader';

const SYNC_ICONS = {
  synced:  require('../../assets/icons/online.png'),
  syncing: require('../../assets/icons/idle.png'),
  error:   require('../../assets/icons/close.png'),
  offline: require('../../assets/icons/idle.png'),
};

const DEFAULT_LABELS = {
  synced:  'Synced',
  syncing: 'Syncing',
  error:   'Error',
  offline: 'Offline',
};

export default function SyncStatus({ status = { state: 'syncing' } }) {
  const { state, label } = status;
  const icon = SYNC_ICONS[state] ?? SYNC_ICONS.syncing;
  const text = label ?? DEFAULT_LABELS[state] ?? 'Syncing';

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