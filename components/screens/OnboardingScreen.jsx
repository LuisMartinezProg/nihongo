import { useState } from "react";
import { Flame } from "lucide-react";
import { GOAL_PRESETS } from "../../data/goalPresets.js";

export default function OnboardingScreen({ onFinish }) {
  const [step, setStep] = useState(0);
  const [goalId, setGoalId] = useState("regular");

  function finish() {
    const preset = GOAL_PRESETS.find((g) => g.id === goalId) || GOAL_PRESETS[1];
    onFinish({ dailyGoalId: preset.id, dailyGoalXP: preset.xp, newPerDay: preset.newPerDay });
  }

  if (step === 0) {
    return (
      <div className="center-col text-center px-5 py-6" style={{ height: "100%", justifyContent: "center", gap: 16 }}>
        <div
          className="center-col"
          style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--color-primary-tint)", justifyContent: "center" }}
        >
          <Flame size={40} color="var(--color-primary)" />
        </div>
        <h1 className="display-xl">Practica inglés hablando y escuchando</h1>
        <p className="text-muted">
          Sin ejercicios de escribir. Solo reconocimiento de audio y práctica de habla, con repaso espaciado para
          que no se te olvide.
        </p>
        <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setStep(1)}>
          Continuar
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 py-6" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div className="center-col text-center" style={{ flex: 1, justifyContent: "center", gap: 16 }}>
        <h2 className="display-lg">¿Cuánto tiempo quieres practicar al día?</h2>
        <div className="stack-3" style={{ width: "100%", marginTop: 16 }}>
          {GOAL_PRESETS.map((g) => (
            <button
              key={g.id}
              className="option-btn"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderColor: goalId === g.id ? "var(--color-primary)" : undefined,
                background: goalId === g.id ? "var(--color-primary-tint)" : undefined,
              }}
              onClick={() => setGoalId(g.id)}
            >
              <span>{g.label}</span>
              <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                {g.desc}
              </span>
            </button>
          ))}
        </div>
      </div>
      <button className="btn btn-primary" onClick={finish}>
        Empezar a practicar
      </button>
    </div>
  );
}
