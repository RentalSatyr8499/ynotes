// src/components/NotesRow.js
//
// Single row in the notes tree. Renders a folder or note with icon,
// label, and an optional chevron for folders.

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Image, TextInput } from 'react-native';
import Animated from 'react-native-reanimated';
import { useFadeIn } from '../hooks/useFadeIn';
import { useSlideIn } from '../hooks/useSlideIn';

const FOLDER_ICON = require('../assets/icons/folder.png');
const FILE_ICON   = require('../assets/icons/file.png');
const PLUS_ICON   = require('../assets/icons/plus.png');
const CLOSE_ICON  = require('../assets/icons/close.png');
const NEXT_ICON   = require('../assets/icons/next.png');

export function NotesRow({ item, depth, isOpen, isActive, onPress, onAddItem, styles }) {
  const [hovered, setHovered]                         = useState(false);
  const [creating, setCreating]                       = useState(null); // 'folder' | 'file' | null
  const [inputValue, setInputValue]                   = useState('');
  const [submitting, setSubmitting]                   = useState(false);

  const [folderActionHovered, setFolderActionHovered] = useState(false);
  const [fileActionHovered, setFileActionHovered]     = useState(false);
  const [plusHovered, setPlusHovered]                 = useState(false);
  const [closeHovered, setCloseHovered]               = useState(false);
  const [nextHovered, setNextHovered]                 = useState(false);

  const actionsFade = useFadeIn();
  const inputSlide  = useSlideIn({ direction: 'right' });

  const prevIsActive = useRef(false);
  useEffect(() => {
    if (isActive && !prevIsActive.current) actionsFade.trigger();
    prevIsActive.current = isActive;
  }, [isActive]);

  const icon             = item.type === 'folder' ? FOLDER_ICON : FILE_ICON;
  const indent           = depth * styles.indentSize;
  const anyActionHovered = folderActionHovered || fileActionHovered || plusHovered;

  function startCreating(type, e) {
    e.stopPropagation();
    setCreating(type);
    setInputValue('');
    inputSlide.trigger();
  }

  function cancelCreating(e) {
    e.stopPropagation();
    setCreating(null);
    setInputValue('');
    actionsFade.trigger();
  }

  async function handleCreate(e) {
    e.stopPropagation();
    const name = inputValue.trim();
    if (!name || submitting) return;
    setSubmitting(true);
    try {
      await onAddItem(name, creating);
      setCreating(null);
      setInputValue('');
      actionsFade.trigger();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Pressable
      style={[styles.row, { paddingLeft: indent }]}
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPressIn={() => setHovered(true)}
      onPressOut={() => setHovered(false)}
    >
      <View style={styles.rowLeft}>
        <Image
          source={icon}
          style={[styles.rowIcon, isActive && styles.rowIconActive]}
        />
        <Text style={styles.rowTitle}>{item.name}</Text>
      </View>

      <View style={styles.rowRight}>
        {item.type === 'folder' && isActive && (
          creating ? (
            <Animated.View style={[styles.rowCreateInline, inputSlide.animatedStyle]}>
              <TextInput
                style={styles.rowCreateInput}
                value={inputValue}
                onChangeText={setInputValue}
                placeholder={creating === 'folder' ? 'New folder name' : 'New file name'}
                placeholderTextColor="#bbb"
                autoFocus
                editable={!submitting}
                onSubmitEditing={handleCreate}
                onPress={(e) => e.stopPropagation()}
              />
              <Pressable
                onHoverIn={() => setCloseHovered(true)}
                onHoverOut={() => setCloseHovered(false)}
                onPress={cancelCreating}
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
                onPress={handleCreate}
                disabled={submitting}
                style={styles.rowActionIconWrap}
              >
                <Image
                  source={NEXT_ICON}
                  style={[styles.rowActionIcon, nextHovered && styles.rowActionIconActive]}
                />
              </Pressable>
            </Animated.View>
          ) : (
            <Animated.View style={[styles.rowActions, actionsFade.animatedStyle]}>
              <Pressable
                onHoverIn={() => { setPlusHovered(true); setFolderActionHovered(true); }}
                onHoverOut={() => { setPlusHovered(false); setFolderActionHovered(false); }}
                onPress={(e) => startCreating('folder', e)}
                style={styles.rowActionIconWrap}
              >
                <Image
                  source={PLUS_ICON}
                  style={[styles.rowActionIcon, anyActionHovered && styles.rowActionIconActive]}
                />
              </Pressable>

              <Pressable
                onHoverIn={() => setFolderActionHovered(true)}
                onHoverOut={() => setFolderActionHovered(false)}
                onPress={(e) => startCreating('folder', e)}
              >
                <Text style={[styles.rowActionText, folderActionHovered && styles.rowActionTextActive]}>
                  New folder
                </Text>
              </Pressable>

              <Text style={styles.rowActionDivider}>|</Text>

              <Pressable
                onHoverIn={() => setFileActionHovered(true)}
                onHoverOut={() => setFileActionHovered(false)}
                onPress={(e) => startCreating('file', e)}
              >
                <Text style={[styles.rowActionText, fileActionHovered && styles.rowActionTextActive]}>
                  New file
                </Text>
              </Pressable>
            </Animated.View>
          )
        )}

        {item.type === 'folder' && (
          <Text style={[styles.rowChevron, isOpen && styles.rowChevronOpen]}>›</Text>
        )}
      </View>
    </Pressable>
  );
}