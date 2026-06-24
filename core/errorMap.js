// core/errorMap.js
// Analiza las estadísticas guardadas en core/progress.js para encontrar
// patrones de error: qué caracteres falla más el usuario y con cuáles
// los confunde. Alimenta la pantalla de Progreso y el modo de práctica
// enfocada ("Practicar mis errores").

import { getKanaStats } from "./progress.js";

/**
 * Devuelve los kana con peor desempeño (mayor tasa de error), tomando
 * en cuenta solo los que ya se intentaron al menos una vez y tienen
 * al menos un error registrado.
 */
export function getWorstKana(kanaList, limit = 8) {
  const withStats = kanaList
    .map((k) => ({ ...k, stats: getKanaStats(k.char) }))
    .filter((k) => k.stats.attempts > 0 && k.stats.errors > 0);

  withStats.sort((a, b) => {
    const rateA = a.stats.errors / a.stats.attempts;
    const rateB = b.stats.errors / b.stats.attempts;
    if (rateB !== rateA) return rateB - rateA;
    return b.stats.errors - a.stats.errors;
  });

  return withStats.slice(0, limit);
}

/**
 * Para las estadísticas de un kana, busca con cuál otro carácter lo
 * confunde más seguido el usuario (basado en las opciones incorrectas
 * elegidas durante el quiz de opción múltiple).
 */
export function getTopConfusion(stats) {
  const entries = Object.entries(stats.confusedWith || {});
  if (!entries.length) return null;
  entries.sort((a, b) => b[1] - a[1]);
  return { char: entries[0][0], count: entries[0][1] };
}

/**
 * Construye un grupo de kana para una sesión de práctica enfocada en
 * los errores más frecuentes del usuario. Esto es lo que se usa al
 * tocar "Practicar mis errores".
 */
export function buildFocusedPool(kanaList, limit = 10) {
  return getWorstKana(kanaList, limit).map(({ char, romaji }) => ({ char, romaji }));
}

window.NihonGoErrorMap = { getWorstKana, getTopConfusion, buildFocusedPool };
