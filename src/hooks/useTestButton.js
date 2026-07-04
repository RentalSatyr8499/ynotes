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
    console.log('file tree:', JSON.stringify(fileTree, null, 2));
  }

  async function test2() {
    const docId = await findManifest(accessToken);
    if (!docId) throw new Error('ynotes_manifest not found in Drive');
    const length = await getDocLength(accessToken, docId);
    console.log('manifest last character index:', length);
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