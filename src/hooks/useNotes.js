// src/hooks/useNotes.js
//
// Fetches the note tree from notesService and manages loading/error state.
// Decouples the notes browser UI from the service implementation — swap
// in real Google Drive auth here without touching any screen component.

import { useEffect, useState } from 'react';
import { fetchAllNotes } from '../features/notes/notesService';
import { useAuth } from '../features/auth/authState';

export default function useNotes() {
  const { accessToken } = useAuth();
  const [notes, setNotes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [malformed, setMalformed] = useState(false);

  const load = async () => {
    if (!accessToken) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    setMalformed(false);
    try {
      const data = await fetchAllNotes(accessToken);
      console.log(data);
      setNotes(data.data ?? data);;
    } catch (e) {
      setError(e.message ?? 'Failed to load notes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [accessToken]);

  return { notes, loading, error, malformed, setMalformed, refresh: load };
}