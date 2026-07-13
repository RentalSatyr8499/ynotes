// src/components/notesBrowser/NotesRow.js
//
// Single row in the notes tree. Renders a folder or note with icon,
// label, and an optional chevron for folders.
//
// Folder rows delegate creation UI to NotesRowActions / NotesRowCreate,
// coordinated by useNotesRowCreate.
//
// TODO: add useFileRowPress (or similar) here for file-tap behaviour.

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useFadeIn } from '../../hooks/useFadeIn';
import { useNotesRowCreate } from './useNotesRowCreate';
import { NotesRowActions } from './NotesRowActions';
import { NotesRowCreate } from './NotesRowCreate';

const FOLDER_ICON = require('../../assets/icons/folder.png');
const FILE_ICON   = require('../../assets/icons/file.png');

export function NotesRow({ item, depth, isOpen, isActive, onPress, onAddItem, styles }) {
  const [hovered, setHovered] = useState(false);

  const actionsFade = useFadeIn();

  const prevIsActive = useRef(false);
  useEffect(() => {
    if (isActive && !prevIsActive.current) actionsFade.trigger();
    prevIsActive.current = isActive;
  }, [isActive]);

  const {
    creating,
    inputValue,
    setInputValue,
    submitting,
    inputSlide,
    startCreating,
    cancelCreating,
    handleCreate,
  } = useNotesRowCreate({ onAddItem, onDone: actionsFade.trigger });

  const icon   = item.type === 'folder' ? FOLDER_ICON : FILE_ICON;
  const indent = depth * styles.indentSize;

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
            <NotesRowCreate
              creating={creating}
              inputValue={inputValue}
              setInputValue={setInputValue}
              submitting={submitting}
              animatedStyle={inputSlide.animatedStyle}
              onCancel={cancelCreating}
              onCreate={handleCreate}
              styles={styles}
            />
          ) : (
            <NotesRowActions
              onStartCreating={startCreating}
              animatedStyle={actionsFade.animatedStyle}
              styles={styles}
            />
          )
        )}

        {item.type === 'folder' && (
          <Text style={[styles.rowChevron, isOpen && styles.rowChevronOpen]}>›</Text>
        )}
      </View>
    </Pressable>
  );
}