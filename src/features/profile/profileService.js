// src/features/profile/profileService.js
//
// Reads the authenticated user's profile from auth state.
// No longer a stub — pulls real data from Google via AuthContext.

import { useAuth } from '../auth/authState';

export function useProfile() {
  const { user, loading } = useAuth();

  return {
    profile: user
      ? {
          name: user.name,
          email: user.email,
          avatarUri: user.picture,
        }
      : null,
    loading,
  };
}