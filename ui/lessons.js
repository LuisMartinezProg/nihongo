// ui/lessons.js

import { getKanaBox } from "../core/progress.js";
import { MASTERY_BOX } from "../core/srs.js";
import { speakJapanese } from "../services/voice.js";

export function renderLessons(container, onNavigate) {
  const kanaList = window.NihonGoData.kana;

  container.innerHTML = `
    <header class="app-header">
      <button class="back-btn" id="btn-back">←</button>
      <h2 class="screen-title">Lecciones</h2>
    </header>

    <section class="card lesson-card lesson-active">
      <p class="eyebrow">Nivel 1</p>
      <h3>Hiragana</h3>
      <p class="lesson-sub">${kanaList.length} caracteres · toca uno para escucharlo</p>
    </section>

    <section class="kana-grid" id="kana-grid"></section>

    <section class="card lesson-card lesson-locked">
      <p class="eyebrow">Nivel 1</p>
      <h3>Katakana</h3>
      <p class="lesson-sub">Próximamente</p>
    </section>
  `;

  const grid = container.querySelector("#kana-grid");
  kanaList.forEach((k) => {
    const mastered = getKanaBox(k.char) >= MASTERY_BOX;
    const cell = document.createElement("button");
    cell.className = "kana-cell" + (mastered ? " mastered" : "");
    cell.innerHTML = `
      <span class="kana-char">${k.char}</span>
      <span class="kana-romaji">${k.romaji}</span>
      ${mastered ? '<span class="hanko" aria-label="dominado">済</span>' : ""}
    `;
    cell.addEventListener("click", () => speakJapanese(k.char));
    grid.appendChild(cell);
  });

  container.querySelector("#btn-back").addEventListener("click", () => onNavigate("home"));
}
