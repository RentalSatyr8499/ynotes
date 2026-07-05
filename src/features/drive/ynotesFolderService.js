// src/features/drive/ynotesFolderService.js
//
// Ensures a "ynotes" folder exists in Google Drive and returns its id.

import { DRIVE_API } from '../../constants.js';
import { findFolder } from './driveReadService.js';
import { createFolder } from './driveWriteService.js';

const YNOTES_FOLDER_NAME = 'ynotes';

export async function getYnotesFolderId(accessToken) {
  const existingId = await findFolder(accessToken, YNOTES_FOLDER_NAME);
  if (existingId) return existingId;

  console.log("No ynotes folder found, creating a new one.");
  return createFolder(accessToken, YNOTES_FOLDER_NAME);
}