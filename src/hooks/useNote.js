// src/hooks/useNote.js
//
// Owns the note's text state. Fetches from Drive on mount and delegates
// ongoing sync to useSyncStatus, which polls on an interval and runs the
// three-way merge.
//
// Returns [note, setNote, { loading, error, title, syncStatus }]
// — the same destructuring shape editor.js already expects.

import { useState, useEffect, useCallback } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '../features/auth/authState';
import { readDocAsPlaintext } from '../features/drive/driveReadService';
import { useSyncStatus } from '../features/sync/useSyncStatus';

export default function useNote() {
  const { url: docId, name } = useLocalSearchParams();
  const { accessToken }      = useAuth();

  const [note, setNote]       = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // Initial fetch — populates the editor before the first poll tick.
  useEffect(() => {
    if (!docId || !accessToken) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    readDocAsPlaintext(accessToken, docId)
      .then(text  => { if (!cancelled) setNote(text); })
      .catch(err  => { if (!cancelled) setError(err.message); })
      .finally(()  => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [docId, accessToken]);

  // Called by useSyncStatus when the merged result differs from local state.
  const handleRemoteChange = useCallback((mergedText) => {
    setNote(mergedText);
  }, []);

  const syncStatus = useSyncStatus({
    docId,
    accessToken,
    localText:      note,
    onRemoteChange: handleRemoteChange,
  });

  return [note, setNote, { loading, error, title: name, syncStatus }];
}