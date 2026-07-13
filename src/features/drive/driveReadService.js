// src/features/drive/driveReadService.js
//
// Read-only calls to Google Drive and Docs REST APIs.

import { DRIVE_API, DOCS_API } from '../../constants.js';

// Searches Google Drive for a doc with an exact name match.
// Returns the docId string if found, or null if no match.
// Note: Drive search is eventually consistent — a doc created seconds ago
// may not appear immediately.
export async function findDocByName(accessToken, title) {
  const query = encodeURIComponent(
    `name = '${title.replace(/'/g, "\\'")}' and mimeType = 'application/vnd.google-apps.document' and trashed = false`
  );
  const res = await fetch(`${DRIVE_API}/files?q=${query}&fields=files(id,name)`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`findDocByName failed: ${res.status} ${await res.text()}`);
  const { files } = await res.json();
  return files.length > 0 ? files[0].id : null;
}

// Searches Google Drive for a folder with an exact name match.
// Returns the folder id if found, or null if not.
export async function findFolder(accessToken, name) {
  const query = encodeURIComponent(
    `name = '${name.replace(/'/g, "\\'")}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
  );
  const res = await fetch(`${DRIVE_API}/files?q=${query}&fields=files(id,name)`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`findFolder failed: ${res.status} ${await res.text()}`);
  const { files } = await res.json();
  return files.length > 0 ? files[0].id : null;
}

// Returns the current length of the doc body in characters (including the
// trailing newline the Docs API always keeps at the end).
export async function getDocLength(accessToken, docId) {
  const res = await fetch(`${DOCS_API}/documents/${docId}?fields=body.content`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`getDocLength failed: ${res.status} ${await res.text()}`);
  const doc = await res.json();
  const content = doc.body.content;
  const lastElement = content[content.length - 1];
  const length = lastElement.endIndex - 1;
  return length;
}

// Fetches the doc body and returns only the content elements that fall
// within [startIndex, endIndex].
export async function getDocRange(accessToken, docId, startIndex, endIndex) {
  const res = await fetch(`${DOCS_API}/documents/${docId}?fields=body.content`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`getDocRange failed: ${res.status} ${await res.text()}`);
  const doc = await res.json();

  const all = doc.body.content;

  const filtered = all.filter(
    el => el.endIndex > startIndex && el.startIndex < endIndex + 1
  );

  return filtered;
}

// Fetches a full Google Doc and returns its content as a plain text string.
// Walks body.content, concatenating textRun.content from every paragraph
// element. The Docs API terminates the document with a trailing newline
// which we strip here so the editor doesn't see a phantom empty line.
export async function readDocAsPlaintext(accessToken, docId) {
  const res = await fetch(`${DOCS_API}/documents/${docId}?fields=body.content`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`readDocAsPlaintext failed: ${res.status} ${await res.text()}`);
  const doc = await res.json();

  const text = (doc.body.content ?? [])
    .flatMap(el => el.paragraph?.elements ?? [])
    .map(el => el.textRun?.content ?? '')
    .join('');

  // Strip the single trailing newline the Docs API always appends.
  return text.endsWith('\n') ? text.slice(0, -1) : text;
}

// Extracts the Google Drive file ID from a Drive file URL.
// Handles the common formats:
//   https://drive.google.com/file/d/{id}/view
//   https://docs.google.com/document/d/{id}/edit
export function extractDocId(url) {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) throw new Error(`Could not extract doc ID from URL: ${url}`);
  return match[1];
}