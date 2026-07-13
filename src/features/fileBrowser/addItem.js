// src/features/fileBrowser/addItem.js
//
// Creates new files (Google Docs) or virtual folders and registers them in
// the manifest. Drive folder nesting is represented only in the manifest JSON —
// all docs live flat inside the ynotes Drive folder.
//
// Path conventions:
//   "/work/archive/my-note"  → create a file named "my-note" inside work/archive
//   "/work/archive/"         → create a folder named "archive" inside work

import { getYnotesFolderId } from '../drive/ynotesFolderService';
import { createDoc } from '../drive/driveWriteService';
import { patchManifest, findManifest, getJSON } from '../drive/manifestService';

// Parses a file or folder path into its components.
// Returns { folderSegments, itemName, isFolder }.
//
// File:   "/work/archive/my-note"  → { folderSegments: ["work", "archive"], itemName: "my-note", isFolder: false }
// Folder: "/work/archive/"         → { folderSegments: ["work"],            itemName: "archive",  isFolder: true  }
function parsePath(itemPath) {
  if (!itemPath.startsWith('/')) {
    throw new Error(`addItem: path must start with "/" (got "${itemPath}")`);
  }

  const isFolder = itemPath.endsWith('/');
  const parts = itemPath.replace(/\/$/, '').slice(1).split('/').filter(Boolean);

  if (parts.length === 0) {
    throw new Error('addItem: path must include at least an item name (e.g. "/my-note" or "/my-folder/")');
  }

  return {
    folderSegments: parts.slice(0, -1),
    itemName: parts[parts.length - 1],
    isFolder,
  };
}

// Builds the JSON Patch operations needed to register an item in the manifest.
// Walks the current manifest tree to determine which intermediate folder nodes
// are missing, creating each with an eager "." key, then adds the item entry.
//
// For files:   adds itemName → docId under the "." key of the target folder.
// For folders: adds itemName → { ".": {} } directly in the target folder object.
function buildPatchOperations(currentTree, folderSegments, itemName, isFolder, docId = null) {
  const ops = [];
  let node = currentTree;

  // Ensure each intermediate folder node exists, creating missing ones eagerly.
  for (let i = 0; i < folderSegments.length; i++) {
    const segment = folderSegments[i];
    const pointerToSegment = '/' + folderSegments.slice(0, i + 1).join('/');

    if (!(segment in node)) {
      // This segment and everything deeper is missing — create them all.
      ops.push({ op: 'add', path: pointerToSegment, value: { '.': {} } });
      for (let j = i + 1; j < folderSegments.length; j++) {
        const deepPointer = '/' + folderSegments.slice(0, j + 1).join('/');
        ops.push({ op: 'add', path: deepPointer, value: { '.': {} } });
      }
      // All missing nodes are now created — add the item at the end.
      ops.push(...itemOps(folderSegments, itemName, isFolder, docId));
      return ops;
    }

    // Node exists — ensure it has a "." key before going deeper.
    if (!('.' in node[segment])) {
      ops.push({ op: 'add', path: `${pointerToSegment}/.`, value: {} });
    }

    node = node[segment];
  }

  // All intermediate segments exist. Check for a "." at the root if needed.
  if (folderSegments.length === 0 && !isFolder && !('.' in node)) {
    ops.push({ op: 'add', path: '/.', value: {} });
  }

  ops.push(...itemOps(folderSegments, itemName, isFolder, docId));
  return ops;
}

// Returns the final patch op(s) for the item itself.
function itemOps(folderSegments, itemName, isFolder, docId) {
  if (isFolder) {
    // Add a new folder node with an eager "." key.
    const path = '/' + [...folderSegments, itemName].join('/');
    return [{ op: 'add', path, value: { '.': {} } }];
  } else {
    // Add the file entry under the "." key of the target folder.
    const path = '/' + [...folderSegments, '.', itemName].join('/');
    return [{ op: 'add', path, value: docId }];
  }
}

// Creates a file or folder and registers it in the ynotes manifest.
//
// Paths ending in "/" are treated as folders (virtual — no Drive folder is
// created). All other paths are treated as files (a Google Doc is created
// flat inside the ynotes Drive folder).
//
// Intermediate folder nodes that don't yet exist in the manifest are created
// eagerly with a "." key.
//
// Returns the new doc's Drive id for files, or null for folders.
export async function addItem(accessToken, itemPath) {
  const { folderSegments, itemName, isFolder } = parsePath(itemPath);

  // For files, create the Google Doc in the flat ynotes Drive folder.
  let docId = null;
  if (!isFolder) {
    const folderId = await getYnotesFolderId(accessToken);
    const doc = await createDoc(accessToken, itemName, folderId);
    docId = doc.id;
  }

  // Patch the manifest to register the new item.
  const manifestDocId = await findManifest(accessToken);
  if (!manifestDocId) throw new Error('addItem: ynotes_manifest not found');

  const currentTree = await getJSON(accessToken, manifestDocId);
  const operations = buildPatchOperations(currentTree, folderSegments, itemName, isFolder, docId);

  await patchManifest(accessToken, manifestDocId, operations);

  return docId;
}