// services/stt.js
// Speech-to-Text usando la Web Speech API nativa (SpeechRecognition).
//
// IMPORTANTE — limitación real, no un bug:
// A diferencia del TTS (services/voice.js), que ya funciona sin
// conexión una vez que el navegador tiene voces instaladas, este
// reconocimiento de voz SÍ necesita internet en la mayoría de los
// casos: Chrome manda el audio a un servidor para transcribirlo.
// No hay forma de evitar esto con Web APIs nativas sin meter un
// modelo de reconocimiento de voz local (mucho más pesado y fuera
// del alcance de esta fase).
//
// OTRA LIMITACIÓN CONOCIDA (Android Chrome):
// A veces el reconocimiento se cierra solo, sin disparar ni
// "resultado" ni "error" — como si nunca hubiera pasado nada. Por eso
// abajo se usa una bandera (gotResultOrError) + un tiempo de
// seguridad: si el micrófono se cierra y nunca llegó ni resultado ni
// error, se avisa de todos modos. Así nunca se queda en silencio
// total después de hablar.

const SpeechRecognitionAPI =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = null;
let isListening = false;

export function isSTTSupported() {
  return !!SpeechRecognitionAPI;
}

/**
 * Empieza a escuchar al usuario. Llama a los callbacks según corresponda.
 * Garantiza que SIEMPRE se llame a onResult u onError una vez que el
 * micrófono se cierra (nunca queda en silencio sin avisar nada).
 * @param {object} handlers - { onResult(alternatives[]), onError(code), onEnd() }
 */
export function startListening({ onResult, onError, onEnd } = {}) {
  if (!SpeechRecognitionAPI) {
    if (onError) onError("not-supported");
    return false;
  }
  if (isListening) return false;

  recognition = new SpeechRecognitionAPI();
  recognition.lang = "ja-JP";
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 3;

  let gotResultOrError = false;
  let safetyTimer = null;

  recognition.onresult = (event) => {
    gotResultOrError = true;
    const alternatives = Array.from(event.results[0]).map((alt) =>
      alt.transcript.trim()
    );
    if (onResult) onResult(alternatives);
  };

  recognition.onerror = (event) => {
    gotResultOrError = true;
    isListening = false;
    if (onError) onError(event.error);
  };

  recognition.onend = () => {
    isListening = false;
    if (safetyTimer) clearTimeout(safetyTimer);

    // El navegador cerró el micrófono sin avisar nada: lo tratamos
    // como "no se detectó voz" para que el usuario siempre vea algo.
    if (!gotResultOrError && onError) {
      onError("no-speech");
    }
    if (onEnd) onEnd();
  };

  try {
    recognition.start();
    isListening = true;

    // Si el reconocimiento se queda "pegado" escuchando más de la
    // cuenta (pasa en algunos celulares), lo cerramos nosotros mismos
    // para que el botón no se quede atorado en "Escuchando...".
    safetyTimer = setTimeout(() => {
      if (isListening) recognition.stop();
    }, 6000);

    return true;
  } catch (err) {
    if (onError) onError("start-failed");
    return false;
  }
}

export function stopListening() {
  if (recognition && isListening) {
    recognition.stop();
  }
}

/**
 * Compara lo que el reconocimiento escuchó contra el carácter esperado.
 * Es una evaluación BÁSICA (texto exacto/contenido), no un análisis real
 * de fonética. Suficiente para confirmar que el usuario dijo el sonido
 * correcto, no para medir qué tan "bien pronunciado" estuvo.
 */
export function checkPronunciation(alternatives, targetChar) {
  return alternatives.some((t) => {
    const cleaned = t.replace(/[\s。、！？.,]/g, "");
    return cleaned.includes(targetChar);
  });
}

window.NihonGoSTT = {
  isSTTSupported,
  startListening,
  stopListening,
  checkPronunciation,
};
