// src/components/menu/Dropdown.js
//
// A floating dropdown panel rendered inside a transparent Modal so it
// always appears above every other view, regardless of parent stacking
// contexts or overflow:hidden on panes.
//
// Props:
//   visible   – boolean
//   anchor    – { x, y, width, height } — page-level coords of the trigger,
//               obtained by calling triggerRef.current.measure(...)
//   onClose   – () => void
//   children  – DropdownOption rows (or any content)
//   align     – 'left' | 'right'  (default 'left')
//               'left'  → dropdown left edge aligns with anchor left edge
//               'right' → dropdown right edge aligns with anchor right edge

import React, { useEffect, useRef } from 'react';
import { Modal, View, Pressable, StyleSheet, Animated, Platform } from 'react-native';
import { menuStyles as styles } from '../../styles/menu';

const USE_NATIVE_DRIVER = Platform.OS !== 'web';

// Tweak these to change the feel of all dropdown menus app-wide.
const FADE_IN_MS  = 50;
const FADE_OUT_MS = 50;

export default function Dropdown({ visible, anchor, onClose, children, align = 'left' }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: visible ? FADE_IN_MS : FADE_OUT_MS,
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();
  }, [visible, opacity]);

  if (!visible || !anchor) return null;


  // Position the panel just below the trigger.
  const top = anchor.y + anchor.height + 4;

  // `right` in CSS/RN means distance from the screen's right edge, not an
  // x coordinate. Convert: screenWidth - buttonRightEdge = distance from right.
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 400;
  const positionStyle = align === 'right'
    ? { top, right: screenWidth - anchor.x - anchor.width }
    : { top, left: anchor.x };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Full-screen backdrop — closes on tap outside */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

      <Animated.View style={[styles.dropdown, positionStyle, { opacity }]}>
        {children}
      </Animated.View>
    </Modal>
  );
}