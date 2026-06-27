// src/hooks/useNote.js
//
// Owns the note's text state. Currently just in-memory (resets on reload),
// but isolating it here means swapping in AsyncStorage/localStorage
// persistence later only touches this file, not the components that use it.

import { useState } from 'react';
import { DEFAULT_NOTE } from '../features/notes/markdown.js';

export default function useNote(initial = DEFAULT_NOTE) {
  const [note, setNote] = useState(initial);
  return [note, setNote];
}