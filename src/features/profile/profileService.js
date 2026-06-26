// src/features/profile/profileService.js
//
// Service layer for fetching the authenticated user's profile.
// Currently a stub — replace with real Google OAuth profile fetch when ready.

const STUB_PROFILE = {
  name: 'Yena Chun',
  email: 'ychun@example.com',
  avatarUri: 'https://i.pravatar.cc/300?img=47',
};

export async function fetchProfile() {
  await new Promise((res) => setTimeout(res, 300));
  return STUB_PROFILE;
}