// core/srs.js
// Versión BÁSICA de repetición espaciada para la Fase 1.
// Usa un sistema tipo Leitner de 5 cajas (0 a 4). Una respuesta correcta
// sube de caja, una incorrecta manda directo a la caja 0. Las cajas más
// bajas tienen más probabilidad de aparecer en el próximo quiz.
//
// Nota: esto NO es el sistema final de 6 etapas con intervalos de días
// que pide el proyecto completo — esa versión más completa llega en una
// fase posterior. Por ahora la repetición ocurre dentro de la misma
// sesión de práctica, no entre días.

import { getKanaBox, setKanaBox } from "./progress.js";

export const MASTERY_BOX = 4;

function weightForBox(box) {
  // Caja 0 -> peso 5 (aparece mucho), caja 4 -> peso 1 (aparece poco)
  return MASTERY_BOX + 1 - box;
}

/**
 * Elige el siguiente kana a preguntar, dando más peso a los que el
 * usuario tiene en cajas bajas (los que más falla o no ha visto).
 */
export function pickNextKana(kanaList, excludeChar = null) {
  const pool = excludeChar
    ? kanaList.filter((k) => k.char !== excludeChar)
    : kanaList;

  const weighted = pool.map((k) => ({
    item: k,
    weight: weightForBox(getKanaBox(k.char)),
  }));

  const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0);
  let r = Math.random() * totalWeight;

  for (const w of weighted) {
    r -= w.weight;
    if (r <= 0) return w.item;
  }
  return pool[0]; // fallback de seguridad
}

/**
 * Registra la respuesta del usuario y mueve el kana de caja.
 */
export function recordAnswer(char, wasCorrect) {
  const currentBox = getKanaBox(char);
  if (wasCorrect) {
    setKanaBox(char, Math.min(currentBox + 1, MASTERY_BOX));
  } else {
    setKanaBox(char, 0);
  }
}

export function isMastered(char) {
  return getKanaBox(char) >= MASTERY_BOX;
}

/**
 * Genera 3 opciones incorrectas (romaji) distintas a la correcta, para
 * armar el quiz de selección múltiple.
 */
export function getDistractors(kanaList, correctChar, count = 3) {
  const options = kanaList
    .filter((k) => k.char !== correctChar)
    .map((k) => k.romaji);

  const shuffled = options.sort(() => Math.random() - 0.5);
  const unique = [...new Set(shuffled)];
  return unique.slice(0, count);
}

window.NihonGoSRS = {
  MASTERY_BOX,
  pickNextKana,
  recordAnswer,
  isMastered,
  getDistractors,
};
