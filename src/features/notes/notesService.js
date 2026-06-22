// src/features/notes/notesService.js
//
// Service layer for fetching the user's note tree. Currently a stub —
// replace the internals of `fetchAllNotes` with real Google Drive logic
// (fetch manifest.txt, parse it, fetch file metadata) when ready.
// The shape returned here is the contract the UI depends on.

const STUB_NOTES = {
  owned_notes: {
    'Work': {
      'Q3 Planning': {
        '.': {
          'OKRs': 'https://drive.google.com/file/okrs',
          'Roadmap': 'https://drive.google.com/file/roadmap',
        },
      },
      '.': {
        'Meeting Notes': 'https://drive.google.com/file/meetings',
      },
    },
    'Personal': {
      '.': {
        'Journal': 'https://drive.google.com/file/journal',
        'Reading List': 'https://drive.google.com/file/reading',
      },
    },
    '.': {
      'Scratch Pad': 'https://drive.google.com/file/scratch',
    },
  },
  shared_notes: {
    'Team Docs': {
      '.': {
        'Onboarding': 'https://drive.google.com/file/onboarding',
        'Style Guide': 'https://drive.google.com/file/style',
      },
    },
  },
};

// Simulates a network delay so loading states can be tested in the UI.
export async function fetchAllNotes() {
  await new Promise((res) => setTimeout(res, 600));
  return STUB_NOTES;
}