import { Trophy, Flame, PartyPopper } from "lucide-react";

export default function SessionSummaryScreen({ sessionStats, streak, milestoneHit, onContinue }) {
  const accuracy = sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0;

  return (
    <div className="center-col text-center px-5" style={{ height: "100%", justifyContent: "center", gap: 20 }}>
      <div
        className="center-col"
        style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--color-warning-tint)", justifyContent: "center" }}
      >
        <Trophy size={40} color="var(--color-warning)" />
      </div>
      <div>
        <h2 className="display-lg">¡Sesión completa!</h2>
        <p className="text-muted" style={{ marginTop: 4 }}>
          Buen trabajo practicando hoy
        </p>
      </div>
      <div className="grid-3" style={{ width: "100%" }}>
        <div className="stat-tile">
          <p className="stat-tile__value">+{sessionStats.xpEarned}</p>
          <p className="stat-tile__label">XP ganado</p>
        </div>
        <div className="stat-tile">
          <p className="stat-tile__value">{accuracy}%</p>
          <p className="stat-tile__label">Precisión</p>
        </div>
        <div className="stat-tile">
          <p className="stat-tile__value" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
            <Flame size={16} color="var(--color-flame)" />
            {streak.current}
          </p>
          <p className="stat-tile__label">Racha</p>
        </div>
      </div>
      {milestoneHit && (
        <div
          style={{
            background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
            color: "white",
            borderRadius: "var(--radius-lg)",
            padding: "16px 20px",
            width: "100%",
          }}
        >
          <p style={{ fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <PartyPopper size={20} /> ¡{milestoneHit} días de racha!
          </p>
        </div>
      )}
      <button className="btn btn-primary" onClick={onContinue}>
        Continuar
      </button>
    </div>
  );
}
