// src/hooks/useNote.js
//
// Owns the note's text state. Reads url and name from navigation params
// (set by handlePressNote in notes/index.js), fetches the corresponding
// Google Doc as plaintext, and returns [note, setNote] — the same
// interface the editor expects.
//
// Local edits via setNote are in-memory only for now. Write-back to
// Drive will be added here when sync is implemented.

import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '../features/auth/authState';
import { readDocAsPlaintext, extractDocId } from '../features/drive/driveReadService';

export default function useNote() {
  const { url } = useLocalSearchParams();
  const { accessToken } = useAuth();

  const [note, setNote]       = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!url || !accessToken) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    const docId = extractDocId(url);

    readDocAsPlaintext(accessToken, docId)
      .then(text => { if (!cancelled) setNote(text); })
      .catch(err  => { if (!cancelled) setError(err.message); })
      .finally(()  => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [url, accessToken]);

  return [note, setNote, { loading, error }];
}