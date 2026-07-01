// src/features/profile/profileService.js
//
// Reads the authenticated user's profile from auth state.
// Now includes detailed logging to help debug avatarUri / picture issues.

import { useAuth } from '../auth/authState';
import { useEffect } from 'react';

export function useProfile() {
  const { user, loading } = useAuth();


  const profile = user
    ? {
        name: user.name,
        email: user.email,
        avatarUri: user.picture,
      }
    : null;
  return { profile, loading };
}
