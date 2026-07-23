// src/features/sync/syncConfig.js
//
// Timing constants for the sync poll loop.
// Centralised here so they're easy to tune without touching hook logic.

export const POLL_INTERVAL_MS     =     5_000; // how often to sync with Drive
export const MIN_SYNC_INTERVAL_MS =     5_000; // guard against drift / rapid remounts