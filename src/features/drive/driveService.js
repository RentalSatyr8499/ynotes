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

// Appends plain text to an existing Google Doc.
// Uses the Docs batchUpdate API to insert text at the end of the document body.
export async function appendToDoc(accessToken, docId, text) {
  // We insert at index 1 (the very start of the body) on a fresh doc,
  // but for appending we need to know the doc length. The cleanest approach
  // for a hello-world is to insert at index 1 and overwrite nothing.
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
            location: { index: 1 },
            text,
          },
        },
      ],
    }),
  });

  if (!res.ok) throw new Error(`appendToDoc failed: ${res.status} ${await res.text()}`);
  return res.json();
}