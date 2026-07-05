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
  
  async function test4() {
    const title = 'ynotes_manifest';

    // 1. check the query string before encoding
    const rawQuery = `name = '${title.replace(/'/g, "\\'")}' and mimeType = 'application/vnd.google-apps.document' and trashed = false`;
    console.log('test4: raw query:', rawQuery);

    // 2. check the encoded query
    const encodedQuery = encodeURIComponent(rawQuery);
    console.log('test4: encoded query:', encodedQuery);

    // 3. check the full URL
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodedQuery}&fields=files(id,name)`;
    console.log('test4: full url:', url);

    // 4. fire the request and check the response
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log('test4: response status:', res.status);

    const body = await res.text();
    console.log('test4: response body:', body);
  }

  async function runTest() {
    if (!accessToken) { setError('No access token — are you logged in?'); return; }
    setIsSyncing(true);
    setError(null);
    setResult(null);
    try {
      await test4(); // <-- swap test
      setResult('ok');
    } catch (e) {
      setError(e.message);
    } finally {
      setIsSyncing(false);
    }
  }

  return { runTest, isSyncing, error, result };
}