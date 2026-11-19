// Renders the trophy checklist: one card per trophy with its official name,
// description and grade, its guide and named sources, a checkbox, and the
// missable / hidden / count flags. When the spoiler setting is on, un-earned
// story trophies hide their name and description behind a placeholder.
import { KIND_LABELS } from './filters.js';

function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

function countLabel(trophy) {
  if (trophy.count === undefined) return null;
  if (typeof trophy.count === 'number' && trophy.count >= 1000) return `$${trophy.count.toLocaleString('en-US')}`;
  return `× ${trophy.count}`;
}

export function createTrophyCard(trophy, earned, spoilersHidden, onToggle) {
  const isEarned = earned.has(trophy.name);
  const hiddenBySpoiler = spoilersHidden && !isEarned && trophy.kind === 'story';

  const card = document.createElement('article');
  card.className = 'card' + (isEarned ? ' earned' : '');
  card.dataset.trophyId = String(trophy.id);

  const head = document.createElement('div');
  head.className = 'card-head';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = isEarned;
  box.setAttribute('aria-label', 'Mark ' + trophy.name + ' as earned');
  box.addEventListener('change', () => onToggle(trophy, box.checked));
  const title = document.createElement('h3');
  title.className = 'card-title';
  title.textContent = hiddenBySpoiler ? 'Hidden trophy — earn it to reveal' : trophy.name;
  head.append(box, title);
  card.append(head);

  const desc = document.createElement('p');
  desc.className = 'card-desc';
  desc.textContent = hiddenBySpoiler ? 'This story trophy stays hidden until earned.' : trophy.description;
  card.append(desc);

  const badges = document.createElement('div');
  badges.className = 'badge-row';
  const grade = document.createElement('span');
  grade.className = 'grade grade-' + trophy.grade;
  grade.textContent = gradeLabel(trophy.grade);
  badges.append(grade);
  const kind = document.createElement('span');
  kind.className = 'flag';
  kind.textContent = KIND_LABELS[trophy.kind] ?? trophy.kind;
  badges.append(kind);
  const count = countLabel(trophy);
  if (count) {
    const c = document.createElement('span');
    c.className = 'flag flag-count';
    c.textContent = count;
    badges.append(c);
  }
  if (trophy.hidden) {
    const h = document.createElement('span');
    h.className = 'flag flag-hidden';
    h.textContent = 'Hidden on PSN';
    badges.append(h);
  }
  if (trophy.missable) {
    const m = document.createElement('span');
    m.className = 'flag flag-missable';
    m.textContent = '⚠ MISSABLE';
    badges.append(m);
  }
  card.append(badges);

  if (!hiddenBySpoiler) {
    const label = document.createElement('p');
    label.className = 'guide-label';
    label.textContent = 'How to earn it';
    const guide = document.createElement('p');
    guide.className = 'guide';
    guide.textContent = trophy.guide;
    card.append(label, guide);
  } else {
    const note = document.createElement('p');
    note.className = 'guide spoiler-hidden';
    note.textContent = 'Spoiler hidden — turn the spoiler setting off, or earn this trophy, to see its guide.';
    card.append(note);
  }

  const sources = document.createElement('p');
  sources.className = 'sources';
  const strong = document.createElement('strong');
  strong.textContent = 'Sources: ';
  sources.append(strong);
  (trophy.sources ?? []).forEach((s, i) => {
    if (i > 0) sources.append(document.createTextNode(' · '));
    const a = document.createElement('a');
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = s.name;
    sources.append(a);
  });
  card.append(sources);
  return card;
}

export function renderCards(cardsEl, trophies, earned, spoilersHidden, onToggle) {
  cardsEl.replaceChildren();
  for (const t of trophies) {
    cardsEl.append(createTrophyCard(t, earned, spoilersHidden, onToggle));
  }
}
