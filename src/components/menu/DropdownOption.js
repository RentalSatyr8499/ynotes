// src/components/menu/DropdownOption.js
//
// A single hoverable row inside any dropdown panel.

import React, { useState } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { menuStyles as styles } from '../../styles/menu';

export default function DropdownOption({ label, onPress }) {
  const [hovered, setHovered] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.option, hovered && styles.optionHovered]}
      onPress={onPress}
      activeOpacity={0.7}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Text style={styles.optionText}>{label}</Text>
    </TouchableOpacity>
  );
}