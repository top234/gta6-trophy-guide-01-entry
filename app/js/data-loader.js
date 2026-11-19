// Loads the trophy list from app/data/trophies.json (a file inside app/, so it
// works with the network off) and hands back the 55 trophies in list order.
export async function loadTrophies() {
  const response = await fetch('data/trophies.json');
  if (!response.ok) throw new Error('could not load data/trophies.json');
  const doc = await response.json();
  const trophies = doc.trophies ?? doc;
  if (!Array.isArray(trophies) || trophies.length !== 55) {
    throw new Error('expected 55 trophies, got ' + (trophies?.length ?? 0));
  }
  return trophies;
}

export function trophyById(trophies, id) {
  return trophies.find((t) => t.id === id);
}
