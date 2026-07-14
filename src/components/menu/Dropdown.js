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

import React from 'react';
import { Modal, View, Pressable, StyleSheet } from 'react-native';
import { menuStyles as styles } from '../../styles/menu';

export default function Dropdown({ visible, anchor, onClose, children, align = 'left' }) {
  if (!visible || !anchor) return null;

  // Position the panel just below the trigger.
  const top  = anchor.y + anchor.height + 4;
  const left = align === 'right'
    ? anchor.x + anchor.width   // we set `right` below instead
    : anchor.x;

  const positionStyle = align === 'right'
    ? { top, right: left }   // `right` from screen right edge
    : { top, left };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Full-screen backdrop — closes on tap outside */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

      <View style={[styles.dropdown, positionStyle]}>
        {children}
      </View>
    </Modal>
  );
}