// src/features/fileBrowser/addItem.js
//
// Creates new files (Google Docs) and registers them in the manifest.
// Drive folder nesting is represented only in the manifest JSON —
// all docs live flat inside the ynotes Drive folder.

import { getYnotesFolderId } from '../drive/ynotesFolderService';
import { createDoc } from '../drive/driveWriteService';
import { patchManifest, findManifest, getJSON } from '../drive/manifestService';

// Splits a JSON Pointer like "/work/archive/my-note" into:
//   folderSegments: ["work", "archive"]
//   fileName:       "my-note"
function parseFilePath(filePath) {
  if (!filePath.startsWith('/')) {
    throw new Error(`createFile: filePath must be a JSON Pointer starting with "/" (got "${filePath}")`);
  }
  const parts = filePath.slice(1).split('/').filter(Boolean);
  if (parts.length === 0) {
    throw new Error('createFile: filePath must include at least a file name (e.g. "/my-note")');
  }
  return {
    folderSegments: parts.slice(0, -1),
    fileName: parts[parts.length - 1],
  };
}

// Builds the JSON Patch operations needed to register a new file in the manifest.
// Walks the current manifest tree to determine which intermediate folder nodes
// are missing, creating each with an eager "." key, then adds the file entry.
function buildPatchOperations(currentTree, folderSegments, fileName, docId) {
  const ops = [];
  let node = currentTree;

  // Ensure each intermediate folder node exists, creating missing ones eagerly.
  for (let i = 0; i < folderSegments.length; i++) {
    const segment = folderSegments[i];
    const pointerToSegment = '/' + folderSegments.slice(0, i + 1).join('/');

    if (!(segment in node)) {
      // Create the missing folder node with an eager "." key
      ops.push({ op: 'add', path: pointerToSegment, value: { '.': {} } });
      // From here all deeper segments will also be missing, so create them too
      for (let j = i + 1; j < folderSegments.length; j++) {
        const deepPointer = '/' + folderSegments.slice(0, j + 1).join('/');
        ops.push({ op: 'add', path: deepPointer, value: { '.': {} } });
      }
      // After creating all missing nodes, we know the "." at the target folder
      // was just initialized to {}, so we can add directly into it.
      const dotPointer = '/' + [...folderSegments, '.', fileName].join('/');
      ops.push({ op: 'add', path: dotPointer, value: docId });
      return ops;
    }

    // Node exists — ensure it has a "." key before going deeper
    if (!('.' in node[segment])) {
      ops.push({ op: 'add', path: `${pointerToSegment}/.`, value: {} });
    }

    node = node[segment];
  }

  // All folder segments exist. Now handle the "." entry at the target folder.
  const dotPointer = '/' + [...folderSegments, '.', fileName].join('/');

  if (folderSegments.length === 0) {
    // File lives at the root of the manifest
    if (!('.' in node)) {
      ops.push({ op: 'add', path: '/.', value: {} });
    }
  }

  ops.push({ op: 'add', path: dotPointer, value: docId });
  return ops;
}

// Creates a new Google Doc and registers it in the ynotes manifest.
//
// filePath is a JSON Pointer that encodes both the folder location and the
// file name, e.g. "/work/archive/my-note". Intermediate folder nodes that
// don't yet exist in the manifest are created eagerly with a "." key.
//
// Returns the new doc's Drive id.
export async function createFile(accessToken, filePath) {
  const { folderSegments, fileName } = parseFilePath(filePath);

  // Create the Google Doc flat inside the ynotes Drive folder
  const folderId = await getYnotesFolderId(accessToken);
  const doc = await createDoc(accessToken, fileName, folderId);
  const docId = doc.id;

  // Read the current manifest and build the patch
  const manifestDocId = await findManifest(accessToken);
  if (!manifestDocId) throw new Error('createFile: ynotes_manifest not found');

  const currentTree = await getJSON(accessToken, manifestDocId);
  const operations = buildPatchOperations(currentTree, folderSegments, fileName, docId);

  await patchManifest(accessToken, manifestDocId, operations);

  return docId;
}