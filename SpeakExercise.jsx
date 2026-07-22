import { useEffect, useRef, useState } from "react";
import { Volume2, Mic } from "lucide-react";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition.js";
import { bestSimilarity } from "../../lib/speechMatch.js";
import { qualityFromSimilarity, xpForQuality } from "../../lib/srs.js";

// Producción con feedback real: usa el reconocimiento de voz del navegador
// para verificar tu pronunciación. Si no está disponible (navegador sin
// soporte o sin permiso de micrófono), cae a un modo de autoevaluación
// para que la práctica nunca se bloquee.
export default function SpeakExercise({ card, speak, voiceLang, onComplete }) {
  const { item } = card;
  const sr = useSpeechRecognition();
  const mountedRef = useRef(true);
  const timeoutRef = useRef(null);

  const [phase, setPhase] = useState("idle"); // idle | listening | result | fallback | fallback-rated
  const [transcript, setTranscript] = useState("");
  const [resultTier, setResultTier] = useState(null); // great | good | retry
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      sr.cancel();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(() => speak(item.en), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleMicPress() {
    if (!sr.supported) {
      setPhase("fallback");
      return;
    }
    setPhase("listening");
    try {
      const alts = await sr.listenOnce(voiceLang);
      if (!mountedRef.current) return;
      const sim = bestSimilarity(item.en, alts);
      const quality = qualityFromSimilarity(sim);
      setTranscript(alts[0] || "");
      setResultTier(sim >= 0.85 ? "great" : sim >= 0.6 ? "good" : "retry");
      setPhase("result");
      timeoutRef.current = setTimeout(() => {
        if (mountedRef.current) onComplete({ quality, correct: sim >= 0.6, xp: xpForQuality(quality) });
      }, 1400);
    } catch (e) {
      if (!mountedRef.current) return;
      if (e.message === "no-speech" && attempts < 1) {
        setAttempts((a) => a + 1);
        setPhase("idle");
        return;
      }
      setPhase("fallback");
    }
  }

  function handleSelfRate(quality) {
    setPhase("fallback-rated");
    timeoutRef.current = setTimeout(() => {
      if (mountedRef.current) onComplete({ quality, correct: quality >= 4, xp: xpForQuality(quality) });
    }, 500);
  }

  return (
    <div className="center-col stack-6" style={{ width: "100%" }}>
      <p className="text-muted" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
        Escucha y repite en voz alta
      </p>
      <div className="text-center">
        <p className="display-lg">{item.en}</p>
        <p className="text-muted" style={{ marginTop: 4 }}>
          {item.es}
        </p>
      </div>
      <button
        className="btn-ghost"
        style={{ display: "flex", alignItems: "center", gap: 8 }}
        onClick={() => speak(item.en)}
      >
        <Volume2 size={18} /> Escuchar de nuevo
      </button>

      {(phase === "idle" || phase === "listening") && (
        <button
          className={`btn-icon-circle ${phase === "listening" ? "is-listening" : ""}`}
          disabled={phase === "listening"}
          onClick={handleMicPress}
          aria-label="Hablar"
        >
          <Mic size={40} />
        </button>
      )}
      {phase === "listening" && (
        <p className="text-muted" style={{ fontSize: "0.85rem" }}>
          Escuchando… habla ahora
        </p>
      )}

      {phase === "result" && (
        <div className="text-center">
          <p
            style={{
              fontWeight: 700,
              fontSize: "1.1rem",
              color:
                resultTier === "great"
                  ? "var(--color-success)"
                  : resultTier === "good"
                  ? "var(--color-warning)"
                  : "var(--color-error)",
            }}
          >
            {resultTier === "great"
              ? "¡Excelente pronunciación!"
              : resultTier === "good"
              ? "¡Bien! Sigue practicando"
              : "Intenta de nuevo la próxima vez"}
          </p>
          {transcript && (
            <p className="text-muted" style={{ fontSize: "0.85rem", marginTop: 4 }}>
              Escuché: "{transcript}"
            </p>
          )}
        </div>
      )}

      {phase === "fallback" && (
        <div className="center-col stack-4" style={{ width: "100%" }}>
          <p className="text-muted text-center" style={{ fontSize: "0.75rem" }}>
            No pude usar el micrófono en este dispositivo. Repite la frase en voz alta y cuéntanos cómo te fue.
          </p>
          <div className="row-3">
            <button className="option-btn" style={{ color: "var(--color-success)" }} onClick={() => handleSelfRate(5)}>
              😊 Fácil
            </button>
            <button className="option-btn" style={{ color: "var(--color-warning)" }} onClick={() => handleSelfRate(4)}>
              🙂 Normal
            </button>
            <button className="option-btn" style={{ color: "var(--color-error)" }} onClick={() => handleSelfRate(2)}>
              😅 Difícil
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
