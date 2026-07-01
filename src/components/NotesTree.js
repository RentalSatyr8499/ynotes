// src/components/NotesTree.js
//
// Notes/file tree UI. Renders owned and shared sections inside a ScrollView.

import React from 'react';
import { ScrollView } from 'react-native';
import { NotesSection } from './NotesSection';
import { useFolderState } from '../features/fileBrowser/useFolderState';

export function NotesTree({ notes, styles, onPressNote }) {
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
      />
      <NotesSection
        label="Shared"
        tree={notes.shared_notes}
        openPaths={openPaths}
        onToggleFolder={toggleFolder}
        onPressNote={onPressNote}
        styles={styles}
      />
    </ScrollView>
  );
}