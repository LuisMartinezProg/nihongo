
// ui/lessons.js

import { getKanaBox } from "../core/progress.js";
import { MASTERY_BOX } from "../core/srs.js";
import { speakJapanese } from "../services/voice.js";
import { t } from "../core/i18n.js";
import { renderLangSwitchHTML, bindLangSwitch } from "./langSwitch.js";

export function renderLessons(container, onNavigate) {
  const kanaList = window.NihonGoData.kana;

  container.innerHTML = `
    <header class="app-header">
      <button class="back-btn" id="btn-back">←</button>
      <h2 class="screen-title">${t("lessons_title")}</h2>
      ${renderLangSwitchHTML()}
    </header>

    <section class="card lesson-card lesson-active">
      <p class="eyebrow">${t("lessons_level")}</p>
      <h3>${t("lessons_hiragana_title")}</h3>
      <p class="lesson-sub">${t("lessons_hiragana_sub", { total: kanaList.length })}</p>
    </section>

    <section class="kana-grid" id="kana-grid"></section>

    <section class="card lesson-card lesson-locked">
      <p class="eyebrow">${t("lessons_level")}</p>
      <h3>${t("lessons_katakana_title")}</h3>
      <p class="lesson-sub">${t("lessons_soon")}</p>
    </section>
  `;

  bindLangSwitch(container);

  const grid = container.querySelector("#kana-grid");
  kanaList.forEach((k) => {
    const mastered = getKanaBox(k.char) >= MASTERY_BOX;
    const cell = document.createElement("button");
    cell.className = "kana-cell" + (mastered ? " mastered" : "");
    cell.innerHTML = `
      <span class="kana-char">${k.char}</span>
      <span class="kana-romaji">${k.romaji}</span>
      ${mastered ? `<span class="hanko" aria-label="${t("lessons_mastered_aria")}">済</span>` : ""}
    `;
    cell.addEventListener("click", () => speakJapanese(k.char));
    grid.appendChild(cell);
  });

  container.querySelector("#btn-back").addEventListener("click", () => onNavigate("home"));
}
