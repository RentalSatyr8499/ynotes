// src/components/NotesTree.js
//
// Notes/file tree UI. Renders owned and shared sections inside a ScrollView.

import React from 'react';
import { ScrollView } from 'react-native';
import { NotesSection } from './NotesSection';
import { useFolderState } from '../features/fileBrowser/useFolderState';
import { useAddItem } from '../hooks/useAddItem';

export function NotesTree({ notes, styles, onPressNote, refresh }) {
  const { openPaths, toggleFolder } = useFolderState();
  const { create } = useAddItem({ onSuccess: refresh });

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <NotesSection
        label="Owned"
        sectionRoot="owned_notes"
        tree={notes.owned_notes}
        openPaths={openPaths}
        onToggleFolder={toggleFolder}
        onPressNote={onPressNote}
        onAddItem={create}
        styles={styles}
      />
      <NotesSection
        label="Shared"
        sectionRoot="shared_notes"
        tree={notes.shared_notes}
        openPaths={openPaths}
        onToggleFolder={toggleFolder}
        onPressNote={onPressNote}
        onAddItem={create}
        styles={styles}
      />
    </ScrollView>
  );
}