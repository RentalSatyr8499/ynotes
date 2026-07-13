// src/app/notes/index.js
//
// Notes browser screen. Fetches notes, handles loading/error,
// and renders the NotesTree component.

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import LoadingAnimation from '../../components/LoadingAnimation';
import useNotes from '../../hooks/useNotes';
import { useNotesBrowserStyles } from '../../styles/notesBrowser';
import Sidebar from '../../components/Sidebar';
import { NotesTree } from '../../components/notesBrowser/NotesTree';
import useTestButton from '../../hooks/useTestButton';
import { useRequireAuth } from '../../hooks/useRequireAuth';

export default function NotesBrowser() {
  const { user, loading: authLoading } = useRequireAuth();
  const { notes, loading, error, refresh } = useNotes();
  const { runTest, isSyncing: inProgress, error: testError, result } = useTestButton();
  const styles = useNotesBrowserStyles();
  const router = useRouter();

  if (authLoading || !user) return null;

  // item: { name, type, url }
  // manifestPath: full path in the manifest JSON, e.g. "/owned_notes/work/my-note"
  const handlePressNote = (item, manifestPath) => {
    router.push({
      pathname: '/editor',
      params: {
        url:          item.url,
        name:         item.name,
        manifestPath,
      },
    });
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
            <LoadingAnimation />
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