// src/hooks/useRequireAuth.js

import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../features/auth/authState';

export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/');  // adjust to whatever your login route is
    }
  }, [user, loading]);

  return { user, loading };
}