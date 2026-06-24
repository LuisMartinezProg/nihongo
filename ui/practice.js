// ui/practice.js
// Pantalla "Practicar". Maneja el header propio y un selector entre
// dos modos: "Escribir" (quiz de opción múltiple, ui/quiz.js) y
// "Hablar" (práctica con voz, ui/pronunciation.js).

import { renderQuiz } from "./quiz.js";
import { renderPronunciation } from "./pronunciation.js";

let mode = "mcq"; // "mcq" | "voice" — se reinicia a "mcq" al recargar la app

export function renderPractice(container, onNavigate) {
  container.innerHTML = `
    <header class="app-header">
      <button class="back-btn" id="btn-back">←</button>
      <h2 class="screen-title">Practicar</h2>
    </header>

    <div class="mode-toggle">
      <button class="mode-btn ${mode === "mcq" ? "active" : ""}" data-mode="mcq">Escribir</button>
      <button class="mode-btn ${mode === "voice" ? "active" : ""}" data-mode="voice">Hablar</button>
    </div>

    <div id="practice-content"></div>
  `;

  container.querySelector("#btn-back").addEventListener("click", () => onNavigate("home"));

  container.querySelectorAll(".mode-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.mode === mode) return;
      mode = btn.dataset.mode;
      renderPractice(container, onNavigate);
    });
  });

  const content = container.querySelector("#practice-content");
  if (mode === "mcq") {
    renderQuiz(content);
  } else {
    renderPronunciation(content);
  }
}
