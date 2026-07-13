// src/components/LoadingSpinner.js
//
// Reusable loading indicator using the app's animated logo gif.
// Uses expo-image instead of react-native's Image so the gif animates
// correctly on all platforms including iOS.
//
// Usage:
//   <LoadingSpinner />             — default 80x80
//   <LoadingSpinner size={120} />  — custom size

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

const LOGO_GIF = require('../assets/brand/logo_icon_animation.gif');

export default function LoadingAnimation({ size = 80 }) {
  return (
    <View style={styles.container}>
      <Image
        source={LOGO_GIF}
        style={{ width: size, height: size }}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});