// GTA 6 Trophy Guide — hand-in program (Node 22, standard library only).
//
// The guide is this directory's app/ folder: plain static files a browser opens
// at app/index.html (ES modules, CSS, no build step), fully offline — it loads
// nothing over the network, and its trophy list and guides live in
// app/data/trophies.json. This program hands the guide in: it copies app/ and
// screenshots/ from beside this file into the output directory and writes
// /output/dossier.json, the summary the judge reads (the screenshots, the first
// load's files and bytes, and the source), with the vendored make.fun library.
// Leave vendor/makefun-frontend.ts as it is: the scorer requires dossier.json
// to be byte for byte what its own copy writes.
//
// The program never removes the output directory itself: the grader mounts
// /output, and removing a mount fails the run. It creates the directory if
// needed and copies into it. Outside the grader, MAKEFUN_OUTPUT_DIR stands in
// for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// It refuses to hand in a broken entry: app/index.html must exist and
// screenshots/ must hold 3 or 4 images, each at most 256 KiB. Running it twice
// produces byte-identical output (plain copies plus a deterministic dossier).

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const MAX_SCREENSHOT_BYTES = 262144;

function fail(message: string): never {
  throw new Error('main.ts: refusing to hand in a broken entry: ' + message);
}

// app/index.html must exist: without it there is no guide to hand in.
if (!existsSync(join(here, 'app', 'index.html'))) fail('app/index.html is missing');

// The trophy file must exist and name all 55 trophies with a guide each:
// the gate checks exactly that, so a short list is a broken entry.
const trophiesPath = join(here, 'app', 'data', 'trophies.json');
if (!existsSync(trophiesPath)) fail('app/data/trophies.json is missing');
const trophiesDoc = JSON.parse(readFileSync(trophiesPath, 'utf8'));
const trophyList = trophiesDoc.trophies ?? trophiesDoc;
if (!Array.isArray(trophyList) || trophyList.length !== 55) {
  fail(`app/data/trophies.json names ${Array.isArray(trophyList) ? trophyList.length : 0} trophies, expected 55`);
}
for (const t of trophyList) {
  if (typeof t.name !== 'string' || !t.name.trim()) fail('a trophy has no name');
  if (typeof t.guide !== 'string' || !t.guide.trim()) fail(`trophy ${t.name} has no guide`);
}

// screenshots/ must hold 3 or 4 real images, each at most 256 KiB, or the
// gate refuses the entry outright. A file is only a real image if its first
// bytes are a JPEG or PNG magic number — a renamed text file is not.
const shotsDir = join(here, 'screenshots');
if (!existsSync(shotsDir)) fail('screenshots/ is missing');
const shots = readdirSync(shotsDir)
  .filter((name) => !name.startsWith('.'))
  .filter((name) => statSync(join(shotsDir, name)).isFile());
if (shots.length < 3 || shots.length > 4) {
  fail(`screenshots/ holds ${shots.length} images, expected 3 or 4`);
}
for (const name of shots) {
  const size = statSync(join(shotsDir, name)).size;
  if (size > MAX_SCREENSHOT_BYTES) {
    fail(`screenshots/${name} is ${size} bytes, over the 256 KiB limit`);
  }
  const magic = readFileSync(join(shotsDir, name)).subarray(0, 4);
  const isJpeg = magic[0] === 0xff && magic[1] === 0xd8 && magic[2] === 0xff;
  const isPng = magic[0] === 0x89 && magic[1] === 0x50 && magic[2] === 0x4e && magic[3] === 0x47;
  if (!isJpeg && !isPng) fail(`screenshots/${name} is not a JPEG or PNG image`);
}

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
cpSync(shotsDir, join(out, 'screenshots'), { recursive: true });

// The scorer's own caps: only text_max_bytes shapes the bytes; the others
// refuse an entry the scorer would refuse (more than 4 screenshots or one over
// 256 KiB; more than 993 files and directories in app/ or 48 MiB of app files).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);

console.log(`handed in ${shots.length} screenshots and app/ to ${out}`);
