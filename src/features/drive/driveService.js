// src/features/drive/driveService.js
//
// Raw API calls to Google Drive and Docs REST APIs.
// Every function takes an accessToken as its first argument —
// no auth logic lives here, just HTTP.

const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const DOCS_API  = 'https://docs.googleapis.com/v1';

// Creates an empty Google Doc with the given title.
// Returns the full file resource, including `id` (the docId you'll need for writes).
export async function createDoc(accessToken, title) {
  const res = await fetch(`${DRIVE_API}/files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: title,
      mimeType: 'application/vnd.google-apps.document',
    }),
  });

  if (!res.ok) throw new Error(`createDoc failed: ${res.status} ${await res.text()}`);
  return res.json(); // { id, name, mimeType, ... }
}

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

// Inserts text into an existing Google Doc at the given index.
// index 1 = very start of body. Use getDocLength() below to append at the end.
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
      requests: [
        {
          insertText: {
            location: { index },
            text,
          },
        },
      ],
    }),
  });

  if (!res.ok) throw new Error(`writeToDoc failed: ${res.status} ${await res.text()}`);
  return res.json();
}

// Returns the current length of the doc body in characters (including the
// trailing newline the Docs API always keeps at the end).
// Pass this as the index to writeToDoc() to append at the true end.
export async function getDocLength(accessToken, docId) {
  const res = await fetch(
    `${DOCS_API}/documents/${docId}?fields=body.content`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) throw new Error(`getDocLength failed: ${res.status} ${await res.text()}`);
  const doc = await res.json();
  const content = doc.body.content;
  return content[content.length - 1].endIndex - 1; // subtract 1 to sit before the trailing newline
}

// Deletes doc content from startIndex to the end of the doc.
// Defaults to 1 (clear everything). Pass a higher index to preserve
// content before that point.
export async function clearDoc(accessToken, docId, startIndex = 1) {
  const length = await getDocLength(accessToken, docId);
  if (length <= startIndex) return; // nothing to clear

  const res = await fetch(`${DOCS_API}/documents/${docId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [
        {
          deleteContentRange: {
            range: { startIndex, endIndex: length },
          },
        },
      ],
    }),
  });

  if (!res.ok) throw new Error(`clearDoc failed: ${res.status} ${await res.text()}`);
}

// Fetches the doc body and returns only the content elements that fall
// within [startIndex, endIndex]. Useful for reading a known slice of a doc
// without pulling the whole thing into memory.
export async function getDocRange(accessToken, docId, startIndex, endIndex) {
  const res = await fetch(`${DOCS_API}/documents/${docId}?fields=body.content`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error(`getDocRange failed: ${res.status} ${await res.text()}`);
  const doc = await res.json();

  return doc.body.content.filter(
    el => el.startIndex >= startIndex && el.endIndex <= endIndex
  );
}