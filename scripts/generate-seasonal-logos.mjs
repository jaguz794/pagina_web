import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// Keep the original artwork embedded so each monthly logo is a self-contained asset.
const source = await readFile('assets/logo-popular.webp');
const original = `data:image/webp;base64,${source.toString('base64')}`;
const output = 'assets/seasonal-logos';
await mkdir(output, { recursive: true });

const roundLetter = (fill, artwork) => `
  <ellipse cx="342" cy="160" rx="33" ry="38" fill="${fill}" stroke="#ffffff" stroke-width="7"/>
  <ellipse cx="342" cy="160" rx="28" ry="33" fill="none" stroke="#176a46" stroke-opacity=".34" stroke-width="2"/>
  <g transform="translate(16 0)">${artwork}</g>`;

const motifs = {
  'new-year': roundLetter('#087f6b', '<path d="m326 135 4 16 16 4-16 4-4 16-4-16-16-4 16-4Z" fill="#ffe483"/><circle cx="313" cy="173" r="3" fill="#fff"/><circle cx="342" cy="145" r="3" fill="#fff"/>'),
  carnival: roundLetter('#77449a', '<path d="M301 145q25 7 50-8M302 177q25-16 49-2" fill="none" stroke="#ffce47" stroke-width="8"/><circle cx="316" cy="156" r="5" fill="#fff"/><circle cx="337" cy="164" r="5" fill="#fff"/>'),
  women: roundLetter('#945579', '<g fill="#fff2f7"><ellipse cx="326" cy="144" rx="7" ry="12"/><ellipse cx="326" cy="176" rx="7" ry="12"/><ellipse cx="310" cy="160" rx="12" ry="7"/><ellipse cx="342" cy="160" rx="12" ry="7"/></g><circle cx="326" cy="160" r="8" fill="#f5c756"/>'),
  easter: roundLetter('#6c8d63', '<path d="M326 133c-19 7-25 24-18 37 4 9 12 13 18 17 6-4 14-8 18-17 7-13 1-30-18-37Z" fill="#fff6db"/><path d="M310 160q16 9 32 0M315 171q11-7 22 0" stroke="#80a06e" stroke-width="4" fill="none"/>'),
  children: roundLetter('#268da2', '<path d="M309 160q17-15 34 0v11q-17 17-34 0Z" fill="#ffe47a"/><circle cx="319" cy="158" r="3" fill="#254c55"/><circle cx="334" cy="158" r="3" fill="#254c55"/><path d="M319 169q7 7 15 0" fill="none" stroke="#254c55" stroke-width="3" stroke-linecap="round"/>'),
  mothers: roundLetter('#bc5477', '<path d="M326 181c-24-16-27-31-14-37 7-3 12 1 14 6 3-5 8-9 15-6 13 6 10 21-15 37Z" fill="#fff4f0"/>'),
  fathers: roundLetter('#315d83', '<path d="M308 149q-8 11 0 22l18-8 18 8q8-11 0-22l-18 8Z" fill="#e5eef6"/><circle cx="326" cy="160" r="5" fill="#f5c55f"/>'),
  love: roundLetter('#a83f62', '<path d="M326 181c-21-14-25-26-17-33 5-5 12-3 17 4 5-7 12-9 17-4 8 7 4 19-17 33Z" fill="#fff1e4"/><path d="M317 140c1-5 5-8 9-8" fill="none" stroke="#ffd783" stroke-width="3" stroke-linecap="round"/>'),
  halloween: `<g transform="translate(16 0)"><g stroke="#fff" stroke-width="7" stroke-linejoin="round"><path d="M326 121q-5-10 3-16" fill="none" stroke="#185d37" stroke-width="5"/><path d="M326 123c-18-9-34 4-34 30 0 25 17 44 34 43 17 1 34-18 34-43 0-26-16-39-34-30Z" fill="#f28223"/></g><path d="M310 132q-7 20 0 45M342 132q7 20 0 45" fill="none" stroke="#ca5b17" stroke-width="3" opacity=".75"/><path d="m310 152 8-7 2 12Zm22 5 3-12 8 7ZM312 169q14 17 28 0l-6 3-6-4-6 4Z" fill="#3c2d31"/></g>`,
  christmas: `<path d="M32 53C42 30 80 10 118 15c20 2 30 13 43 24-22-5-42 0-54 17Z" fill="#c9353b" stroke="#83232b" stroke-width="4" stroke-linejoin="round"/><path d="M25 51q63-18 122-1 9 3 7 11-2 8-12 6Q87 55 33 68q-11 2-14-6-2-8 6-11Z" fill="#fffdf7" stroke="#d3ded7" stroke-width="3"/><circle cx="164" cy="40" r="13" fill="#fffdf7" stroke="#d3ded7" stroke-width="3"/>`,
};

for (const [name, motif] of Object.entries(motifs)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 327" role="img" aria-label="Supermercados Popular">
  <image href="${original}" width="720" height="327"/>
  ${motif}
</svg>`;
  await writeFile(join(output, `${name}.svg`), svg);
}
