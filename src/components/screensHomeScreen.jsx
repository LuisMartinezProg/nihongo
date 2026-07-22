import { Flame, Snowflake } from "lucide-react";
import { levelFromXP } from "../../lib/srs.js";
import { dueTodayCount, masteredCount, inProgressCount } from "../../lib/selectors.js";
import { todayKey, addDays } from "../../lib/dates.js";
import ProgressRing from "../ProgressRing.jsx";
import SoundWaveStreak from "../SoundWaveStreak.jsx";

export default function HomeScreen({ progress, onStart }) {
  const today = todayKey();
  const xpToday = progress.stats.dailyLog[today]?.xp || 0;
  const goalPct = xpToday / progress.settings.dailyGoalXP;
  const level = levelFromXP(progress.xp.total);
  const due = dueTodayCount(progress);
  const mastered = masteredCount(progress);
  const inProgress = inProgressCount(progress);

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(today, -(6 - i));
    return { date: d, done: !!progress.stats.dailyLog[d], isToday: d === today };
  });

  return (
    <div className="px-5 py-6 stack-6">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Flame size={28} color={progress.streak.current > 0 ? "var(--color-flame)" : "var(--color-ink-muted)"} />
          <span className="display-xl">{progress.streak.current}</span>
          <span className="text-muted">días</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="text-muted">
          <Snowflake size={16} />
          <span className="text-mono" style={{ fontSize: "0.8rem" }}>
            {progress.streak.freezesAvailable}
          </span>
        </div>
      </div>

      <SoundWaveStreak days={last7} />

      <div className="center-col stack-4" style={{ paddingTop: 8, paddingBottom: 8 }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ProgressRing pct={goalPct} />
          <div className="center-col" style={{ position: "absolute" }}>
            <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>{xpToday}</span>
            <span className="text-muted" style={{ fontSize: "0.7rem" }}>
              /{progress.settings.dailyGoalXP} XP
            </span>
          </div>
        </div>
        <p className="text-muted text-center" style={{ fontSize: "0.85rem" }}>
          {due > 0 ? `Tienes ${due} palabras para repasar hoy` : "Todo al día. ¡Aprende algo nuevo!"}
        </p>
        <button className="btn btn-primary" onClick={onStart}>
          {xpToday > 0 ? "Continuar práctica" : "Empezar práctica de hoy"}
        </button>
      </div>

      <div className="grid-3">
        <div className="stat-tile">
          <p className="stat-tile__value">{inProgress}</p>
          <p className="stat-tile__label">En progreso</p>
        </div>
        <div className="stat-tile">
          <p className="stat-tile__value">{mastered}</p>
          <p className="stat-tile__label">Dominadas</p>
        </div>
        <div className="stat-tile">
          <p className="stat-tile__value">Nv. {level}</p>
          <p className="stat-tile__label">{progress.xp.total} XP</p>
        </div>
      </div>
    </div>
  );
}
