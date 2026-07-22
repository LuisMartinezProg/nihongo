import { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import { VOCAB } from "../../data/vocabulary.js";
import { pickDistractors, shuffle } from "../../lib/sessionBuilder.js";
import { qualityFromMCQ, xpForQuality } from "../../lib/srs.js";

// Dirección inversa: ves el significado en español y debes reconocer,
// solo por audio, cuál de 4 opciones es la pronunciación correcta.
// A propósito NO se muestra el texto en inglés hasta responder, para
// que sea un ejercicio de oído y no de lectura.
export default function ChooseAudioExercise({ card, speak, onComplete }) {
  const { item } = card;
  const mountedRef = useRef(true);
  const timeoutRef = useRef(null);
  const startRef = useRef(Date.now());

  const [options] = useState(() => shuffle([item.en, ...pickDistractors(item, VOCAB, "en", 3)]));
  const [highlighted, setHighlighted] = useState(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function handlePreview(opt) {
    setHighlighted(opt);
    speak(opt);
  }

  function handleConfirm() {
    if (!highlighted || revealed) return;
    setRevealed(true);
    const correct = highlighted === item.en;
    const elapsed = Date.now() - startRef.current;
    const quality = qualityFromMCQ(correct, elapsed);
    timeoutRef.current = setTimeout(() => {
      if (mountedRef.current) onComplete({ quality, correct, xp: xpForQuality(quality) });
    }, 900);
  }

  return (
    <div className="center-col stack-6" style={{ width: "100%" }}>
      <p className="text-muted" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
        ¿Cómo se dice esto en inglés?
      </p>
      <p className="display-lg text-center">{item.es}</p>
      <div className="grid-2" style={{ width: "100%" }}>
        {options.map((opt, i) => {
          let cls = "option-btn center-col";
          if (revealed) {
            if (opt === item.en) cls += " is-correct";
            else if (opt === highlighted) cls += " is-wrong";
            else cls += " is-faded";
          } else if (opt === highlighted) {
            cls += " is-selected-preview";
          }
          return (
            <button key={opt} disabled={revealed} className={cls} onClick={() => handlePreview(opt)}>
              <Volume2 size={24} color="var(--color-primary)" />
              <span className="text-muted" style={{ fontSize: "0.7rem", marginTop: 6 }}>
                Opción {i + 1}
              </span>
            </button>
          );
        })}
      </div>
      {!revealed ? (
        <button className="btn btn-primary" disabled={!highlighted} onClick={handleConfirm}>
          Confirmar respuesta
        </button>
      ) : (
        <p className="text-muted" style={{ fontSize: "0.85rem" }}>
          {highlighted === item.en ? "¡Correcto! " : "Era: "}
          <strong style={{ color: "var(--color-ink)" }}>{item.en}</strong>
        </p>
      )}
    </div>
  );
}
