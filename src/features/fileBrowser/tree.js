// src/features/fileBrowser/tree.js
//
// Data helpers for file/notes tree structures.
// Converts a nested tree into flat items for a single level.

export function buildPath(parentPath, name) {
    return parentPath ? `${parentPath}/${name}` : name;
}

export function parseLevel(tree) {
  if (!tree) return [];

  const folders = Object.entries(tree)
    .filter(([key]) => key !== '.')
    .map(([name, subtree]) => ({
      type: 'folder',
      name,
      subtree,
    }));

  const notes = Object.entries(tree['.'] ?? {})
    .map(([name, url]) => ({
      type: 'note',
      name,
      url,
    }));

  return [...folders, ...notes];
}