// src/components/notesBrowser/useNotesRowCreate.js
//
// Encapsulates the "create a new folder or file inside this row" flow:
// state, input value, submission, and the slide-in animation for the
// inline input. Consumed by NotesRow and NotesRowCreate.

import { useState } from 'react';
import { useSlideIn } from '../../hooks/useSlideIn';

export function useNotesRowCreate({ onAddItem, onDone }) {
  const [creating, setCreating]     = useState(null); // 'folder' | 'file' | null
  const [inputValue, setInputValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const inputSlide = useSlideIn({ direction: 'right' });

  function startCreating(type, e) {
    e.stopPropagation();
    setCreating(type);
    setInputValue('');
    inputSlide.trigger();
  }

  function cancelCreating(e) {
    e.stopPropagation();
    setCreating(null);
    setInputValue('');
    onDone();
  }

  async function handleCreate(e) {
    e?.stopPropagation();
    const name = inputValue.trim();
    if (!name || submitting) return;
    setSubmitting(true);
    try {
      await onAddItem(name, creating);
      setCreating(null);
      setInputValue('');
      onDone();
    } finally {
      setSubmitting(false);
    }
  }

  return {
    creating,
    inputValue,
    setInputValue,
    submitting,
    inputSlide,
    startCreating,
    cancelCreating,
    handleCreate,
  };
}