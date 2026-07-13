// src/features/drive/manifestService.js
//
// Higher-level operations on the ynotes_manifest Google Doc.
// The manifest is a Google Doc whose body (starting at index 4641) contains
// a JSON string written as plain text.

import { findDocByName, findFolder, getDocRange, getDocLength } from './driveReadService';
import { createDoc, createFolder, writeRequestsToDoc, clearDoc, writeToDoc } from './driveWriteService';
import { applyPatch } from '../fileBrowser/jsonPatchService';
import manifestTemplate from '../../assets/manifest_template.json';

const MANIFEST_NAME = 'ynotes_manifest';
const YNOTES_FOLDER = 'ynotes';
const MANIFEST_JSON_START = 4643;

// Searches the user's Drive for ynotes_manifest.
// Returns the docId string if found, or null if not.
export async function findManifest(accessToken) {
  return findDocByName(accessToken, MANIFEST_NAME);
}

// Reads the plain-text JSON string from the manifest doc starting at
// MANIFEST_JSON_START, stitches all text runs back together, and parses
// it into a JS object.
export async function getJSON(accessToken, docId) {
  const endIndex = await getDocLength(accessToken, docId);

  const elements = await getDocRange(accessToken, docId, MANIFEST_JSON_START, endIndex);

  const raw = elements
    .flatMap(el => el.paragraph?.elements ?? [])
    .map(el => el.textRun?.content ?? '')
    .join('');

  return JSON.parse(raw);
}

// Writes a JS object back to the manifest doc, replacing everything from
// MANIFEST_JSON_START to the end of the file.
async function writeJSON(accessToken, docId, data) {
  const serialized = JSON.stringify(data);

  await clearDoc(accessToken, docId, MANIFEST_JSON_START-1); // clearing from MANIFEST_JSON_START seems to be off by one
  await writeToDoc(accessToken, docId, serialized, MANIFEST_JSON_START-1);
}

// Returns the file tree JSON from ynotes_manifest.
// If no manifest exists, finds or creates the ynotes folder, creates a fresh
// ynotes_manifest inside it, writes the template, then returns the parsed JSON.
export async function getFileTree(accessToken) {
  let docId = await findManifest(accessToken);

  if (!docId) {
    let folderId = await findFolder(accessToken, YNOTES_FOLDER);
    if (!folderId) {
      const folder = await createFolder(accessToken, YNOTES_FOLDER);
      folderId = folder.id;
    }

    const doc = await createDoc(accessToken, MANIFEST_NAME, folderId);
    docId = doc.id;

    await writeRequestsToDoc(accessToken, docId, manifestTemplate.requests);
  }

  return getJSON(accessToken, docId);
}

// Applies an array of RFC 6902 JSON Patch operations to the manifest and
// writes the result back to Drive.
//
// All operations are applied atomically in memory — if any throws, the doc
// is left unchanged. Throws for invalid pointers, missing paths, or failed
// test assertions.
//
// Usage:
//   await patchManifest(accessToken, docId, [
//     { op: 'add',     path: '/notes/work',       value: { id: '...', title: 'Work' } },
//     { op: 'replace', path: '/notes/work/title', value: 'Work Notes' },
//     { op: 'remove',  path: '/notes/old' },
//     { op: 'move',    from: '/notes/work',       path: '/archive/work' },
//     { op: 'test',    path: '/version',           value: 1 },
//   ]);
export async function patchManifest(accessToken, docId, operations) {
  const current = await getJSON(accessToken, docId);
  const patched = applyPatch(current, operations);
  await writeJSON(accessToken, docId, patched);
}