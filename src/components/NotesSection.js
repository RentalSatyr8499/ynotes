// src/components/NotesSection.js
//
// Labelled section (e.g. "Owned", "Shared") in the notes tree.
// Parses the top level of a tree and delegates to NotesList.

import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { NotesList } from './NotesList';
import { parseLevel } from '../features/fileBrowser/tree';

export function NotesSection({ label, sectionRoot, tree, openPaths, onToggleFolder, onPressNote, onAddItem, styles }) {
  const items = parseLevel(tree);
  const [activeFolder, setActiveFolder] = useState(null);

  function handleToggleFolder(path) {
    setActiveFolder(path);
    onToggleFolder(path);
  }

  return (
    <View>
      <Text style={styles.sectionLabel}>{label}</Text>
      {items.length === 0 ? (
        <Text style={styles.emptyText}>Nothing here yet</Text>
      ) : (
        <NotesList
          items={items}
          openPaths={openPaths}
          onToggleFolder={handleToggleFolder}
          onPressNote={onPressNote}
          onAddItem={onAddItem}
          activeFolder={activeFolder}
          sectionRoot={sectionRoot}
          depth={0}
          styles={styles}
        />
      )}
    </View>
  );
}