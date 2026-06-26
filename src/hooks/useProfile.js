// src/hooks/useProfile.js

import { useEffect, useState } from 'react';
import { fetchProfile } from '../features/profile/profileService';

export default function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile()
      .then(setProfile)
      .catch((e) => setError(e.message ?? 'Failed to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  return { profile, loading, error };
}