// ui/home.js

import {
  getProgress,
  getLevel,
  getXpIntoLevel,
  countMastered,
} from "../core/progress.js";
import { t } from "../core/i18n.js";
import { renderLangSwitchHTML, bindLangSwitch } from "./langSwitch.js";

export function renderHome(container, onNavigate) {
  const kanaList = window.NihonGoData.kana;
  const p = getProgress();
  const level = getLevel();
  const xpIntoLevel = getXpIntoLevel();
  const mastered = countMastered(kanaList);

  container.innerHTML = `
    <header class="app-header">
      <div class="wordmark">日本語<span class="wordmark-sub">NihonGo</span></div>
      <div class="header-stats">
        <span class="pill">Lv. ${level}</span>
        <span class="pill pill-streak">🔥 ${p.streak}</span>
        ${renderLangSwitchHTML()}
      </div>
    </header>

    <section class="card hero-card">
      <p class="eyebrow">${t("home_eyebrow")}</p>
      <h2 class="hero-title">${t("home_lesson_title")}</h2>
      <p class="hero-sub">あ — ん · ${t("home_lesson_sub", { mastered, total: kanaList.length })}</p>
      <button class="btn btn-primary" id="btn-lesson">${t("home_btn_start")}</button>
    </section>

    <section class="stats-row">
      <div class="card stat-box">
        <span class="stat-value">${p.xp}</span>
        <span class="stat-label">${t("home_stat_xp_label")}</span>
        <span class="stat-sub">${t("home_stat_xp_sub", { xpIntoLevel })}</span>
      </div>
      <div class="card stat-box">
        <span class="stat-value">${mastered}</span>
        <span class="stat-label">${t("home_stat_mastered_label")}</span>
        <span class="stat-sub">${t("home_stat_mastered_sub", { total: kanaList.length })}</span>
      </div>
    </section>

    <button class="btn btn-secondary" id="btn-practice">${t("home_btn_practice")}</button>
  `;

  bindLangSwitch(container);
  container.querySelector("#btn-lesson").addEventListener("click", () => onNavigate("lecciones"));
  container.querySelector("#btn-practice").addEventListener("click", () => onNavigate("practicar"));
}
