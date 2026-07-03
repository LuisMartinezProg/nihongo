// main.js
// Orquesta toda la app: carga los datos, inicializa el progreso,
// arma la navegación y decide qué pantalla mostrar.

import { loadProgress, checkAndUpdateStreak } from "./core/progress.js";
import { t } from "./core/i18n.js";
import { renderNav } from "./ui/nav.js";
import { renderHome } from "./ui/home.js";
import { renderLessons } from "./ui/lessons.js";
import { renderPractice, exitFocusedMode } from "./ui/practice.js";
import { renderProgresoScreen } from "./ui/progress-screen.js";
import { renderPerfilPlaceholder } from "./ui/placeholders.js";

window.NihonGoData = { kana: [] };

const app = document.getElementById("app");
let activeTab = "home";

function navigateTo(tab) {
  // Si el usuario sale de Practicar por cualquier vía (otra pestaña,
  // botón "atrás"), cerramos el modo enfocado para que no se quede
  // pegado en la siguiente visita normal a esa pestaña.
  if (tab !== "practicar") exitFocusedMode();

  activeTab = tab;
  renderScreen();
  renderNav(activeTab, navigateTo);
  window.scrollTo(0, 0);
}

// Vuelve a pintar la pantalla activa y el nav SIN cambiar de pestaña
// ni tocar el modo enfocado. La usa el botón de idioma (ver
// ui/langSwitch.js) para refrescar toda la interfaz al instante
// después de cambiar entre ES y EN.
function refresh() {
  renderScreen();
  renderNav(activeTab, navigateTo);
}

function renderScreen() {
  switch (activeTab) {
    case "home":
      renderHome(app, navigateTo);
      break;
    case "lecciones":
      renderLessons(app, navigateTo);
      break;
    case "practicar":
      renderPractice(app, navigateTo);
      break;
    case "progreso":
      renderProgresoScreen(app, navigateTo);
      break;
    case "perfil":
      renderPerfilPlaceholder(app);
      break;
    default:
      renderHome(app, navigateTo);
  }
}

async function init() {
  try {
    const res = await fetch("./data/kana.json");
    window.NihonGoData.kana = await res.json();
  } catch (err) {
    console.error("[main] no se pudo cargar kana.json", err);
    app.innerHTML = `<p class="error-msg">${t("load_error")}</p>`;
    return;
  }

  loadProgress();
  checkAndUpdateStreak();

  navigateTo("home");
}

init();

// Expuesto para depurar desde la consola del navegador en el celular
window.NihonGoApp = { navigateTo, refresh };
