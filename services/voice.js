// services/voice.js
// Text-to-Speech usando la Web Speech API nativa del navegador.
// No depende de ninguna librería externa ni de conexión a internet
// una vez que el navegador ya tiene voces instaladas.

let japaneseVoice = null;
let voicesReady = false;

function loadVoices() {
  const voices = speechSynthesis.getVoices();
  if (!voices.length) return;
  japaneseVoice =
    voices.find((v) => v.lang === "ja-JP") ||
    voices.find((v) => v.lang.startsWith("ja")) ||
    null;
  voicesReady = true;
}

// Chrome a veces carga las voces de forma asíncrona. Si no están listas
// al inicio, esperamos el evento y reintentamos.
if ("speechSynthesis" in window) {
  loadVoices();
  speechSynthesis.addEventListener("voiceschanged", loadVoices);
}

/**
 * Lee en voz alta un texto en japonés.
 * @param {string} text - texto en japonés (hiragana, katakana, kanji, frase)
 * @param {object} opts - { rate: 0.1-2 (velocidad), onEnd: fn }
 */
export function speakJapanese(text, opts = {}) {
  if (!("speechSynthesis" in window)) {
    console.warn("[voice] este navegador no soporta speechSynthesis");
    if (opts.onEnd) opts.onEnd();
    return false;
  }

  // Cancelamos cualquier lectura anterior para que no se encimen audios
  // si el usuario toca el botón varias veces rápido.
  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  utterance.rate = opts.rate || 0.9; // un poco más lento, ayuda a estudiar
  if (japaneseVoice) utterance.voice = japaneseVoice;
  if (opts.onEnd) utterance.onend = opts.onEnd;

  speechSynthesis.speak(utterance);
  return true;
}

export function isVoiceSupported() {
  return "speechSynthesis" in window;
}

window.NihonGoVoice = { speakJapanese, isVoiceSupported };
