// ui/quiz.js

import { addXP, recordAttempt } from "../core/progress.js";
import { pickNextKana, recordAnswer, getDistractors } from "../core/srs.js";
import { speakJapanese } from "../services/voice.js";

let currentChar = null;

// `pool` es opcional: si se pasa (modo enfocado, ver ui/practice.js),
// las preguntas salen solo de ahí. Los distractores del quiz siempre
// salen de la lista completa, para que las opciones no se repitan.
export function renderQuiz(container, pool) {
  nextQuestion(container, pool);
}

function nextQuestion(container, pool) {
  const fullList = window.NihonGoData.kana;
  const askPool = pool && pool.length ? pool : fullList;

  const question = pickNextKana(askPool, currentChar);
  currentChar = question.char;

  const distractors = getDistractors(fullList, question.char, 3);
  const options = [...distractors, question.romaji].sort(() => Math.random() - 0.5);

  container.innerHTML = `
    <p class="quiz-instruction">¿Cómo se lee este carácter?</p>

    <section class="card quiz-card">
      <button class="quiz-char-btn" id="btn-speak" aria-label="Escuchar">
        <span class="quiz-char">${question.char}</span>
        <span class="speaker-icon">🔊</span>
      </button>
    </section>

    <div class="quiz-options" id="quiz-options">
      ${options
        .map((opt) => `<button class="option-btn" data-opt="${opt}">${opt}</button>`)
        .join("")}
    </div>

    <p class="quiz-feedback" id="quiz-feedback"></p>
  `;

  container.querySelector("#btn-speak").addEventListener("click", () => speakJapanese(question.char));

  const optionButtons = container.querySelectorAll(".option-btn");
  optionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      optionButtons.forEach((b) => (b.disabled = true));
      const chosen = btn.dataset.opt;
      const correct = chosen === question.romaji;
      const feedback = container.querySelector("#quiz-feedback");

      if (correct) {
        btn.classList.add("correct");
        feedback.textContent = "¡Correcto! +10 XP";
        feedback.className = "quiz-feedback feedback-correct";
        addXP(10);
      } else {
        btn.classList.add("incorrect");
        feedback.textContent = `Era "${question.romaji}"`;
        feedback.className = "quiz-feedback feedback-incorrect";
        optionButtons.forEach((b) => {
          if (b.dataset.opt === question.romaji) b.classList.add("correct");
        });
      }

      recordAnswer(question.char, correct);

      // Si falló, buscamos qué carácter corresponde a la opción que
      // eligió para guardarlo como "confusión" en el mapa de errores.
      const confusedChar = !correct
        ? fullList.find((k) => k.romaji === chosen)?.char || null
        : null;
      recordAttempt(question.char, correct, confusedChar);

      setTimeout(() => nextQuestion(container, pool), 1100);
    });
  });
}
