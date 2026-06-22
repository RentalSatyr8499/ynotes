// src/hooks/useNotes.js
//
// Fetches the note tree from notesService and manages loading/error state.
// Decouples the notes browser UI from the service implementation — swap
// in real Google Drive auth here without touching any screen component.

import { useEffect, useState } from 'react';
import { fetchAllNotes } from '../features/notes/notesService';

export default function useNotes() {
  const [notes, setNotes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllNotes();
      setNotes(data);
    } catch (e) {
      setError(e.message ?? 'Failed to load notes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return { notes, loading, error, refresh: load };
}