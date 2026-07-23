// src/features/drive/driveWriteService.js
//
// Write calls to Google Drive and Docs REST APIs.

import { DRIVE_API, DOCS_API } from '../../constants.js';
import { getDocLength } from './driveReadService';

// Creates an empty Google Doc with the given title, optionally inside a folder.
// Returns the full file resource including `id`.
export async function createDoc(accessToken, title, parentId = null) {
  const res = await fetch(`${DRIVE_API}/files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: title,
      mimeType: 'application/vnd.google-apps.document',
      ...(parentId && { parents: [parentId] }),
    }),
  });
  if (!res.ok) throw new Error(`createDoc failed: ${res.status} ${await res.text()}`);
  return res.json();
}

// Creates a folder with the given name, optionally inside a parent folder.
// Returns the folder resource including `id`.
export async function createFolder(accessToken, name, parentId = null) {
  const res = await fetch(`${DRIVE_API}/files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      mimeType: 'application/vnd.google-apps.folder',
      ...(parentId && { parents: [parentId] }),
    }),
  });
  if (!res.ok) throw new Error(`createFolder failed: ${res.status} ${await res.text()}`);
  return res.json();
}

// Inserts plain text into an existing Google Doc at the given index.
// Defaults to index 1 (very start of body).
// Remember: the Docs API always inserts — it never overwrites in place.
// To replace content, call clearDoc() first, then writeToDoc().
export async function writeToDoc(accessToken, docId, text, index = 1) {
  const res = await fetch(`${DOCS_API}/documents/${docId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [{ insertText: { location: { index }, text } }],
    }),
  });
  if (!res.ok) throw new Error(`writeToDoc failed: ${res.status} ${await res.text()}`);
  return res.json();
}

// Sends a pre-formed batchUpdate requests array directly to a doc.
// Use this when you have a Docs API requests blob (e.g. from a template)
// rather than plain text.
export async function writeRequestsToDoc(accessToken, docId, requests) {
  const res = await fetch(`${DOCS_API}/documents/${docId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ requests }),
  });
  if (!res.ok) throw new Error(`writeRequestsToDoc failed: ${res.status} ${await res.text()}`);
  return res.json();
}

// Deletes doc content from startIndex to the end of the doc.
// Defaults to 1 (clear everything). Pass a higher index to preserve
// content before that point.
export async function clearDoc(accessToken, docId, startIndex = 1) {
  const length = await getDocLength(accessToken, docId);
  if (length <= startIndex) return;
  const res = await fetch(`${DOCS_API}/documents/${docId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [{ deleteContentRange: { range: { startIndex, endIndex: length } } }],
    }),
  });
  if (!res.ok) throw new Error(`clearDoc failed: ${res.status} ${await res.text()}`);
}

// Overwrites the entire body of a Google Doc with `plaintext`.
//
// Strategy: a single batchUpdate with two requests —
//   1. deleteContentRange across the whole body (leaving the required
//      trailing paragraph the Docs API always preserves)
//   2. insertText at index 1 with the new content
//
// This is intentionally blunt: we treat the doc as a remote plaintext
// store, not a rich document, so positional OT is unnecessary.
//
// Throws if the request fails so the sync loop knows not to advance `base`.
export async function overwriteDoc(accessToken, docId, plaintext) {
  // First fetch the current doc length so we know what range to clear.
  const docRes = await fetch(
    `${DOCS_API}/documents/${docId}?fields=body.content`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!docRes.ok) {
    throw new Error(`overwriteDoc: fetch failed ${docRes.status} ${await docRes.text()}`);
  }
  const doc         = await docRes.json();
  const content     = doc.body.content;
  const lastElement = content[content.length - 1];
  const docLength   = lastElement.endIndex - 1;

  // Build the batchUpdate payload.
  // If the doc is already empty (length === 1, only the trailing paragraph
  // marker), skip the delete and just insert.
  const requests = [];

  if (docLength > 1) {
    requests.push({
      deleteContentRange: {
        range: { startIndex: 1, endIndex: docLength },
      },
    });
  }

  if (plaintext.length > 0) {
    requests.push({
      insertText: {
        location: { index: 1 },
        text: plaintext,
      },
    });
  }

  if (requests.length === 0) return; // nothing to do

  const writeRes = await fetch(
    `${DOCS_API}/documents/${docId}:batchUpdate`,
    {
      method:  'POST',
      headers: {
        Authorization:  `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    }
  );

  if (!writeRes.ok) {
    throw new Error(`overwriteDoc: write failed ${writeRes.status} ${await writeRes.text()}`);
  }
}