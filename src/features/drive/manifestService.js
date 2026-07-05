// src/features/drive/manifestService.js
//
// Higher-level operations on the ynotes_manifest Google Doc.
// The manifest is a Google Doc whose body (starting at index 4666) contains
// a JSON string written as plain text.

import { findDocByName, findFolder, getDocRange, getDocLength } from './driveReadService';
import { createDoc, createFolder, writeRequestsToDoc } from './driveWriteService';
import manifestTemplate from '../../assets/manifest_template.json';

const MANIFEST_NAME = 'ynotes_manifest';
const YNOTES_FOLDER = 'ynotes';
const MANIFEST_JSON_START = 4641;

// Searches the user's Drive for ynotes_manifest.
// Returns the docId string if found, or null if not.
export async function findManifest(accessToken) {
  return findDocByName(accessToken, MANIFEST_NAME);
}

// Reads the plain-text JSON string from the manifest doc starting at index 4666,
// stitches all text runs back together, and parses it into a JS object.
export async function getJSON(accessToken, docId) {
  const endIndex = await getDocLength(accessToken, docId);
  const elements = await getDocRange(accessToken, docId, MANIFEST_JSON_START, endIndex);

  const raw = elements
    .flatMap(el => el.paragraph?.elements ?? [])
    .map(el => el.textRun?.content ?? '')
    .join('');

  // console.log('getJSON raw string:', raw); // <-- add this
  return JSON.parse(raw);
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