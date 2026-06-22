// src/app/index.js
//
// Login page. Currently just a "Continue" button for shell purposes.
// On mount, will eventually check auth state and call
// router.replace('/notes') if the user is already authenticated.

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();

  // TODO: replace with real Google OAuth check
  const handleContinue = () => {
    router.replace('/notes');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.appName}>Noted</Text>
        <Text style={styles.tagline}>Markdown notes, backed by Google Drive.</Text>
        <Pressable style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
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
  appName: {
    fontSize: 40,
    fontWeight: '700',
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