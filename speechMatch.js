// Compara lo que el reconocimiento de voz entendió contra la frase objetivo,
// usando distancia de Levenshtein normalizada como aproximación de similitud.
export function normalizeText(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

export function similarity(a, b) {
  const na = normalizeText(a);
  const nb = normalizeText(b);
  const maxLen = Math.max(na.length, nb.length, 1);
  return 1 - levenshtein(na, nb) / maxLen;
}

export function bestSimilarity(target, alternatives) {
  if (!alternatives || alternatives.length === 0) return 0;
  return Math.max(...alternatives.map((alt) => similarity(target, alt)));
}
