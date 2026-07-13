// src/app/index.js
//
// Login screen. Triggers Google OAuth on button press and redirects
// to /notes once the user is set in auth state.

import React, { useEffect } from 'react';
import { View, Text, Pressable, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../features/auth/authState';
import { APP_NAME } from '../styles/tokens';

const LOGO = require('../assets/brand/logo_icon.png');

export default function LoginScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const { user, loading, login, request } = useAuth();

  useEffect(() => {
    if (user) router.replace('/notes');
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={LOGO} style={[styles.logo, { height: height * 0.20, width: height * 0.20 }]} />
        <Text style={styles.appName}>{APP_NAME}</Text>
        <Text style={styles.tagline}>the worst note taking app.....ever...</Text>
        <Pressable
          style={[styles.button, (!request || loading) && styles.buttonDisabled]}
          onPress={login}
          disabled={!request || loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Signing in...' : 'Login with Google'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    resizeMode: 'contain',
    marginBottom: 8,
  },
  appName: {
    fontSize: 40,
    fontWeight: '200',
    color: '#111',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 15,
    color: '#888',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#f5f0eb',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});