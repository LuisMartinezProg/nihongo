import { useCallback, useEffect, useState } from "react";
import { loadProgress, saveProgress } from "../lib/storage.js";
import { defaultProgress, mergeWithDefaults } from "../lib/progressModel.js";
import { reconcileStreak, markTodayComplete, MILESTONES } from "../lib/streak.js";
import { sm2Update } from "../lib/srs.js";
import { todayKey } from "../lib/dates.js";

// Hook central de estado persistente: carga/guarda el progreso del usuario
// y expone las acciones que lo modifican. La UI (App.jsx) solo llama estas
// funciones, sin conocer los detalles de localStorage ni del algoritmo SRS.
export function useProgress() {
  const [progress, setProgress] = useState(null);
  const [ready, setReady] = useState(false);
  const [milestoneHit, setMilestoneHit] = useState(null);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    const loaded = loadProgress();
    let merged = mergeWithDefaults(loaded);
    merged = { ...merged, streak: reconcileStreak(merged.streak) };
    setProgress(merged);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || !progress) return;
    const t = setTimeout(() => {
      const ok = saveProgress(progress);
      setSaveError(!ok);
    }, 300);
    return () => clearTimeout(t);
  }, [progress, ready]);

  const finishOnboarding = useCallback((settingsPatch) => {
    setProgress((prev) => ({
      ...prev,
      onboarded: true,
      settings: { ...prev.settings, ...settingsPatch },
    }));
  }, []);

  const updateSettings = useCallback((patch) => {
    setProgress((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));
  }, []);

  const resetProgress = useCallback(() => {
    const fresh = defaultProgress();
    fresh.onboarded = true;
    setProgress(fresh);
  }, []);

  const bumpMinimalPairIndex = useCallback((by, mod) => {
    setProgress((prev) => ({ ...prev, mpIndex: (prev.mpIndex + by) % Math.max(1, mod) }));
  }, []);

  const markPerfectSession = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      stats: { ...prev.stats, hadPerfectSession: true },
    }));
  }, []);

  const clearMilestone = useCallback(() => setMilestoneHit(null), []);

  // Aplica el resultado de un ejercicio completado: actualiza SRS, XP,
  // racha y estadísticas. Se calcula a partir del `progress` actual (no
  // con la forma "updater") a propósito, para no anidar efectos
  // secundarios (setMilestoneHit) dentro de un actualizador de estado.
  const applyCardResult = useCallback(
    (card, result) => {
      const { quality, correct, xp } = result;
      const today = todayKey();

      let newSrs = progress.srs;
      if (card.type !== "minimal-pair") {
        const item = card.item;
        const prevCard = progress.srs[item.id] || {};
        const updated = sm2Update(prevCard, quality);
        newSrs = {
          ...progress.srs,
          [item.id]: {
            ...updated,
            timesSeen: (prevCard.timesSeen || 0) + 1,
            timesCorrect: (prevCard.timesCorrect || 0) + (correct ? 1 : 0),
          },
        };
      }

      const dayLog = progress.stats.dailyLog[today] || { xp: 0, reviews: 0, correct: 0 };
      const newDayLog = {
        xp: dayLog.xp + xp,
        reviews: dayLog.reviews + 1,
        correct: dayLog.correct + (correct ? 1 : 0),
      };
      const bySkillPrev = progress.stats.bySkill[card.type] || { correct: 0, total: 0 };
      const newBySkill = {
        ...progress.stats.bySkill,
        [card.type]: {
          correct: bySkillPrev.correct + (correct ? 1 : 0),
          total: bySkillPrev.total + 1,
        },
      };

      const prevStreakCurrent = progress.streak.current;
      const newStreak = markTodayComplete(progress.streak, newDayLog.xp, progress.settings.dailyGoalXP);
      if (MILESTONES.includes(newStreak.current) && newStreak.current !== prevStreakCurrent) {
        setMilestoneHit(newStreak.current);
      }

      setProgress({
        ...progress,
        srs: newSrs,
        xp: { total: progress.xp.total + xp },
        streak: newStreak,
        stats: {
          ...progress.stats,
          totalReviews: progress.stats.totalReviews + 1,
          totalCorrect: progress.stats.totalCorrect + (correct ? 1 : 0),
          bySkill: newBySkill,
          dailyLog: { ...progress.stats.dailyLog, [today]: newDayLog },
        },
      });
    },
    [progress]
  );

  return {
    progress,
    ready,
    milestoneHit,
    saveError,
    finishOnboarding,
    updateSettings,
    resetProgress,
    bumpMinimalPairIndex,
    applyCardResult,
    markPerfectSession,
    clearMilestone,
  };
}
