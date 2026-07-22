import { VOCAB } from "../data/vocabulary.js";
import { MINIMAL_PAIRS } from "../data/minimalPairs.js";
import { todayKey } from "./dates.js";

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickDistractors(item, pool, field, count = 3) {
  const sameCat = pool.filter((v) => v.id !== item.id && v.cat === item.cat);
  const others = pool.filter((v) => v.id !== item.id && v.cat !== item.cat);
  let chosen = shuffle(sameCat).slice(0, count);
  if (chosen.length < count) {
    chosen = chosen.concat(shuffle(others).slice(0, count - chosen.length));
  }
  return chosen.map((v) => v[field]);
}

// Arma la cola de la sesión: primero repasos vencidos, luego palabras
// nuevas (comprensión antes que producción), y si sobra espacio, repaso
// extra de palabras ya vistas para que la sesión nunca quede vacía.
export function buildSessionQueue(progress, size = 12) {
  const today = todayKey();
  const due = VOCAB.filter((v) => progress.srs[v.id] && progress.srs[v.id].nextReview <= today).sort(
    (a, b) => progress.srs[a.id].nextReview.localeCompare(progress.srs[b.id].nextReview)
  );
  const newItems = VOCAB.filter((v) => !progress.srs[v.id]);
  const newCap = progress.settings.newPerDay || 5;

  let queueItems = due.slice(0, size);
  let remaining = size - queueItems.length;
  if (remaining > 0) {
    queueItems = queueItems.concat(newItems.slice(0, Math.min(newCap, remaining)));
    remaining = size - queueItems.length;
  }
  if (remaining > 0) {
    const usedIds = new Set(queueItems.map((v) => v.id));
    const extra = VOCAB.filter((v) => progress.srs[v.id] && !usedIds.has(v.id));
    queueItems = queueItems.concat(shuffle(extra).slice(0, remaining));
  }

  const cards = queueItems.map((item) => {
    const isNew = !progress.srs[item.id];
    // Palabra nueva -> siempre empieza como reconocimiento auditivo
    // (comprensión antes que producción). Ya vista -> tipo variado.
    const pool = isNew ? ["listen-choose"] : ["listen-choose", "choose-audio", "speak"];
    const type = pool[Math.floor(Math.random() * pool.length)];
    return { item, type, key: `${item.id}-${type}-${Math.random().toString(36).slice(2)}` };
  });

  if (MINIMAL_PAIRS.length > 0 && cards.length >= 4) {
    const idx1 = progress.mpIndex % MINIMAL_PAIRS.length;
    const idx2 = (progress.mpIndex + 1) % MINIMAL_PAIRS.length;
    const mpCards = [idx1, idx2].map((i) => ({
      pair: MINIMAL_PAIRS[i],
      type: "minimal-pair",
      key: `mp-${MINIMAL_PAIRS[i].id}-${Math.random().toString(36).slice(2)}`,
    }));
    const pos1 = Math.min(3, cards.length);
    cards.splice(pos1, 0, mpCards[0]);
    const pos2 = Math.min(cards.length - 1, pos1 + 5);
    cards.splice(pos2, 0, mpCards[1]);
  }

  return cards;
}
