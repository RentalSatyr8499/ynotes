// src/hooks/useNotes.js

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
      setNotes({
    "owned_notes": {
        "Work": {
            "Q3 Planning": {
                ".": {"OKRs": "https://drive.google.com/file/okrs",
                "Roadmap": "https://drive.google.com/file/roadmap"},
                "hi": {
                    ".": {}
                }
            }
        }
    },
    "shared_notes": {
        "Team Docs": {
            ".": {
                "Onboarding": "https://drive.google.com/file/onboarding",
                "Style Guide": "https://drive.google.com/file/style"
            }
        }
    }
}
);
    } catch (e) {
      setError(e.message ?? 'Failed to load notes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [accessToken]);

  return { notes, loading, error, malformed, setMalformed, refresh: load };
}