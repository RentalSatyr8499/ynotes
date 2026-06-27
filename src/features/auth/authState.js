// src/features/auth/authState.js
//
// Auth context — wraps the app and exposes useAuth() to any component.
// Stores the current user profile and handles the Google OAuth response.

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useGoogleAuth, fetchGoogleProfile } from './authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { request, response, promptAsync } = useGoogleAuth();

  useEffect(() => {
    if (response?.type === 'success') {
      const accessToken = response.authentication.accessToken;
      setLoading(true);
      fetchGoogleProfile(accessToken)
        .then(setUser)
        .finally(() => setLoading(false));
    }
  }, [response]);

  const login = () => promptAsync();
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, request }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}