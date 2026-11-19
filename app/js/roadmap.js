// The roadmap to the platinum: four stages in play order, built from the
// official trophy descriptions. Stage 1 is the story, stage 2 the optional
// questlines, stage 3 the 100% completion checklist, stage 4 the cleanup.
// The one missable trophy is flagged in stage 1 and on its card.
export const ROADMAP_STAGES = [
  {
    title: 'Stage 1 — Play the story, Chapters 1–5',
    hours: '60–80 hours',
    text: 'Finish the main story first. Every chapter and mission trophy unlocks automatically as you play, and progress toward the 100% checklist already counts. Keep a manual save at the start and end of each chapter — there is no mission replay. Do the Chapter 1 meditation for Positive Mental Attitude before Chapter 1 ends.',
    trophyIds: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 28],
  },
  {
    title: 'Stage 2 — Optional questlines & strangers',
    hours: '10–20 hours',
    text: 'The stranger and optional questlines stay open after the story, so do them whenever they appear — or all at once in free-roam. Andy is Lucia-only, Billy, Tyrone and Bret are Jason-only. Only Kirk, Kyle, Yago and Pilot Pete count toward the 8 Strangers & Freaks strands.',
    trophyIds: [22, 23, 24, 25, 26, 27, 29, 20],
  },
  {
    title: 'Stage 3 — 100% completion checklist',
    hours: 'about 100 hours',
    text: 'After the story, the checklist appears under Progress, Stats, 100% Completion. It is forgiving — closer to 60% of true completion: any 70 of 80 challenges, 200 of 277 vehicles scanned, 100 of 255 animals studied, but all robberies, underwater discoveries, shooting ranges, drone races and Bret’s quests. Most of this stage’s trophies pop while you work the list.',
    trophyIds: [14, 15, 17, 18, 30, 31, 32, 35, 40, 42, 43, 52],
  },
  {
    title: 'Stage 4 — Cleanup & miscellaneous',
    hours: 'about 10 hours',
    text: 'Whatever is left: try every activity once, win races, lose the cops with your partner, rob shops and vaults, explore, spend and save. None of these are missable, so they can all be done in free-roam after the story.',
    trophyIds: [16, 19, 21, 33, 34, 36, 37, 38, 39, 41, 44, 45, 46, 47, 48, 49, 50, 51, 53, 54, 55],
  },
];

export function renderRoadmap(stagesEl, trophies, earned) {
  const byId = new Map(trophies.map((t) => [t.id, t]));
  stagesEl.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const li = document.createElement('li');
    li.className = 'stage';
    const h3 = document.createElement('h3');
    h3.textContent = stage.title;
    const hours = document.createElement('span');
    hours.className = 'stage-hours';
    hours.textContent = stage.hours;
    h3.append(hours);
    const p = document.createElement('p');
    p.textContent = stage.text;
    const chips = document.createElement('div');
    chips.className = 'stage-trophies';
    let done = 0;
    for (const id of stage.trophyIds) {
      const t = byId.get(id);
      if (!t) continue;
      const chip = document.createElement('span');
      chip.className = 'stage-chip' + (earned.has(t.name) ? ' earned' : '') + (t.missable ? ' missable' : '');
      chip.textContent = (t.missable ? '⚠ ' : '') + t.name;
      chips.append(chip);
      if (earned.has(t.name)) done += 1;
    }
    const count = document.createElement('p');
    count.className = 'stage-count';
    count.textContent = `${done} of ${stage.trophyIds.length} trophies in this stage earned`;
    li.append(h3, p, chips, count);
    stagesEl.append(li);
  }
}
