// src/components/NotesRow.js
//
// Single row in the notes tree. Renders a folder or note with icon,
// label, and an optional chevron for folders.

import React, { useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';

const FOLDER_ICON = require('../assets/icons/folder.png');
const FILE_ICON   = require('../assets/icons/file.png');

export function NotesRow({ item, depth, isOpen, onPress, styles }) {
  const [hovered, setHovered] = useState(false);
  const icon = item.type === 'folder' ? FOLDER_ICON : FILE_ICON;
  const indent = depth * styles.indentSize;
  const iconOpaque = isOpen || hovered;

  return (
    <Pressable
      style={[styles.row, { paddingLeft: indent }]}
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPressIn={() => setHovered(true)}
      onPressOut={() => setHovered(false)}
    >
      <View style={styles.rowLeft}>
        <Image
          source={icon}
          style={[styles.rowIcon, iconOpaque && styles.rowIconActive]}
        />
        <Text style={styles.rowTitle}>{item.name}</Text>
      </View>
      {item.type === 'folder' && (
        <Text style={[styles.rowChevron, isOpen && styles.rowChevronOpen]}>›</Text>
      )}
    </Pressable>
  );
}