// ui/profile.js
// Pantalla real de Perfil: nivel/XP, racha y logros. Reemplaza a
// renderPerfilPlaceholder en ui/placeholders.js.

import { t } from "../core/i18n.js";
import { renderLangSwitchHTML, bindLangSwitch } from "./langSwitch.js";
import {
  getProgress,
  getLevel,
  getXpIntoLevel,
  isAchievementUnlocked,
  unlockAchievement,
} from "../core/progress.js";

// Total de hiragana (ver data/kana.json). Si agregas katakana, esto
// necesitará su propio contador aparte.
const TOTAL_HIRAGANA = 46;
const XP_PER_LEVEL = 100; // debe coincidir con el mismo valor en progress.js
const MASTERY_BOX = 4;

const ACHIEVEMENTS = [
  { id: "streak_3", icon: "🔥", titleKey: "ach_streak3_title", descKey: "ach_streak3_desc", check: (s) => s.streak >= 3 },
  { id: "streak_7", icon: "🔥", titleKey: "ach_streak7_title", descKey: "ach_streak7_desc", check: (s) => s.streak >= 7 },
  { id: "streak_30", icon: "🔥", titleKey: "ach_streak30_title", descKey: "ach_streak30_desc", check: (s) => s.streak >= 30 },
  { id: "level_5", icon: "⭐", titleKey: "ach_level5_title", descKey: "ach_level5_desc", check: (s) => s.level >= 5 },
  { id: "level_10", icon: "🌟", titleKey: "ach_level10_title", descKey: "ach_level10_desc", check: (s) => s.level >= 10 },
  { id: "first_seal", icon: "🈴", titleKey: "ach_firstseal_title", descKey: "ach_firstseal_desc", check: (s) => s.mastered >= 1 },
  { id: "hiragana_complete", icon: "🎌", titleKey: "ach_hiragana_title", descKey: "ach_hiragana_desc", check: (s) => s.mastered >= TOTAL_HIRAGANA },
  { id: "accuracy_90", icon: "🎯", titleKey: "ach_accuracy_title", descKey: "ach_accuracy_desc", check: (s) => s.accuracy !== null && s.accuracy >= 90 },
];

// Réplica local de la lógica de accuracy/mastery de progress.js, pero
// recorriendo solo las entradas ya registradas (no necesita kana.json).
function computeMasteredCount(progress) {
  return Object.values(progress.kana || {}).filter((e) => (e.box ?? 0) >= MASTERY_BOX).length;
}

function computeAccuracy(progress) {
  let totalAttempts = 0;
  let totalErrors = 0;
  Object.values(progress.kana || {}).forEach((e) => {
    totalAttempts += e.attempts || 0;
    totalErrors += e.errors || 0;
  });
  if (totalAttempts === 0) return null;
  return Math.round(((totalAttempts - totalErrors) / totalAttempts) * 100);
}

function getSnapshot() {
  const progress = getProgress();
  return {
    level: getLevel(),
    xpIntoLevel: getXpIntoLevel(),
    xpTotal: progress.xp,
    streak: progress.streak || 0,
    mastered: computeMasteredCount(progress),
    accuracy: computeAccuracy(progress),
  };
}

function renderAchievementCard(def, unlocked) {
  return `
    <div class="achievement-card ${unlocked ? "unlocked" : "locked"}">
      <span class="achievement-icon">${unlocked ? def.icon : "🔒"}</span>
      <div class="achievement-text">
        <strong>${t(def.titleKey)}</strong>
        <span>${t(def.descKey)}</span>
      </div>
    </div>
  `;
}

export function renderPerfil(container) {
  const s = getSnapshot();

  // Revisa y desbloquea logros nuevos (queda guardado permanentemente).
  ACHIEVEMENTS.forEach((a) => {
    if (a.check(s)) unlockAchievement(a.id);
  });

  const unlockedCount = ACHIEVEMENTS.filter((a) => isAchievementUnlocked(a.id)).length;
  const accuracyLabel = s.accuracy === null ? "—" : `${s.accuracy}%`;

  container.innerHTML = `
    <header class="app-header">
      <h2 class="screen-title">${t("profile_title")}</h2>
      ${renderLangSwitchHTML()}
    </header>

    <section class="card profile-summary">
      <div class="profile-level-badge">Lv. ${s.level}</div>
      <div class="profile-xp-bar">
        <div class="profile-xp-fill" style="width:${(s.xpIntoLevel / XP_PER_LEVEL) * 100}%"></div>
      </div>
      <p class="profile-xp-label">${s.xpIntoLevel}/${XP_PER_LEVEL} XP · ${t("profile_total_xp", { xp: s.xpTotal })}</p>
      <div class="profile-streak">🔥 ${s.streak}<span>${t("profile_streak_label")}</span></div>
    </section>

    <div class="profile-stats-row">
      <div class="card profile-stat">
        <span class="profile-stat-value">${accuracyLabel}</span>
        <span class="profile-stat-label">${t("profile_accuracy_label")}</span>
      </div>
      <div class="card profile-stat">
        <span class="profile-stat-value">${s.mastered}/${TOTAL_HIRAGANA}</span>
        <span class="profile-stat-label">${t("profile_mastered_label")}</span>
      </div>
    </div>

    <h3 class="profile-achievements-title">${t("profile_achievements_title", { unlocked: unlockedCount, total: ACHIEVEMENTS.length })}</h3>
    <div class="achievements-grid">
      ${ACHIEVEMENTS.map((a) => renderAchievementCard(a, isAchievementUnlocked(a.id))).join("")}
    </div>
  `;

  bindLangSwitch(container);
}
