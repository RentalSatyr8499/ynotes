// src/app/notes/index.js

import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, ActivityIndicator, Image,
} from 'react-native';
import useNotes from '../../hooks/useNotes';
import { useNotesBrowserStyles } from '../../styles/notesBrowser';

const FOLDER_ICON = require('../../assets/icons/folder.png');
const FILE_ICON   = require('../../assets/icons/file.png');

// Converts one level of a tree into a flat list of items.
// { type: 'folder', name, subtree } | { type: 'note', name, url }
function parseLevel(tree) {
  if (!tree) return [];
  const folders = Object.entries(tree)
    .filter(([k]) => k !== '.')
    .map(([name, subtree]) => ({ type: 'folder', name, subtree }));
  const notes = Object.entries(tree['.'] ?? {})
    .map(([name, url]) => ({ type: 'note', name, url }));
  return [...folders, ...notes];
}

// Recursively renders a list of items, inserting children inline
// when a folder is open. `depth` controls the indent level.
function ItemList({ items, openPaths, onToggleFolder, onPressNote, depth = 0, styles }) {
  const rows = [];

  for (const item of items) {
    const path = `${depth}:${item.name}`;
    const isOpen = openPaths.has(path);

    rows.push(
      <Row
        key={path}
        item={item}
        depth={depth}
        isOpen={isOpen}
        onPress={() => {
          if (item.type === 'folder') onToggleFolder(path);
          else onPressNote(item);
        }}
        styles={styles}
      />
    );

    if (item.type === 'folder' && isOpen) {
      const children = parseLevel(item.subtree);
      rows.push(
        <ItemList
          key={`${path}-children`}
          items={children}
          openPaths={openPaths}
          onToggleFolder={onToggleFolder}
          onPressNote={onPressNote}
          depth={depth + 1}
          styles={styles}
        />
      );
    }
  }

  return <>{rows}</>;
}

function Row({ item, depth, isOpen, onPress, styles }) {
  const icon = item.type === 'folder' ? FOLDER_ICON : FILE_ICON;
  const indent = depth * styles.indentSize;

  return (
    <Pressable style={[styles.row, { paddingLeft: indent }]} onPress={onPress}>
      <View style={styles.rowLeft}>
        <Image source={icon} style={styles.rowIcon} />
        <Text style={styles.rowTitle}>{item.name}</Text>
      </View>
      {item.type === 'folder' && (
        <Text style={[styles.rowChevron, isOpen && styles.rowChevronOpen]}>›</Text>
      )}
    </Pressable>
  );
}

function Section({ label, tree, openPaths, onToggleFolder, onPressNote, styles }) {
  const items = parseLevel(tree);
  return (
    <View>
      <Text style={styles.sectionLabel}>{label}</Text>
      {items.length === 0
        ? <Text style={styles.emptyText}>Nothing here yet</Text>
        : <ItemList
            items={items}
            openPaths={openPaths}
            onToggleFolder={onToggleFolder}
            onPressNote={onPressNote}
            depth={0}
            styles={styles}
          />
      }
    </View>
  );
}

export default function NotesBrowser() {
  const { notes, loading, error, refresh } = useNotes();
  const styles = useNotesBrowserStyles();
  const [openPaths, setOpenPaths] = useState(new Set());

  const handleToggleFolder = (path) => {
    setOpenPaths((prev) => {
      const next = new Set(prev);
      next.has(path) ? next.delete(path) : next.add(path);
      return next;
    });
  };

  const handlePressNote = (item) => {
    // TODO: router.push(`/editor/${encodeURIComponent(item.url)}`);
    console.log('Open note:', item);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Your Notes</Text>
        <Pressable style={styles.refreshButton} onPress={refresh}>
          <Text style={styles.refreshText}>Refresh</Text>
        </Pressable>
      </View>

      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#bbb" />
        </View>
      )}

      {error && (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.refreshButton} onPress={refresh}>
            <Text style={styles.refreshText}>Try again</Text>
          </Pressable>
        </View>
      )}

      {notes && !loading && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Section
            label="Owned"
            tree={notes.owned_notes}
            openPaths={openPaths}
            onToggleFolder={handleToggleFolder}
            onPressNote={handlePressNote}
            styles={styles}
          />
          <Section
            label="Shared"
            tree={notes.shared_notes}
            openPaths={openPaths}
            onToggleFolder={handleToggleFolder}
            onPressNote={handlePressNote}
            styles={styles}
          />
        </ScrollView>
      )}
    </View>
  );
}