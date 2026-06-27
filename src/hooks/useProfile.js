// src/hooks/useProfile.js

import { useProfile as useProfileData } from '../features/profile/profileService';

export default function useProfile() {
  const { profile, loading } = useProfileData();

  return {
    profile,
    loading,
    error: !profile && !loading ? 'Failed to load profile.' : null,
  };
}