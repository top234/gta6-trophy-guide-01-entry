// Saved progress and settings: earned trophy names and the spoiler setting,
// kept in localStorage only (nothing leaves the browser).
const EARNED_KEY = 'gta6-trophy-guide-earned-v1';
const SPOILER_KEY = 'gta6-trophy-guide-spoilers-v1';

export function loadEarned() {
  try {
    const raw = JSON.parse(localStorage.getItem(EARNED_KEY) ?? '[]');
    return new Set(Array.isArray(raw) ? raw.filter((n) => typeof n === 'string') : []);
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  localStorage.setItem(EARNED_KEY, JSON.stringify([...earned].sort()));
}

export function loadSpoilersHidden() {
  return localStorage.getItem(SPOILER_KEY) === '1';
}

export function saveSpoilersHidden(hidden) {
  localStorage.setItem(SPOILER_KEY, hidden ? '1' : '0');
}

export function exportProgress(earned) {
  const blob = new Blob(
    [JSON.stringify({ app: 'gta6-trophy-guide', version: 1, earned: [...earned].sort() }, null, 2)],
    { type: 'application/json' },
  );
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

export async function importProgressFile(file) {
  const doc = JSON.parse(await file.text());
  const names = Array.isArray(doc) ? doc : doc.earned;
  if (!Array.isArray(names)) throw new Error('not a progress file');
  return new Set(names.filter((n) => typeof n === 'string'));
}
