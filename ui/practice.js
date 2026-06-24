// ui/practice.js
// Pantalla "Practicar". Maneja el header propio, un selector entre dos
// modos ("Escribir" / "Hablar") y el modo de práctica enfocada que se
// activa desde la pantalla de Progreso ("Practicar mis errores").

import { renderQuiz } from "./quiz.js";
import { renderPronunciation } from "./pronunciation.js";

let mode = "mcq"; // "mcq" | "voice" — se reinicia a "mcq" al recargar la app
let focusedPool = null; // null = práctica normal con todos los kana

// Llamado desde ui/progress-screen.js al tocar "Practicar mis errores".
export function enterFocusedMode(pool) {
  focusedPool = pool;
  mode = "mcq";
}

// Se llama automáticamente al salir de la pestaña Practicar (ver
// main.js), o cuando el usuario toca "Salir" en el aviso de modo
// enfocado, para que no se quede pegado en sesiones futuras.
export function exitFocusedMode() {
  focusedPool = null;
}

export function renderPractice(container, onNavigate) {
  container.innerHTML = `
    <header class="app-header">
      <button class="back-btn" id="btn-back">←</button>
      <h2 class="screen-title">Practicar</h2>
    </header>

    ${
      focusedPool
        ? `<div class="focused-banner">
             <span>🎯 Modo enfocado · ${focusedPool.length} caracteres</span>
             <button id="btn-exit-focused">Salir</button>
           </div>`
        : ""
    }

    <div class="mode-toggle">
      <button class="mode-btn ${mode === "mcq" ? "active" : ""}" data-mode="mcq">Escribir</button>
      <button class="mode-btn ${mode === "voice" ? "active" : ""}" data-mode="voice">Hablar</button>
    </div>

    <div id="practice-content"></div>
  `;

  container.querySelector("#btn-back").addEventListener("click", () => onNavigate("home"));

  container.querySelector("#btn-exit-focused")?.addEventListener("click", () => {
    exitFocusedMode();
    renderPractice(container, onNavigate);
  });

  container.querySelectorAll(".mode-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.mode === mode) return;
      mode = btn.dataset.mode;
      renderPractice(container, onNavigate);
    });
  });

  const content = container.querySelector("#practice-content");
  if (mode === "mcq") {
    renderQuiz(content, focusedPool);
  } else {
    renderPronunciation(content, focusedPool);
  }
}
