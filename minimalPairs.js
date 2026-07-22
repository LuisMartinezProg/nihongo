// Pares mínimos: contrastes de sonido donde más se equivocan los hispanohablantes
// (documentado en fonética contrastiva y en estudios de HVPT para hispanohablantes).
// Formato: [inglés A, español A, inglés B, español B, tip de pronunciación]
const RAW = [
  ["ship", "barco", "sheep", "oveja", "La 'i' de ship es corta y relajada; la de sheep es larga y tensa."],
  ["bit", "un poco", "beat", "golpe o ritmo", "Mismo patrón: vocal corta contra vocal larga."],
  ["live", "vivir", "leave", "irse", "Live usa vocal corta; leave alarga el sonido."],
  ["full", "lleno", "fool", "tonto", "Full es corta y relajada; fool se alarga más."],
  ["bat", "murciélago", "bet", "apuesta", "Bat abre más la boca que bet."],
  ["man", "hombre", "men", "hombres", "En español suenan casi igual; en inglés son distintas."],
  ["cap", "gorra", "cup", "taza", "Cup tiene un sonido más neutro y relajado, como una 'a' corta."],
  ["berry", "baya", "very", "muy", "En español b y v suenan igual; en inglés son sonidos distintos."],
  ["think", "pensar", "sink", "hundirse", "Think lleva la lengua entre los dientes (sonido 'th')."],
  ["three", "tres", "tree", "árbol", "Compara el sonido 'th' contra la 't'."],
  ["thin", "delgado", "tin", "lata", "Mismo contraste: 'th' contra 't'."],
  ["zoo", "zoológico", "sue", "demandar", "Zoo vibra (sonido 'z'); sue no vibra (sonido 's')."],
];

export const MINIMAL_PAIRS = RAW.map(([aEn, aEs, bEn, bEs, tip], i) => ({
  id: `mp${String(i + 1).padStart(2, "0")}`,
  a: { en: aEn, es: aEs },
  b: { en: bEn, es: bEs },
  tip,
}));
