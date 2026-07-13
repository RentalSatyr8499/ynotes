// src/components/notesBrowser/NotesRowActions.js
//
// The "New folder | New file" action bar shown on active folder rows.
// Owns its own hover states. Receives the fade animation from the
// parent so the parent controls when it appears/disappears.

import React, { useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import Animated from 'react-native-reanimated';

const PLUS_ICON = require('../../assets/icons/plus.png');

export function NotesRowActions({ onStartCreating, animatedStyle, styles }) {
  const [folderActionHovered, setFolderActionHovered] = useState(false);
  const [fileActionHovered, setFileActionHovered]     = useState(false);
  const [plusHovered, setPlusHovered]                 = useState(false);

  const anyActionHovered = folderActionHovered || fileActionHovered || plusHovered;

  return (
    <Animated.View style={[styles.rowActions, animatedStyle]}>
      <Pressable
        onHoverIn={() => { setPlusHovered(true); setFolderActionHovered(true); }}
        onHoverOut={() => { setPlusHovered(false); setFolderActionHovered(false); }}
        onPress={(e) => onStartCreating('folder', e)}
        style={styles.rowActionIconWrap}
      >
        <Image
          source={PLUS_ICON}
          style={[styles.rowActionIcon, anyActionHovered && styles.rowActionIconActive]}
        />
      </Pressable>

      <Pressable
        onHoverIn={() => setFolderActionHovered(true)}
        onHoverOut={() => setFolderActionHovered(false)}
        onPress={(e) => onStartCreating('folder', e)}
      >
        <Text style={[styles.rowActionText, folderActionHovered && styles.rowActionTextActive]}>
          New folder
        </Text>
      </Pressable>

      <Text style={styles.rowActionDivider}>|</Text>

      <Pressable
        onHoverIn={() => setFileActionHovered(true)}
        onHoverOut={() => setFileActionHovered(false)}
        onPress={(e) => onStartCreating('file', e)}
      >
        <Text style={[styles.rowActionText, fileActionHovered && styles.rowActionTextActive]}>
          New file
        </Text>
      </Pressable>
    </Animated.View>
  );
}