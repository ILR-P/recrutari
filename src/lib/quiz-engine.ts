import { ARCHETYPE_IDS, type ArchetypeId } from "@/data/archetypes";
import type { Scores } from "@/data/quiz";

/** Funcții pure pentru scor, fără React, ca să poată fi testate separat. */

export type ScoreBoard = Record<ArchetypeId, number>;

export function emptyBoard(): ScoreBoard {
  return Object.fromEntries(ARCHETYPE_IDS.map((id) => [id, 0])) as ScoreBoard;
}

export function addScores(board: ScoreBoard, delta: Scores): ScoreBoard {
  const next = { ...board };
  for (const id of ARCHETYPE_IDS) next[id] += delta[id] ?? 0;
  return next;
}

export function mergeScores(deltas: Scores[]): Scores {
  const merged: Scores = {};
  for (const delta of deltas) {
    for (const id of ARCHETYPE_IDS) {
      if (delta[id]) merged[id] = (merged[id] ?? 0) + delta[id];
    }
  }
  return merged;
}

/**
 * Câștigă arhetipul cu cel mai mare scor. La egalitate câștigă cel care a
 * primit mai multe puncte la cel mai recent pas, apoi ordinea din ARCHETYPE_IDS.
 */
export function getResult(board: ScoreBoard, history: Scores[]): ArchetypeId {
  const max = Math.max(...ARCHETYPE_IDS.map((id) => board[id]));
  const tied = ARCHETYPE_IDS.filter((id) => board[id] === max);
  if (tied.length === 1) return tied[0];

  for (let i = history.length - 1; i >= 0; i--) {
    const step = history[i];
    const scored = tied.filter((id) => (step[id] ?? 0) > 0);
    if (scored.length > 0) {
      return scored.reduce((best, id) => ((step[id] ?? 0) > (step[best] ?? 0) ? id : best));
    }
  }
  return tied[0];
}

/** Procente întregi care însumează exact 100 (metoda celui mai mare rest). */
export function toPercentages(board: ScoreBoard): ScoreBoard {
  const total = ARCHETYPE_IDS.reduce((sum, id) => sum + Math.max(0, board[id]), 0);
  const result = emptyBoard();
  if (total === 0) {
    ARCHETYPE_IDS.forEach((id, i) => {
      result[id] = Math.floor(100 / ARCHETYPE_IDS.length) + (i < 100 % ARCHETYPE_IDS.length ? 1 : 0);
    });
    return result;
  }

  const raw = ARCHETYPE_IDS.map((id) => ({ id, exact: (Math.max(0, board[id]) / total) * 100 }));
  let assigned = 0;
  for (const { id, exact } of raw) {
    result[id] = Math.floor(exact);
    assigned += result[id];
  }
  const byRemainder = [...raw].sort((a, b) => (b.exact % 1) - (a.exact % 1));
  for (let i = 0; i < 100 - assigned; i++) result[byRemainder[i].id] += 1;
  return result;
}

/** Arhetipul care primește cele mai multe puncte dintr-un singur răspuns. */
export function dominantArchetype(scores: Scores): ArchetypeId {
  return ARCHETYPE_IDS.reduce((best, id) => ((scores[id] ?? 0) > (scores[best] ?? 0) ? id : best), ARCHETYPE_IDS[0]);
}

export function rankArchetypes(board: ScoreBoard, winner?: ArchetypeId): ArchetypeId[] {
  return [...ARCHETYPE_IDS].sort((a, b) => {
    if (a === winner) return -1;
    if (b === winner) return 1;
    return board[b] - board[a];
  });
}
