// ui/home.js

import {
  getProgress,
  getLevel,
  getXpIntoLevel,
  countMastered,
} from "../core/progress.js";

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
      </div>
    </header>

    <section class="card hero-card">
      <p class="eyebrow">今日のレッスン</p>
      <h2 class="hero-title">Hiragana</h2>
      <p class="hero-sub">あ — ん · ${mastered}/${kanaList.length} dominados</p>
      <button class="btn btn-primary" id="btn-lesson">Empezar →</button>
    </section>

    <section class="stats-row">
      <div class="card stat-box">
        <span class="stat-value">${p.xp}</span>
        <span class="stat-label">XP total</span>
        <span class="stat-sub">${xpIntoLevel}/100 al siguiente nivel</span>
      </div>
      <div class="card stat-box">
        <span class="stat-value">${mastered}</span>
        <span class="stat-label">Caracteres sellados</span>
        <span class="stat-sub">de ${kanaList.length} hiragana</span>
      </div>
    </section>

    <button class="btn btn-secondary" id="btn-practice">Practicar ahora</button>
  `;

  container.querySelector("#btn-lesson").addEventListener("click", () => onNavigate("lecciones"));
  container.querySelector("#btn-practice").addEventListener("click", () => onNavigate("practicar"));
}
