// src/hooks/useDriveSync.js
//
// Hook for writing to Google Drive. Exposes a single `writeHelloWorld`
// function plus loading/error/result state.
// Swap this out later for real note-saving logic.

import { useState } from 'react';
import { useAuth } from '../features/auth/authState';
import { createDoc, appendToDoc } from '../features/drive/driveService';

export default function useDriveSync() {
  const { accessToken } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null); // the created doc resource

  async function writeHelloWorld() {
    if (!accessToken) { setError('No access token — are you logged in?'); return; }
    setIsSyncing(true);
    setError(null);
    setResult(null);
    try {
      const doc = await createDoc(accessToken, 'Hello World Test');
      await appendToDoc(accessToken, doc.id, 'Hello, world!');
      setResult(doc);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsSyncing(false);
    }
  }

  return { writeHelloWorld, isSyncing, error, result };
}