export function defaultProgress() {
  return {
    version: 1,
    onboarded: false,
    settings: {
      dailyGoalId: "regular",
      dailyGoalXP: 20,
      newPerDay: 5,
      voiceLang: "en-US",
      speechRate: 1,
    },
    xp: { total: 0 },
    streak: {
      current: 0,
      longest: 0,
      lastCompletedDate: null,
      freezesAvailable: 2,
      freezeUsedCount: 0,
      history: {},
    },
    srs: {},
    stats: {
      totalReviews: 0,
      totalCorrect: 0,
      bySkill: {},
      dailyLog: {},
      hadPerfectSession: false,
    },
    mpIndex: 0,
  };
}

// Rellena con valores por defecto cualquier campo faltante o dañado,
// para que datos viejos/corruptos en localStorage no rompan la app.
export function mergeWithDefaults(loaded) {
  const def = defaultProgress();
  if (!loaded || typeof loaded !== "object") return def;
  return {
    ...def,
    ...loaded,
    settings: { ...def.settings, ...(loaded.settings || {}) },
    xp: { ...def.xp, ...(loaded.xp || {}) },
    streak: {
      ...def.streak,
      ...(loaded.streak || {}),
      history: { ...((loaded.streak && loaded.streak.history) || {}) },
    },
    srs: { ...(loaded.srs || {}) },
    stats: {
      ...def.stats,
      ...(loaded.stats || {}),
      bySkill: { ...((loaded.stats && loaded.stats.bySkill) || {}) },
      dailyLog: { ...((loaded.stats && loaded.stats.dailyLog) || {}) },
    },
  };
}
