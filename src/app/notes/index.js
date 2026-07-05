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
import useTestButton from '../../hooks/useTestButton';
import { useRequireAuth } from '../../hooks/useRequireAuth'; 
import { ErrorBoundary } from '../../components/ErrorBoundary';

export default function NotesBrowser() {
  const { user, loading: authLoading } = useRequireAuth(); 

const { notes, loading, error, malformed, setMalformed, refresh } = useNotes();

  const { runTest, isSyncing: inProgress, error: testError, result } = useTestButton();
  const styles = useNotesBrowserStyles();

  if (authLoading || !user) return null; 

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

          {/* --- Test button --- */}
          <Pressable
            style={[styles.refreshButton, inProgress && { opacity: 0.5 }]}
            onPress={runTest}
            disabled={inProgress}
          >
            <Text style={styles.refreshText}>
              {inProgress ? 'In progress...' : 'Test button'}
            </Text>
          </Pressable>
          {testError && <Text style={styles.errorText}>{testError}</Text>}
          {result && <Text style={styles.refreshText}>✓ Created: {result.name}</Text>}
          {/* --- Test button --- */}
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

      
        {malformed && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
            <Text style={{ color: 'red', fontSize: 12 }}>Your manifest is malformed.</Text>
          </View>
        )}

        {notes && !loading && (
        <ErrorBoundary onReset={refresh}>
          <NotesTree
            notes={notes}
            styles={styles}
            onPressNote={handlePressNote}
            onRefresh={refresh}
            onMalformed={() => {
              setMalformed(true); // manifest is malformed
            }}
          />
        </ErrorBoundary>
        )}
      </View>
    </View>
  );
}