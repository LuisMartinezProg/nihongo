import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { ACHIEVEMENTS } from "../../data/achievements.js";
import { todayKey, addDays } from "../../lib/dates.js";
import { masteredByCategory } from "../../lib/selectors.js";

const SKILL_LABELS = {
  "listen-choose": "Escuchar",
  "choose-audio": "Elegir audio",
  speak: "Hablar",
  "minimal-pair": "Pares mínimos",
};

export default function ProgressScreen({ progress }) {
  const today = todayKey();
  const chartData = Array.from({ length: 14 }, (_, i) => {
    const d = addDays(today, -(13 - i));
    const log = progress.stats.dailyLog[d];
    return { date: d.slice(5), xp: log?.xp || 0 };
  });

  const categoryStats = masteredByCategory(progress);

  return (
    <div className="px-5 py-6 stack-4" style={{ paddingBottom: 16 }}>
      <h2 className="display-lg">Tu progreso</h2>

      <div className="card">
        <p className="text-muted" style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: 8 }}>
          Últimos 14 días (XP)
        </p>
        <div style={{ width: "100%", height: 140 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={1} />
              <YAxis tick={{ fontSize: 10 }} width={24} />
              <Tooltip />
              <Bar dataKey="xp" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <p className="text-muted" style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: 10 }}>
          Precisión por tipo de ejercicio
        </p>
        <div className="stack-3">
          {Object.entries(SKILL_LABELS).map(([key, label]) => {
            const s = progress.stats.bySkill[key];
            const pct = s && s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
            return (
              <div key={key}>
                <div
                  style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: 4 }}
                  className="text-muted"
                >
                  <span>{label}</span>
                  <span>{s ? `${pct}%` : "—"}</span>
                </div>
                <div style={{ height: 8, background: "var(--color-surface-alt)", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: "var(--color-success)" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <p className="text-muted" style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: 10 }}>
          Palabras dominadas por categoría
        </p>
        <div className="stack-3">
          {categoryStats.map(({ cat, done, total }) => (
            <div key={cat} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
              <span>{cat}</span>
              <span className="text-muted text-mono">
                {done}/{total}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <p className="text-muted" style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: 10 }}>
          Logros
        </p>
        <div className="grid-4">
          {ACHIEVEMENTS.map((ach) => {
            const done = ach.check(progress);
            const Icon = ach.icon;
            return (
              <div key={ach.id} className="center-col" style={{ gap: 4 }}>
                <div
                  className="center-col"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    justifyContent: "center",
                    background: done ? "var(--color-warning-tint)" : "var(--color-surface-alt)",
                  }}
                >
                  <Icon size={22} color={done ? "var(--color-warning)" : "var(--color-ink-muted)"} />
                </div>
                <p
                  className="text-center"
                  style={{ fontSize: "0.6rem", lineHeight: 1.2, color: done ? "var(--color-ink)" : "var(--color-ink-muted)" }}
                >
                  {ach.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
