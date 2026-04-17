const PROFILE_PHOTO_KEY = 'tc_profile_photos';

type ProfilePhotos = Record<string, string>;

function readPhotos(): ProfilePhotos {
  try {
    const raw = localStorage.getItem(PROFILE_PHOTO_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ProfilePhotos;
  } catch {
    return {};
  }
}

function writePhotos(data: ProfilePhotos): void {
  localStorage.setItem(PROFILE_PHOTO_KEY, JSON.stringify(data));
}

export function getStoredProfilePhoto(playerId: number | undefined): string | undefined {
  if (!playerId) return undefined;
  const photos = readPhotos();
  return photos[String(playerId)];
}

export function saveStoredProfilePhoto(playerId: number, dataUrl: string): void {
  const photos = readPhotos();
  photos[String(playerId)] = dataUrl;
  writePhotos(photos);
}
