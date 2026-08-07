#!/usr/bin/env node
// QA for the HB Daily word list. No dependencies. Run: node scripts/qa-words.mjs
// Checks hb-words.csv for format problems and verifies the WORDS array embedded
// in hb-daily.html matches the CSV exactly. The list lives in both places and
// nothing else enforces that they stay in step.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const ok = (msg) => console.log("  ok  " + msg);

// ---- parse CSV (quoted fields, embedded commas/quotes) ----
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQ = false;
      } else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const csvText = readFileSync(join(root, "hb-words.csv"), "utf8");
const rows = parseCSV(csvText);
const header = rows.shift();
if (header.join(",") !== "day,word,length,category,clue,blurb")
  errors.push("CSV header is wrong: " + header.join(","));

const days = rows.filter((r) => r.length > 1);
if (days.length < 90) errors.push(`Only ${days.length} days in CSV, need 90 of runway`);

const seen = new Set();
days.forEach((r, i) => {
  const [day, word, len, category, clue, blurb] = r;
  const n = i + 1;
  if (Number(day) !== n) errors.push(`Row ${n}: day column says ${day}`);
  if (!/^[A-Z]{4,7}$/.test(word)) errors.push(`Day ${day}: word "${word}" must be 4-7 letters A-Z`);
  if (Number(len) !== word.length) errors.push(`Day ${day} ${word}: length column ${len} != ${word.length}`);
  if (seen.has(word)) errors.push(`Day ${day}: duplicate word ${word}`);
  seen.add(word);
  for (const [name, v] of [["category", category], ["clue", clue], ["blurb", blurb]]) {
    if (!v || !v.trim()) errors.push(`Day ${day} ${word}: empty ${name}`);
    if (/[\u2013\u2014]/.test(v)) errors.push(`Day ${day} ${word}: em/en dash in ${name}`);
    if (/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE0F}]/u.test(v)) errors.push(`Day ${day} ${word}: emoji in ${name}`);
  }
});
if (!errors.length) ok(`CSV: ${days.length} days, all words 4-7 letters, unique, no banned characters`);

// ---- extract the WORDS array from hb-daily.html ----
const html = readFileSync(join(root, "hb-daily.html"), "utf8");
const m = html.match(/var WORDS = \[([\s\S]*?)\n\];/);
if (!m) {
  errors.push("Could not find the WORDS array in hb-daily.html");
} else {
  const entries = [];
  for (const line of m[1].split("\n")) {
    const t = line.trim();
    if (!t.startsWith("[")) continue;
    try {
      entries.push(JSON.parse(t.replace(/,\s*$/, "")));
    } catch {
      errors.push("Unparseable WORDS line: " + t.slice(0, 60));
    }
  }
  if (entries.length !== days.length)
    errors.push(`HTML has ${entries.length} words, CSV has ${days.length}. The two lists are out of step.`);
  const limit = Math.min(entries.length, days.length);
  for (let i = 0; i < limit; i++) {
    const [word, clue, category, blurb] = entries[i];
    const [, cWord, , cCategory, cClue, cBlurb] = days[i];
    if (word !== cWord) { errors.push(`Day ${i + 1}: HTML says ${word}, CSV says ${cWord}`); continue; }
    if (clue !== cClue) errors.push(`Day ${i + 1} ${word}: clue differs between HTML and CSV`);
    if (category !== cCategory) errors.push(`Day ${i + 1} ${word}: category differs between HTML and CSV`);
    if (blurb !== cBlurb) errors.push(`Day ${i + 1} ${word}: blurb differs between HTML and CSV`);
  }
  if (!errors.length) ok(`HTML WORDS array matches the CSV exactly (${entries.length} entries)`);
}

if (errors.length) {
  console.error("FAIL: " + errors.length + " problem(s)");
  errors.forEach((e) => console.error("  - " + e));
  process.exit(1);
}
console.log("PASS: word list QA clean");
