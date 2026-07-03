// ui/progress-screen.js
// Pantalla "Progreso": precisión global, caracteres dominados, y el
// mapa de errores (qué falla más el usuario y con qué lo confunde),
// con un botón para practicar justo esos caracteres.

import { getProgress, countMastered, getOverallAccuracy } from "../core/progress.js";
import { getWorstKana, getTopConfusion, buildFocusedPool } from "../core/errorMap.js";
import { enterFocusedMode } from "./practice.js";
import { t } from "../core/i18n.js";
import { renderLangSwitchHTML, bindLangSwitch } from "./langSwitch.js";

export function renderProgresoScreen(container, onNavigate) {
  const kanaList = window.NihonGoData.kana;
  const p = getProgress();
  const mastered = countMastered(kanaList);
  const accuracy = getOverallAccuracy(kanaList);
  const worst = getWorstKana(kanaList, 8);

  container.innerHTML = `
    <header class="app-header">
      <h2 class="screen-title">${t("progress_title")}</h2>
      ${renderLangSwitchHTML()}
    </header>

    <section class="stats-row">
      <div class="card stat-box">
        <span class="stat-value">${accuracy !== null ? accuracy + "%" : "—"}</span>
        <span class="stat-label">${t("progress_accuracy_label")}</span>
        <span class="stat-sub">${t("progress_accuracy_sub")}</span>
      </div>
      <div class="card stat-box">
        <span class="stat-value">${mastered}/${kanaList.length}</span>
        <span class="stat-label">${t("progress_mastered_label")}</span>
        <span class="stat-sub">${t("progress_streak_sub", { streak: p.streak })}</span>
      </div>
    </section>

    <h3 class="section-title">${t("progress_error_map_title")}</h3>

    ${
      worst.length === 0
        ? `<p class="empty-msg">${t("progress_empty_msg")}</p>`
        : `<section class="error-list">${worst.map(renderErrorRow).join("")}</section>
           <button class="btn btn-primary" id="btn-focused">${t("progress_btn_focused")}</button>`
    }
  `;

  bindLangSwitch(container);

  if (worst.length > 0) {
    container.querySelector("#btn-focused").addEventListener("click", () => {
      const pool = buildFocusedPool(kanaList, 10);
      enterFocusedMode(pool);
      onNavigate("practicar");
    });
  }
}

function renderErrorRow(k) {
  const conf = getTopConfusion(k.stats);
  const rate = Math.round((k.stats.errors / k.stats.attempts) * 100);

  return `
    <div class="error-row">
      <span class="error-char">${k.char}</span>
      <div class="error-info">
        <span class="error-romaji">${k.romaji}</span>
        <span class="error-rate">${t("progress_error_rate", { rate, errors: k.stats.errors, attempts: k.stats.attempts })}</span>
        ${conf ? `<span class="error-confusion">${t("progress_confusion", { char: conf.char })}</span>` : ""}
      </div>
    </div>
  `;
}
