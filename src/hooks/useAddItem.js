// src/hooks/useAddItem.js
//
// Wraps addItem with auth and a success callback.

import { useCallback, useState } from 'react';
import { useAuth } from '../features/auth/authState';
import { addItem } from '../features/fileBrowser/addItem';

export function useAddItem({ onSuccess } = {}) {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const create = useCallback(async (itemPath) => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const docId = await addItem(accessToken, itemPath);
      onSuccess?.();
      return docId;
    } catch (e) {
      setError(e.message ?? 'Failed to create item.');
    } finally {
      setLoading(false);
    }
  }, [accessToken, onSuccess]);

  return { create, loading, error };
}