// ui/pronunciation.js
// Modo de práctica "Hablar": el usuario pronuncia el carácter y la app
// evalúa con reconocimiento de voz. Ver services/stt.js para la nota
// importante sobre la dependencia de internet.

import { addXP, recordAttempt } from "../core/progress.js";
import { pickNextKana, recordAnswer } from "../core/srs.js";
import { speakJapanese } from "../services/voice.js";
import {
  startListening,
  isSTTSupported,
  checkPronunciation,
} from "../services/stt.js";
import { t } from "../core/i18n.js";

// Traduce los códigos de error que entrega services/stt.js a un
// mensaje en el idioma activo. Los códigos en sí (not-allowed,
// no-speech, etc.) no cambian, solo el texto que se muestra.
function errorMessage(code) {
  const KEY_BY_CODE = {
    "not-allowed": "pron_err_not_allowed",
    "no-speech": "pron_err_no_speech",
    network: "pron_err_network",
    "audio-capture": "pron_err_audio_capture",
    "not-supported": "pron_err_not_supported",
  };
  return t(KEY_BY_CODE[code] || "pron_generic_error");
}

let currentChar = null;
let recordedThisRound = false;

// `pool` opcional: igual que en quiz.js, restringe de qué caracteres
// salen las preguntas (modo enfocado de práctica).
export function renderPronunciation(container, pool) {
  if (!isSTTSupported()) {
    container.innerHTML = `<p class="error-msg">${errorMessage("not-supported")}</p>`;
    return;
  }
  nextPronQuestion(container, pool);
}

function nextPronQuestion(container, pool) {
  const fullList = window.NihonGoData.kana;
  const askPool = pool && pool.length ? pool : fullList;

  const question = pickNextKana(askPool, currentChar);
  currentChar = question.char;
  recordedThisRound = false;

  container.innerHTML = `
    <p class="quiz-instruction">${t("pron_instruction")}</p>

    <section class="card quiz-card">
      <button class="quiz-char-btn" id="btn-hint" aria-label="${t("pron_hint_aria")}">
        <span class="quiz-char">${question.char}</span>
        <span class="speaker-icon">🔊</span>
      </button>
    </section>

    <button class="mic-btn" id="btn-mic">
      <span class="mic-icon">🎤</span>
      <span class="mic-label">${t("pron_tap_to_speak")}</span>
    </button>

    <p class="quiz-feedback" id="quiz-feedback"></p>
    <div class="pron-actions" id="pron-actions"></div>
  `;

  container.querySelector("#btn-hint").addEventListener("click", () => speakJapanese(question.char));

  const micBtn = container.querySelector("#btn-mic");
  micBtn.addEventListener("click", () => handleMicTap(container, question, micBtn, pool));
}

function handleMicTap(container, question, micBtn, pool) {
  const feedback = container.querySelector("#quiz-feedback");
  feedback.textContent = "";
  feedback.className = "quiz-feedback";

  micBtn.classList.add("listening");
  micBtn.querySelector(".mic-label").textContent = t("pron_listening");

  startListening({
    onResult: (alternatives) => {
      const correct = checkPronunciation(alternatives, question.char);
      showFeedback(container, question, correct, alternatives[0] || "", pool);
    },
    onError: (err) => {
      feedback.textContent = errorMessage(err);
      feedback.className = "quiz-feedback feedback-incorrect";
    },
    onEnd: () => {
      micBtn.classList.remove("listening");
      micBtn.querySelector(".mic-label").textContent = t("pron_tap_to_speak");
    },
  });
}

function showFeedback(container, question, correct, heard, pool) {
  const feedback = container.querySelector("#quiz-feedback");
  const actions = container.querySelector("#pron-actions");

  if (correct) {
    feedback.textContent = t("pron_correct");
    feedback.className = "quiz-feedback feedback-correct";
  } else {
    feedback.textContent = heard
      ? t("pron_heard", { heard, char: question.char })
      : t("pron_not_recognized", { char: question.char });
    feedback.className = "quiz-feedback feedback-incorrect";
  }

  // Solo se registra el PRIMER intento de cada pregunta (igual que el
  // quiz de opción múltiple). Reintentar es para practicar, no para
  // "forzar" el sistema de repetición ni las estadísticas.
  if (!recordedThisRound) {
    recordAnswer(question.char, correct);
    recordAttempt(question.char, correct); // sin "confusedWith": en voz no aplica
    if (correct) addXP(10);
    recordedThisRound = true;
  }

  actions.innerHTML = correct
    ? `<button class="btn btn-secondary" id="btn-next">${t("pron_next")}</button>`
    : `<button class="btn btn-secondary" id="btn-retry">${t("pron_retry")}</button>
       <button class="btn btn-primary" id="btn-skip">${t("pron_next")}</button>`;

  actions.querySelector("#btn-next")?.addEventListener("click", () => nextPronQuestion(container, pool));
  actions.querySelector("#btn-skip")?.addEventListener("click", () => nextPronQuestion(container, pool));
  actions.querySelector("#btn-retry")?.addEventListener("click", () => {
    actions.innerHTML = "";
    const micBtn = container.querySelector("#btn-mic");
    handleMicTap(container, question, micBtn, pool);
  });
}
