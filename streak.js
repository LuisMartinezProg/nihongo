import { todayKey, daysBetween } from "./dates.js";

export const MILESTONES = [7, 14, 30, 50, 100, 200, 365];

// Si pasó más de un día sin practicar, consume congeladores de racha
// automáticamente (como el "streak freeze" de Duolingo) antes de romperla.
export function reconcileStreak(streak) {
  const today = todayKey();
  if (!streak.lastCompletedDate) return streak;
  const gap = daysBetween(streak.lastCompletedDate, today);
  if (gap <= 1) return streak;
  const missed = gap - 1;
  if (streak.freezesAvailable >= missed) {
    return {
      ...streak,
      freezesAvailable: streak.freezesAvailable - missed,
      freezeUsedCount: (streak.freezeUsedCount || 0) + missed,
    };
  }
  return { ...streak, current: 0 };
}

export function markTodayComplete(streak, xpToday, dailyGoal) {
  const today = todayKey();
  if (xpToday < dailyGoal) return streak;
  if (streak.lastCompletedDate === today) return streak;
  const wasYesterday = streak.lastCompletedDate && daysBetween(streak.lastCompletedDate, today) === 1;
  const newCurrent = wasYesterday || !streak.lastCompletedDate ? streak.current + 1 : 1;
  return {
    ...streak,
    current: newCurrent,
    longest: Math.max(streak.longest, newCurrent),
    lastCompletedDate: today,
    history: { ...streak.history, [today]: xpToday },
  };
}
