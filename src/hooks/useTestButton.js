// src/hooks/useTestButton.js
//
// fo testin stuff

import { useState } from 'react';
import { useAuth } from '../features/auth/authState';
import { getFileTree, findManifest } from '../features/drive/manifestService';
import { getDocLength } from '../features/drive/driveReadService';

export default function useTestButton() {
  const { accessToken } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  async function test1() {
    const fileTree = await getFileTree(accessToken);
  }

  async function test2() {
    const docId = await findManifest(accessToken);
    if (!docId) throw new Error('ynotes_manifest not found in Drive');
    const length = await getDocLength(accessToken, docId);
    console.log('manifest last character index:', length);
  }

  async function test3() {
    console.log(JSON.stringify("\{owned_notes: \{\"Work\": \{\"Q3 Planning\": \{\".\": \{\}\"OKRs\": \"https://drive.google.com/file/okrs\",\"Roadmap\": \"https://drive.google.com/file/roadmap\",\"hi\": \{\".\": \{\}\},\"shared_notes\": \{ \"Team Docs\": \{\".\": \{ \"Onboarding\": \"https://drive.google.com/file/onboarding\", \"Style Guide\": \"https://drive.google.com/file/style\" \} \}\}"));
    }

  async function runTest() {
    if (!accessToken) { setError('No access token — are you logged in?'); return; }
    setIsSyncing(true);
    setError(null);
    setResult(null);
    try {
      await test1(); // <-- swap to test1 or test2
      setResult('ok');
    } catch (e) {
      setError(e.message);
    } finally {
      setIsSyncing(false);
    }
  }

  return { runTest, isSyncing, error, result };
}