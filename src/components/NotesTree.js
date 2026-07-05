// src/components/NotesTree.js
//
// Notes/file tree UI. Renders folders and notes using a recursive list.
// Depends on parseLevel() from features/fileBrowser/tree.

import React, { useState } from 'react';
import { View, Text, Pressable, Image, ScrollView } from 'react-native';
import CollapsibleChildren from './CollapsibleChildren';
import { parseLevel } from '../features/fileBrowser/tree';
import { useFolderState } from '../features/fileBrowser/useFolderState';
import { NotesSection } from './NotesSection';

const FOLDER_ICON = require('../assets/icons/folder.png');
const FILE_ICON   = require('../assets/icons/file.png');

function Row({ item, depth, isOpen, onPress, styles }) {
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

function ItemList({ items, openPaths, onToggleFolder, onPressNote, depth = 0, styles }) {
  const rows = [];

  for (const item of items) {
    const path = `${depth}:${item.name}`;
    const isOpen = openPaths.has(path);

    rows.push(
      <Row
        key={path}
        item={item}
        depth={depth}
        isOpen={isOpen}
        onPress={() => {
          if (item.type === 'folder') onToggleFolder(path);
          else onPressNote(item);
        }}
        styles={styles}
      />
    );

    if (item.type === 'folder') {
      const children = parseLevel(item.subtree);
      rows.push(
        <CollapsibleChildren key={`${path}-children`} isOpen={isOpen}>
          <ItemList
            items={children}
            openPaths={openPaths}
            onToggleFolder={onToggleFolder}
            onPressNote={onPressNote}
            depth={depth + 1}
            styles={styles}
          />
        </CollapsibleChildren>
      );
    }
  }

  return <>{rows}</>;
}

function Section({ label, tree, openPaths, onToggleFolder, onPressNote, styles }) {
  const items = parseLevel(tree);

  return (
    <View>
      <Text style={styles.sectionLabel}>{label}</Text>
      {items.length === 0 ? (
        <Text style={styles.emptyText}>Nothing here yet</Text>
      ) : (
        <ItemList
          items={items}
          openPaths={openPaths}
          onToggleFolder={onToggleFolder}
          onPressNote={onPressNote}
          depth={0}
          styles={styles}
        />
      )}
    </View>
  );
}

export function NotesTree({ notes, styles, onPressNote, onMalformed }) {
  const { openPaths, toggleFolder } = useFolderState();

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <NotesSection
        label="Owned"
        tree={notes.owned_notes}
        openPaths={openPaths}
        onToggleFolder={toggleFolder}
        onPressNote={onPressNote}
        styles={styles}
        onMalformed={onMalformed}
      />
      <NotesSection
        label="Shared"
        tree={notes.shared_notes}
        openPaths={openPaths}
        onToggleFolder={toggleFolder}
        onPressNote={onPressNote}
        styles={styles}
        onMalformed={onMalformed}
      />
    </ScrollView>
  );
}
