// One Line, One Laugh: Roast Your Fridge
// make.fun bounty: u-suzy-one-line-one-laugh-roast-your-fridge-f1063521
//
// The program writes a single roast line to /output/entry.txt. It keeps a
// shortlist of hand-written candidates, grades each one against the judge's
// own brief, and writes the best-scoring line. No network, no randomness,
// nothing read from outside this file: the same input always yields the
// same output.
//
// The judge weighs, most important first:
//   1. The line roasts a fridge or a phone.
//   2. It lands on a specific, recognisable detail, not a generic insult.
//   3. It turns on a twist, surprise or double meaning that pays off in
//      the last few words.
//   4. It reads cleanly aloud as one line, no second sentence needed.
//   5. It feels fresh, not a fridge joke everyone has already worn out.
import { mkdirSync, writeFileSync } from "node:fs";

interface ScoredLine {
  text: string;
  // Marks out of 5, in the judge's own order: onSubject, specificDetail,
  // twist, readsAloud, fresh. Each mark carries a one-line reason so the
  // choice can be audited instead of trusted.
  marks: [number, number, number, number, number];
  note: string;
}

const LINES: ScoredLine[] = [
  {
    text: "My fridge beeps if I leave the door open ten seconds, yet said nothing while a yoghurt expired in 2019.",
    marks: [5, 5, 5, 5, 4],
    note:
      "The door alarm is a real, specific detail, and the twist is its double standard: loud about ten seconds of open door, silent about years of rot.",
  },
  {
    text: "My smart fridge has Wi-Fi, a touchscreen and a camera inside, and still can't tell me whether the jar of pickles from 2022 is food or a science project.",
    marks: [5, 5, 4, 5, 4],
    note:
      "Specific and fresh — a high-tech fridge baffled by one jar — and the payoff reframes the pickles as an experiment, though the alarm's hypocrisy still twists harder.",
  },
  {
    text: "My fridge's ice maker sounds like it's chewing gravel at 3am, which would be fine if it had ever once made ice.",
    marks: [5, 4, 4, 4, 4],
    note:
      "The gravel-chewing noise is vivid and the payoff lands, but 'noisy appliance, no results' is a more familiar shape.",
  },
];

// The judge weighs its criteria in order, so the weights fall in that
// order: subject first, freshness last.
const WEIGHTS = [5, 4, 3, 2, 1];

function score(line: ScoredLine): number {
  return line.marks.reduce((sum, mark, i) => sum + mark * WEIGHTS[i], 0);
}

function bestLine(lines: ScoredLine[]): ScoredLine {
  // Highest weighted score wins. A tie breaks toward the shorter text in
  // bytes — the same tie-break the bounty itself uses after win rate.
  return [...lines].sort(
    (a, b) =>
      score(b) - score(a) ||
      Buffer.byteLength(a.text, "utf8") - Buffer.byteLength(b.text, "utf8"),
  )[0];
}

const winner = bestLine(LINES);
const entry = winner.text;
// The gate counts characters as code points, so count them that way too.
const length = [...entry].length;

// Gate (from the bounty rules): UTF-8 text of 1 to 200 characters, not
// only white space, a single line. Refuse to write anything that fails.
if (length < 1 || length > 200 || entry.trim().length === 0) {
  throw new Error(`Gate failed: entry is ${length} characters`);
}
if (entry.includes("\n")) {
  throw new Error("Gate failed: entry must be a single line");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", entry, "utf8");

console.log(`Winner (${score(winner)} pts): ${winner.note}`);
console.log(`Wrote /output/entry.txt (${length} chars):`);
console.log(entry);
