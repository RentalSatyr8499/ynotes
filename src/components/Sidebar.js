// src/components/Sidebar.js

import React from 'react';
import { View, Text, Image, StyleSheet, useWindowDimensions } from 'react-native';
import useProfile from '../hooks/useProfile';
import { colors } from '../styles/tokens';

export default function Sidebar() {
  const { height } = useWindowDimensions();
  const { profile } = useProfile();
  const avatarSize = height * 0.18;

  return (
    <View style={styles.container}>
      {profile && (
        <>
          <Image
            source={{ uri: profile.avatarUri }}
            style={[
              styles.avatar,
              { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 },
            ]}
          />
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.email}>{profile.email}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 220,
    backgroundColor: colors.editorBg,
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 20,
    gap: 10,
  },
  avatar: {
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  email: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
  },
});