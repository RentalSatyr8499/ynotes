// src/components/notesBrowser/NotesList.js
//
// Recursive list of notes/folders for one level of the tree.
// Renders a NotesRow per item, with a CollapsibleChildren wrapper
// for open folders.

import React from 'react';
import CollapsibleChildren from './CollapsibleChildren';
import { NotesRow } from './NotesRow';
import { parseLevel, buildPath } from '../../features/fileBrowser/tree';

export function NotesList({
  items,
  openPaths,
  onToggleFolder,
  onPressNote,
  onAddItem,
  activeFolder,
  sectionRoot,
  depth = 0,
  styles,
  parentPath = '',
}) {
  const rows = [];

  for (const item of items) {
    const path         = buildPath(parentPath, item.name);
    // Full manifest path: e.g. "/owned_notes/work/archive"
    const manifestPath = `/${sectionRoot}/${path}`;
    const isOpen       = !!openPaths[path];

    rows.push(
      <NotesRow
        key={path}
        item={item}
        depth={depth}
        isOpen={isOpen}
        isActive={activeFolder === path}
        onPress={() => {
          if (item.type === 'folder') onToggleFolder(path);
          else onPressNote(item, manifestPath);
        }}
        onAddItem={(name, type) => {
          const itemPath = type === 'folder'
            ? `${manifestPath}/${name}/`
            : `${manifestPath}/${name}`;
          return onAddItem(itemPath);
        }}
        styles={styles}
      />
    );

    if (item.type === 'folder') {
      const children = parseLevel(item.subtree);
      rows.push(
        <CollapsibleChildren key={`${path}-children`} isOpen={isOpen} debugLabel={path}>
          <NotesList
            items={children}
            openPaths={openPaths}
            onToggleFolder={onToggleFolder}
            onPressNote={onPressNote}
            onAddItem={onAddItem}
            activeFolder={activeFolder}
            sectionRoot={sectionRoot}
            depth={depth + 1}
            parentPath={path}
            styles={styles}
          />
        </CollapsibleChildren>
      );
    }
  }

  return <>{rows}</>;
}