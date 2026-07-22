import { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import { xpForQuality } from "../../lib/srs.js";

// Pares mínimos: discriminación auditiva de los contrastes de sonido
// donde más se equivocan los hispanohablantes (ship/sheep, think/sink,
// berry/very...), inspirado en el entrenamiento fonético perceptivo (HVPT).
export default function MinimalPairExercise({ card, speak, onComplete }) {
  const { pair } = card;
  const mountedRef = useRef(true);
  const timeoutRef = useRef(null);

  const [target] = useState(() => (Math.random() < 0.5 ? "a" : "b"));
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => speak(pair[target].en), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSelect(choice) {
    if (revealed) return;
    setSelected(choice);
    setRevealed(true);
    const correct = choice === target;
    const quality = correct ? 5 : 1;
    timeoutRef.current = setTimeout(() => {
      if (mountedRef.current) onComplete({ quality, correct, xp: xpForQuality(quality) });
    }, 1600);
  }

  return (
    <div className="center-col stack-6" style={{ width: "100%" }}>
      <p className="text-muted" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
        Pares mínimos · ¿Cuál escuchaste?
      </p>
      <button
        className="btn-icon-circle"
        style={{ background: "var(--color-ink)" }}
        onClick={() => speak(pair[target].en)}
        aria-label="Reproducir audio"
      >
        <Volume2 size={40} />
      </button>
      <div className="grid-2" style={{ width: "100%" }}>
        {["a", "b"].map((choice) => {
          const opt = pair[choice];
          let cls = "option-btn text-center";
          if (revealed) {
            if (choice === target) cls += " is-correct";
            else if (choice === selected) cls += " is-wrong";
            else cls += " is-faded";
          }
          return (
            <button key={choice} disabled={revealed} className={cls} onClick={() => handleSelect(choice)}>
              <p style={{ fontWeight: 700, fontSize: "1.1rem" }}>{opt.en}</p>
              <p className="text-muted" style={{ fontSize: "0.75rem" }}>
                {opt.es}
              </p>
            </button>
          );
        })}
      </div>
      {revealed && (
        <p className="text-muted text-center" style={{ fontSize: "0.75rem", padding: "0 8px" }}>
          {pair.tip}
        </p>
      )}
    </div>
  );
}
