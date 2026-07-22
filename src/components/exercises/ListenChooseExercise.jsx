import { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import { VOCAB } from "../../data/vocabulary.js";
import { pickDistractors, shuffle } from "../../lib/sessionBuilder.js";
import { qualityFromMCQ, xpForQuality } from "../../lib/srs.js";

// Reconocimiento auditivo: escuchas la palabra/frase en inglés y eliges
// su significado en español entre 4 opciones. Es el primer contacto con
// cada palabra nueva (comprensión antes que producción).
export default function ListenChooseExercise({ card, speak, onComplete }) {
  const { item } = card;
  const mountedRef = useRef(true);
  const timeoutRef = useRef(null);
  const startRef = useRef(Date.now());

  const [options] = useState(() => shuffle([item.es, ...pickDistractors(item, VOCAB, "es", 3)]));
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => speak(item.en), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSelect(opt) {
    if (revealed) return;
    setSelected(opt);
    setRevealed(true);
    const correct = opt === item.es;
    const elapsed = Date.now() - startRef.current;
    const quality = qualityFromMCQ(correct, elapsed);
    timeoutRef.current = setTimeout(() => {
      if (mountedRef.current) onComplete({ quality, correct, xp: xpForQuality(quality) });
    }, 900);
  }

  return (
    <div className="center-col stack-6" style={{ width: "100%" }}>
      <p className="text-muted" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
        Escucha y elige la traducción correcta
      </p>
      <button className="btn-icon-circle" onClick={() => speak(item.en)} aria-label="Reproducir audio">
        <Volume2 size={40} />
      </button>
      <div className="stack-3" style={{ width: "100%" }}>
        {options.map((opt) => {
          let cls = "option-btn";
          if (revealed) {
            if (opt === item.es) cls += " is-correct";
            else if (opt === selected) cls += " is-wrong";
            else cls += " is-faded";
          }
          return (
            <button key={opt} disabled={revealed} className={cls} onClick={() => handleSelect(opt)}>
              {opt}
            </button>
          );
        })}
      </div>
      {revealed && (
        <p className="text-muted" style={{ fontSize: "0.85rem" }}>
          {selected === item.es ? "¡Correcto! " : "La respuesta era: "}
          <strong style={{ color: "var(--color-ink)" }}>{item.en}</strong>
        </p>
      )}
    </div>
  );
}
