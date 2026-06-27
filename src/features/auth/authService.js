// src/features/auth/authService.js
//
// Handles the Google OAuth flow using expo-auth-session.
// Call loginWithGoogle() to trigger the browser prompt and get back a profile.

import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = process.env.EXPO_PUBLIC_CLIENT_ID;

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: CLIENT_ID,
  });

  return { request, response, promptAsync };
}

export async function fetchGoogleProfile(accessToken) {
  const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.json(); // { id, email, name, picture, ... }
}