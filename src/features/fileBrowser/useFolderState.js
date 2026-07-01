// src/features/fileBrowser/useFolderState.js
//
// Manages the set of open folder paths in the notes tree.
// Uses a plain object instead of a Set so React can reliably
// detect changes and avoid spurious re-renders.

import { useState, useCallback } from 'react';

export function useFolderState() {
  const [openPaths, setOpenPaths] = useState({});

  const toggleFolder = useCallback((path) => {
    setOpenPaths((prev) => {
      if (prev[path]) {
        const { [path]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [path]: true };
    });
  }, []);

  const isOpen = useCallback((path) => !!openPaths[path], [openPaths]);

  return { openPaths, toggleFolder, isOpen };
}