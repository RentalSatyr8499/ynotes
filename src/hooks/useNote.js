// src/hooks/useNote.js
//
// Owns the note's text state. Reads docId and name from navigation params
// (set by handlePressNote in notes/index.js), fetches the corresponding
// Google Doc as plaintext, and returns [note, setNote, { loading, error }].
//
// Local edits via setNote are in-memory only for now. Write-back to
// Drive will be added here when sync is implemented.

import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '../features/auth/authState';
import { readDocAsPlaintext } from '../features/drive/driveReadService';

export default function useNote() {
  const { url: docId } = useLocalSearchParams();
  const { accessToken } = useAuth();

  const [note, setNote]       = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!docId || !accessToken) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    readDocAsPlaintext(accessToken, docId)
      .then(text => { if (!cancelled) setNote(text); })
      .catch(err  => { if (!cancelled) setError(err.message); })
      .finally(()  => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [docId, accessToken]);

  return [note, setNote, { loading, error }];
}