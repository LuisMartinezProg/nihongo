// Algoritmo de repetición espaciada (variante de SM-2, el mismo principio
// detrás de Anki/SuperMemo). Cada palabra se reprograma según qué tan bien
// respondiste, para que vuelva justo antes de que se te olvide.
import { todayKey, addDays } from "./dates.js";

export function sm2Update(prevState, quality) {
  let interval = prevState?.interval || 0;
  let repetition = prevState?.repetition || 0;
  let ef = prevState?.ef || 2.5;

  ef = Math.max(1.3, ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  let newRepetition;
  let newInterval;
  if (quality < 3) {
    newRepetition = 0;
    newInterval = 1;
  } else {
    newRepetition = repetition + 1;
    if (newRepetition === 1) newInterval = 1;
    else if (newRepetition === 2) newInterval = 6;
    else newInterval = Math.max(1, Math.round(interval * ef));
  }

  return {
    interval: newInterval,
    repetition: newRepetition,
    ef,
    nextReview: addDays(todayKey(), newInterval),
  };
}

export function xpForQuality(q) {
  if (q >= 5) return 10;
  if (q === 4) return 8;
  if (q === 3) return 6;
  return 2;
}

// MCQ: acierto rápido = mejor calidad de recuerdo que acierto lento.
export function qualityFromMCQ(correct, elapsedMs) {
  if (!correct) return 1;
  return elapsedMs < 4000 ? 5 : 4;
}

// Habla: calidad según similitud entre lo que dijiste y el objetivo.
export function qualityFromSimilarity(sim) {
  if (sim >= 0.85) return 5;
  if (sim >= 0.6) return 4;
  if (sim >= 0.35) return 2;
  return 1;
}

export function levelFromXP(xp) {
  return Math.max(1, Math.floor(1 + Math.sqrt(xp / 50)));
}

export function xpFloorForLevel(level) {
  return Math.pow(level - 1, 2) * 50;
}

export function xpCeilForLevel(level) {
  return Math.pow(level, 2) * 50;
}
