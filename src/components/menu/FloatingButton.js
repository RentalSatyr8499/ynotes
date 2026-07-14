// src/components/menu/FloatingButton.js
//
// An icon button anchored to the top-right of its parent pane.
// Measures itself so it can pass anchor coords to Dropdown.
//
// Props:
//   icon      – require()'d image source
//   tintColor – icon tint (default: colors.textBody)
//   active    – boolean — controls buttonActive style
//   onPress   – () => void
//   triggerRef – ref to pass to the touchable so callers can .measure() it

import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { menuStyles as styles } from '../../styles/menu';
import { colors } from '../../styles/tokens';

export default function FloatingButton({ icon, tintColor, active, onPress, triggerRef }) {
  return (
    <View style={styles.floatingContainer}>
      <TouchableOpacity
        ref={triggerRef}
        style={[styles.floatingButton, active && styles.floatingButtonActive]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Image
          source={icon}
          style={styles.floatingButtonIcon}
          tintColor={tintColor ?? colors.textBody}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}