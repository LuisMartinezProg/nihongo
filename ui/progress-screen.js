// ui/progress-screen.js
// Pantalla "Progreso": precisión global, caracteres dominados, y el
// mapa de errores (qué falla más el usuario y con qué lo confunde),
// con un botón para practicar justo esos caracteres.

import { getProgress, countMastered, getOverallAccuracy } from "../core/progress.js";
import { getWorstKana, getTopConfusion, buildFocusedPool } from "../core/errorMap.js";
import { enterFocusedMode } from "./practice.js";

export function renderProgresoScreen(container, onNavigate) {
  const kanaList = window.NihonGoData.kana;
  const p = getProgress();
  const mastered = countMastered(kanaList);
  const accuracy = getOverallAccuracy(kanaList);
  const worst = getWorstKana(kanaList, 8);

  container.innerHTML = `
    <header class="app-header">
      <h2 class="screen-title">Progreso</h2>
    </header>

    <section class="stats-row">
      <div class="card stat-box">
        <span class="stat-value">${accuracy !== null ? accuracy + "%" : "—"}</span>
        <span class="stat-label">Precisión</span>
        <span class="stat-sub">en hiragana</span>
      </div>
      <div class="card stat-box">
        <span class="stat-value">${mastered}/${kanaList.length}</span>
        <span class="stat-label">Sellados</span>
        <span class="stat-sub">${p.streak} días de racha</span>
      </div>
    </section>

    <h3 class="section-title">Mapa de errores</h3>

    ${
      worst.length === 0
        ? `<p class="empty-msg">Todavía no hay suficientes datos. Practica un poco y aquí van a aparecer los caracteres que más se te complican.</p>`
        : `<section class="error-list">${worst.map(renderErrorRow).join("")}</section>
           <button class="btn btn-primary" id="btn-focused">Practicar mis errores</button>`
    }
  `;

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
        <span class="error-rate">${rate}% de error · ${k.stats.errors}/${k.stats.attempts} intentos</span>
        ${conf ? `<span class="error-confusion">Se confunde con "${conf.char}"</span>` : ""}
      </div>
    </div>
  `;
}
