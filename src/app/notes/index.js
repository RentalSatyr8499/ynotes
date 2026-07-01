// src/app/notes/index.js
//
// Notes browser screen. Fetches notes, handles loading/error,
// and renders the NotesTree component.

import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import useNotes from '../../hooks/useNotes';
import { useNotesBrowserStyles } from '../../styles/notesBrowser';
import Sidebar from '../../components/Sidebar';
import { NotesTree } from '../../components/NotesTree';
import useDriveSync from '../../hooks/useDriveSync'; // <-- add

export default function NotesBrowser() {
  const { notes, loading, error, refresh } = useNotes();
  const { writeHelloWorld, isSyncing, error: syncError, result } = useDriveSync(); // <-- add
  const styles = useNotesBrowserStyles();

  const handlePressNote = (item) => {
    console.log('Open note:', item);
  };

  return (
    <View style={styles.screen}>
      <Sidebar />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.heading}>Your Notes</Text>
          <Pressable style={styles.refreshButton} onPress={refresh}>
            <Text style={styles.refreshText}>Refresh</Text>
          </Pressable>

          {/* --- Drive hello world test --- */}
          <Pressable
            style={[styles.refreshButton, isSyncing && { opacity: 0.5 }]}
            onPress={writeHelloWorld}
            disabled={isSyncing}
          >
            <Text style={styles.refreshText}>
              {isSyncing ? 'Writing...' : 'Test Drive Write'}
            </Text>
          </Pressable>
          {syncError && <Text style={styles.errorText}>{syncError}</Text>}
          {result && <Text style={styles.refreshText}>✓ Created: {result.name}</Text>}
          {/* --- end test --- */}
        </View>

        {loading && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#bbb" />
          </View>
        )}

        {error && (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.refreshButton} onPress={refresh}>
              <Text style={styles.refreshText}>Try again</Text>
            </Pressable>
          </View>
        )}

        {notes && !loading && (
          <NotesTree
            notes={notes}
            styles={styles}
            onPressNote={handlePressNote}
            onRefresh={refresh}
          />
        )}
      </View>
    </View>
  );
}