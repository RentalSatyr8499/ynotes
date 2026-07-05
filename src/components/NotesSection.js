// src/components/NotesSection.js
//
// Labelled section (e.g. "Owned", "Shared") in the notes tree.
// Parses the top level of a tree and delegates to NotesList.

import React from 'react';
import { View, Text } from 'react-native';
import { NotesList } from './NotesList';
import { parseLevel } from '../features/fileBrowser/tree';

export function NotesSection({ label, tree, openPaths, onToggleFolder, onPressNote, styles, onMalformed }) {
  const items = parseLevel(tree, onMalformed);

  return (
    <View>
      <Text style={styles.sectionLabel}>{label}</Text>
      {items.length === 0 ? (
        <Text style={styles.emptyText}>Nothing here yet</Text>
      ) : (
        <NotesList
          items={items}
          openPaths={openPaths}
          onToggleFolder={onToggleFolder}
          onPressNote={onPressNote}
          depth={0}
          styles={styles}
          onMalformed={onMalformed}
        />
      )}
    </View>
  );
}