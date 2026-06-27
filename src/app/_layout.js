// src/app/_layout.js
//
// Root layout — wraps the entire app in AuthProvider so useAuth()
// is available everywhere.

import { Stack } from 'expo-router';
import { AuthProvider } from '../features/auth/authState';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}