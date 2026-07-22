import { useCallback, useRef } from "react";

// Envuelve la Web Speech API del navegador. Si no está disponible
// (Firefox, Safari en algunos casos, o sin permiso de micrófono),
// `supported` será false y el componente que lo use debe mostrar
// un modo alterno (ver SpeakExercise).
export function useSpeechRecognition() {
  const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
  const recognitionRef = useRef(null);

  const listenOnce = useCallback(
    (lang) => {
      return new Promise((resolve, reject) => {
        if (!SR) {
          reject(new Error("not-supported"));
          return;
        }
        let settled = false;
        try {
          const recognition = new SR();
          recognitionRef.current = recognition;
          recognition.lang = lang || "en-US";
          recognition.interimResults = false;
          recognition.maxAlternatives = 3;
          recognition.onresult = (event) => {
            if (settled) return;
            settled = true;
            const alts = Array.from(event.results[0]).map((r) => r.transcript);
            resolve(alts);
          };
          recognition.onerror = (event) => {
            if (settled) return;
            settled = true;
            reject(new Error(event.error || "recognition-error"));
          };
          recognition.onend = () => {
            if (!settled) {
              settled = true;
              reject(new Error("no-speech"));
            }
          };
          recognition.start();
        } catch (e) {
          if (!settled) {
            settled = true;
            reject(e);
          }
        }
      });
    },
    [SR]
  );

  const cancel = useCallback(() => {
    try {
      recognitionRef.current && recognitionRef.current.abort();
    } catch (e) {
      /* no-op */
    }
  }, []);

  return { supported: !!SR, listenOnce, cancel };
}
