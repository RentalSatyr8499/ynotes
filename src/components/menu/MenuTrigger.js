// src/components/menu/MenuTrigger.js
//
// A hoverable text label that measures itself and calls onOpen with its
// page-level coordinates so the parent can position a Dropdown.
//
// Props:
//   label      – string
//   active     – boolean — controls hovered appearance
//   onOpen     – (anchor: { x, y, width, height }) => void
//   onClose    – () => void
//   triggerRef – ref forwarded to the View so callers can .measure() it

import React, { useState, useRef, useCallback } from 'react';
import { View, Text } from 'react-native';
import { menuStyles as styles } from '../../styles/menu';

export default function MenuTrigger({ label, active, onOpen, onClose, triggerRef }) {
  const [hovered, setHovered] = useState(false);
  const isActive = active || hovered;

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    // Measure page-level position so Dropdown can place itself correctly
    triggerRef?.current?.measure?.((x, y, width, height, pageX, pageY) => {
      onOpen?.({ x: pageX, y: pageY, width, height });
    });
  }, [onOpen, triggerRef]);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    // Don't call onClose here — the Dropdown has its own backdrop for that.
    // Closing on mouse-leave would make the menu disappear before the user
    // can reach the options.
  }, []);

  return (
    <View
      ref={triggerRef}
      style={[styles.menuTrigger, isActive && styles.menuTriggerHovered]}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Text style={[styles.menuTriggerText, isActive && styles.menuTriggerTextHovered]}>
        {label}
      </Text>
    </View>
  );
}