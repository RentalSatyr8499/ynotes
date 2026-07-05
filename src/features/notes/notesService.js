// src/features/notes/notesService.js

import { getFileTree } from '../drive/manifestService';

export async function fetchAllNotes(accessToken) {
  const data = await getFileTree(accessToken);
  return { data };
}