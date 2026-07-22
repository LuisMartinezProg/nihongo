import { VOCAB, CATEGORIES } from "../data/vocabulary.js";
import { todayKey } from "./dates.js";

const MASTER_REPS = 4;
const MASTER_INTERVAL_DAYS = 21;

export function masteredCount(progress) {
  return Object.values(progress.srs || {}).filter(
    (c) => c.repetition >= MASTER_REPS && c.interval >= MASTER_INTERVAL_DAYS
  ).length;
}

export function inProgressCount(progress) {
  return Object.keys(progress.srs || {}).length - masteredCount(progress);
}

export function dueTodayCount(progress) {
  const today = todayKey();
  return VOCAB.filter((v) => progress.srs[v.id] && progress.srs[v.id].nextReview <= today).length;
}

export function masteredByCategory(progress) {
  return CATEGORIES.map((cat) => {
    const items = VOCAB.filter((v) => v.cat === cat);
    const done = items.filter((v) => {
      const c = progress.srs[v.id];
      return c && c.repetition >= MASTER_REPS && c.interval >= MASTER_INTERVAL_DAYS;
    }).length;
    return { cat, done, total: items.length };
  });
}
