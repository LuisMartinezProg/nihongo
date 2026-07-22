import { useState } from "react";
import { GOAL_PRESETS } from "../../data/goalPresets.js";

const VOICE_OPTIONS = [
  { id: "en-US", label: "Inglés (EE. UU.)" },
  { id: "en-GB", label: "Inglés (Reino Unido)" },
];
const RATE_OPTIONS = [
  { v: 1, label: "Normal" },
  { v: 0.7, label: "Lenta" },
];

export default function SettingsScreen({ progress, onUpdateSettings, onReset }) {
  const [confirmingReset, setConfirmingReset] = useState(false);

  return (
    <div className="px-5 py-6 stack-6" style={{ paddingBottom: 16 }}>
      <h2 className="display-lg">Ajustes</h2>

      <div>
        <p className="text-muted" style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: 8 }}>
          Meta diaria
        </p>
        <div className="grid-3">
          {GOAL_PRESETS.map((g) => (
            <button
              key={g.id}
              className="option-btn center-col"
              style={{
                borderColor: progress.settings.dailyGoalId === g.id ? "var(--color-primary)" : undefined,
                background: progress.settings.dailyGoalId === g.id ? "var(--color-primary-tint)" : undefined,
              }}
              onClick={() => onUpdateSettings({ dailyGoalId: g.id, dailyGoalXP: g.xp, newPerDay: g.newPerDay })}
            >
              <span style={{ fontWeight: 700 }}>{g.label}</span>
              <span className="text-muted" style={{ fontSize: "0.65rem" }}>
                {g.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-muted" style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: 8 }}>
          Acento de voz
        </p>
        <div className="grid-2">
          {VOICE_OPTIONS.map((v) => (
            <button
              key={v.id}
              className="option-btn text-center"
              style={{
                borderColor: progress.settings.voiceLang === v.id ? "var(--color-primary)" : undefined,
                background: progress.settings.voiceLang === v.id ? "var(--color-primary-tint)" : undefined,
                color: progress.settings.voiceLang === v.id ? "var(--color-primary)" : undefined,
              }}
              onClick={() => onUpdateSettings({ voiceLang: v.id })}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-muted" style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: 8 }}>
          Velocidad de voz
        </p>
        <div className="grid-2">
          {RATE_OPTIONS.map((r) => (
            <button
              key={r.v}
              className="option-btn text-center"
              style={{
                borderColor: progress.settings.speechRate === r.v ? "var(--color-primary)" : undefined,
                background: progress.settings.speechRate === r.v ? "var(--color-primary-tint)" : undefined,
                color: progress.settings.speechRate === r.v ? "var(--color-primary)" : undefined,
              }}
              onClick={() => onUpdateSettings({ speechRate: r.v })}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ paddingTop: 16, borderTop: "1px solid var(--color-surface-alt)" }}>
        {!confirmingReset ? (
          <button className="btn-ghost" style={{ color: "var(--color-error)" }} onClick={() => setConfirmingReset(true)}>
            Reiniciar todo mi progreso
          </button>
        ) : (
          <div style={{ background: "var(--color-error-tint)", borderRadius: "var(--radius-lg)", padding: 16 }} className="stack-3">
            <p style={{ fontSize: "0.85rem", color: "var(--color-error)" }}>
              Esto borrará tu racha, XP y todo tu progreso. No se puede deshacer.
            </p>
            <div className="row-3">
              <button className="btn" style={{ flex: 1, background: "white" }} onClick={() => setConfirmingReset(false)}>
                Cancelar
              </button>
              <button
                className="btn"
                style={{ flex: 1, background: "var(--color-error)", color: "white" }}
                onClick={() => {
                  onReset();
                  setConfirmingReset(false);
                }}
              >
                Sí, reiniciar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
