// src/components/notesBrowser/NotesRowCreate.js
//
// Inline input row for naming a new folder or file. Slides in from the
// right when activated. Receives all state and handlers from
// useNotesRowCreate via the parent.

import React, { useState } from 'react';
import { Pressable, Image, TextInput } from 'react-native';
import Animated from 'react-native-reanimated';

const CLOSE_ICON = require('../../assets/icons/close.png');
const NEXT_ICON  = require('../../assets/icons/next.png');

export function NotesRowCreate({
  creating,
  inputValue,
  setInputValue,
  submitting,
  animatedStyle,
  onCancel,
  onCreate,
  styles,
}) {
  const [closeHovered, setCloseHovered] = useState(false);
  const [nextHovered, setNextHovered]   = useState(false);

  return (
    <Animated.View style={[styles.rowCreateInline, animatedStyle]}>
      <TextInput
        style={styles.rowCreateInput}
        value={inputValue}
        onChangeText={setInputValue}
        placeholder={creating === 'folder' ? 'New folder name' : 'New file name'}
        placeholderTextColor="#bbb"
        autoFocus
        editable={!submitting}
        onSubmitEditing={onCreate}
        onPress={(e) => e.stopPropagation()}
      />
      <Pressable
        onHoverIn={() => setCloseHovered(true)}
        onHoverOut={() => setCloseHovered(false)}
        onPress={onCancel}
        disabled={submitting}
        style={styles.rowActionIconWrap}
      >
        <Image
          source={CLOSE_ICON}
          style={[styles.rowActionIcon, closeHovered && styles.rowActionIconActive]}
        />
      </Pressable>
      <Pressable
        onHoverIn={() => setNextHovered(true)}
        onHoverOut={() => setNextHovered(false)}
        onPress={onCreate}
        disabled={submitting}
        style={styles.rowActionIconWrap}
      >
        <Image
          source={NEXT_ICON}
          style={[styles.rowActionIcon, nextHovered && styles.rowActionIconActive]}
        />
      </Pressable>
    </Animated.View>
  );
}