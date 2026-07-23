// src/features/sync/useSyncStatus.js
//
// Owns the poll loop and all sync state for an open note.
// Fetches remote on an interval, runs the three-way merge, writes back
// the merged result, and notifies the caller when remote changes should
// update local state.
//
// Co-located in features/sync/ rather than src/hooks/ because it is
// tightly coupled to syncService and driveWriteService — not a general
// purpose hook.

import { useState, useEffect, useRef, useCallback } from 'react';
import { readDocAsPlaintext } from '../drive/driveReadService';
import { overwriteDoc }       from '../drive/driveWriteService';
import { splitLines, linesToText, mergeLines } from './syncService';
import { POLL_INTERVAL_MS } from './syncConfig';

// state values exposed to the UI
export const SYNC_STATE = {
  IDLE:    'idle',
  SYNCING: 'syncing',
  ERROR:   'error',
};

// useSyncStatus
//
// docId        — Google Doc ID to sync against
// accessToken  — current OAuth token
// localText    — the editor's current plaintext (read on each poll tick
//                via ref so the interval closure is always current)
// onRemoteChange(mergedText) — called when the merged result differs from
//                              localText; lets useNote update its state
//
// Returns { state, error, lastSyncedAt }
export function useSyncStatus({ docId, accessToken, localText, onRemoteChange }) {
  const [state, setState]           = useState(SYNC_STATE.IDLE);
  const [error, setError]           = useState(null);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);

  // base — last confirmed common ancestor as a line array.
  // Stored in a ref (not state) because mutating it must not trigger
  // re-renders, and it is only read inside the async poll tick.
  const baseRef = useRef(null);

  // Keep a ref to localText so the interval closure always reads the
  // latest value without needing to be re-registered on every keystroke.
  const localTextRef = useRef(localText);
  useEffect(() => { localTextRef.current = localText; }, [localText]);

  // Keep a ref to onRemoteChange for the same reason.
  const onRemoteChangeRef = useRef(onRemoteChange);
  useEffect(() => { onRemoteChangeRef.current = onRemoteChange; }, [onRemoteChange]);

  const runSync = useCallback(async () => {
    console.log("running sync routine...");
    if (!docId || !accessToken) {
        console.log("docID ot accessToken missing");
        return
    };

    setState(SYNC_STATE.SYNCING);
    setError(null);

    try {
      const remoteText  = await readDocAsPlaintext(accessToken, docId);
      const remoteLines = splitLines(remoteText);
      const localLines  = splitLines(localTextRef.current);

      // First sync — no base yet. Accept remote as the starting point.
      // (useNote already set local state from this same fetch on mount,
      // so we don't need to call onRemoteChange here.)
      if (baseRef.current === null) {
        baseRef.current = remoteLines;
        setState(SYNC_STATE.IDLE);
        setLastSyncedAt(new Date());
        return;
      }

      const mergedLines = mergeLines(baseRef.current, localLines, remoteLines);
      const mergedText  = linesToText(mergedLines);
      const baseText    = linesToText(baseRef.current);

      // Nothing changed on either side — skip the write.
      if (mergedText === baseText) {
        setState(SYNC_STATE.IDLE);
        setLastSyncedAt(new Date());
        console.log("no changes, didn't write to remote");
        return;
      }

      console.log("detected changes, attempting to write to remote...");
      // Write the merged result back to Drive.
      await overwriteDoc(accessToken, docId, mergedText);
      console.log("wrote to remote");

      // Only advance base after a confirmed successful write.
      baseRef.current = mergedLines;
      setLastSyncedAt(new Date());

      // If the merge changed anything relative to local, update the editor.
      if (mergedText !== localTextRef.current) {
        onRemoteChangeRef.current(mergedText);
      }

      setState(SYNC_STATE.IDLE);
    } catch (err) {
      // Do NOT update base — next poll retries from the last good state.
      setError(err.message);
      setState(SYNC_STATE.ERROR);
    }
  }, [docId, accessToken]);

  useEffect(() => {
    if (!docId || !accessToken) return;

    // Run immediately on mount, then on the interval.
    runSync();
    const id = setInterval(runSync, POLL_INTERVAL_MS);
    return () => {
      clearInterval(id);
      // Reset base when the note changes so the next mount starts fresh.
      baseRef.current = null;
    };
  }, [docId, accessToken, runSync]);

  return { state, error, lastSyncedAt };
}