// Filters for the trophy checklist: kind (story, missable, collectibles,
// activities, strangers, world, online), grade, earned status, and free text.
// GTA VI has no online trophies, so the online kind deliberately matches none.
export const KIND_LABELS = {
  story: 'Story',
  missable: 'Missable',
  collectibles: 'Collectibles',
  activities: 'Activities',
  strangers: 'Strangers',
  world: 'World & crime',
  online: 'Online',
  platinum: 'Platinum',
};

export function kindOf(trophy) {
  return trophy.kind ?? 'world';
}

export function matchesFilters(trophy, earned, filters) {
  if (filters.kind !== 'all') {
    if (filters.kind === 'missable') {
      if (!trophy.missable) return false;
    } else if (filters.kind === 'online') {
      return false; // no online trophies exist in this game
    } else if (kindOf(trophy) !== filters.kind) {
      return false;
    }
  }
  if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
  const isEarned = earned.has(trophy.name);
  if (filters.status === 'earned' && !isEarned) return false;
  if (filters.status === 'unearned' && isEarned) return false;
  if (filters.search) {
    const hay = (trophy.name + ' ' + trophy.description + ' ' + trophy.grade + ' ' + (KIND_LABELS[trophy.kind] ?? trophy.kind)).toLowerCase();
    if (!hay.includes(filters.search.toLowerCase())) return false;
  }
  return true;
}

export function filterSummary(trophies, earned, filters) {
  const shown = trophies.filter((t) => matchesFilters(t, earned, filters)).length;
  return `Showing ${shown} of ${trophies.length} trophies · ${earned.size} earned`;
}
