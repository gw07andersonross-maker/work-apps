#!/usr/bin/env node
/*
 * Builds the timetables in ../timetables into HGS_Cover_Planner.html.
 *
 *   cd tools && npm install && node build-timetables.js
 *
 * - The spreadsheet with "master" in its file name becomes the built-in master (BUILTIN).
 *   With no master in the folder, the current built-in master is kept.
 * - Every other spreadsheet becomes a built-in department timetable (BUILTIN_DEPTS),
 *   checked against the master for the department its name points to.
 * The parser is the planner's own (the TT script inside the HTML), so results match an upload in the page.
 */
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const ROOT = path.resolve(__dirname, '..');
const HTML = path.join(ROOT, 'HGS_Cover_Planner.html');
const DIR = path.join(ROOT, 'timetables');

// Load the planner's own parser out of the page
const html = fs.readFileSync(HTML, 'utf8');
const start = html.indexOf('var TT = (function');
const end = html.indexOf("if (typeof module !== 'undefined') module.exports = TT;");
if (start < 0 || end < 0) throw new Error('Could not find the TT parser in ' + HTML);
const mod = { exports: null };
new Function('module', html.slice(start, end) + '\nmodule.exports = TT;')(mod);
const TT = mod.exports;

// Same as sheetGrid / readWorkbook in the page
function sheetGrid(ws) {
  if (!ws || !ws['!ref']) return [];
  const rg = XLSX.utils.decode_range(ws['!ref']); const g = [];
  for (let r = 0; r <= rg.e.r; r++) { const row = []; for (let c = 0; c <= rg.e.c; c++) { const cell = ws[XLSX.utils.encode_cell({ r, c })]; row.push(cell && cell.v != null ? cell.v : null); } g.push(row); }
  return g;
}
function readWorkbook(file) {
  const wb = XLSX.read(fs.readFileSync(file), { type: 'buffer' });
  const out = [];
  const SKIP = /room|data|feed|cover|census|availab|back|copy|old|sort/i;
  wb.SheetNames.forEach(n => { if (SKIP.test(n) && !/master tt/i.test(n)) return; const p = TT.parseGrid(sheetGrid(wb.Sheets[n]), n); if (p && p.rows.length) { p.sheet = n; out.push(p); } });
  if (!out.length) return out;
  return [out.find(p => /^master tt$/i.test(p.sheet.trim())) || out.find(p => /master|timetable|\btt\b/i.test(p.sheet)) || out.sort((x, y) => y.rows.length - x.rows.length)[0]];
}

// JSON safe inside a <script> and kept ASCII, like the existing data line
const js = o => JSON.stringify(o).replace(/</g, '\\u003c').replace(/[\u007f-\uffff]/g, c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const files = (fs.existsSync(DIR) ? fs.readdirSync(DIR) : []).filter(f => /\.(xlsx|xlsm|xls)$/i.test(f) && !f.startsWith('~$')).sort();
const masters = files.filter(f => /master/i.test(f));
if (masters.length > 1) throw new Error('More than one master in timetables/: ' + masters.join(', ') + '. Keep only the current one.');

let out = html;
const replaceLine = (name, value) => {
  const re = new RegExp('^const ' + name + ' = .*$', 'm');
  if (!re.test(out)) throw new Error('No "const ' + name + ' = " line in the page');
  out = out.replace(re, () => 'const ' + name + ' = ' + value + ';');
};

if (masters.length) {
  const f = masters[0], all = readWorkbook(path.join(DIR, f));
  if (!all.length) throw new Error(f + ': no timetable found (needs the MONDAY…FRIDAY header with period numbers underneath).');
  replaceLine('BUILTIN', js({ name: f.replace(/\.[^.]+$/, ''), parsed: [all[0]] }));
  console.log('Master: ' + f + ' (' + all[0].rows.length + ' staff rows from sheet "' + all[0].sheet + '")');
} else console.log('Master: none in timetables/, keeping the current built-in master');

const depts = [];
for (const f of files.filter(f => !masters.includes(f))) {
  const all = readWorkbook(path.join(DIR, f));
  if (!all.length) { console.warn('Skipped ' + f + ': no timetable found'); continue; }
  const name = f.replace(/\.[^.]+$/, '');
  depts.push({ id: 'repo-' + slug(name), kind: 'dept', builtin: true, name, parsed: all });
  console.log('Department: ' + f + ' (' + all[0].rows.length + ' staff rows from sheet "' + all[0].sheet + '")');
}
replaceLine('BUILTIN_DEPTS', js(depts));

fs.writeFileSync(HTML, out);
console.log('Updated ' + path.relative(ROOT, HTML));
