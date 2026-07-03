// ui/langSwitch.js
// Botón de cambio de idioma (ES ⇄ EN) pensado para vivir en el header
// de cada pantalla. Al tocarlo, cambia el idioma global guardado en
// localStorage y le pide a main.js que vuelva a pintar la pantalla
// activa y el nav, para que el cambio se vea en todos lados al toque.

import { getLang, toggleLang, t } from "../core/i18n.js";

export function renderLangSwitchHTML() {
  const nextLang = getLang() === "es" ? "EN" : "ES";
  return `<button class="lang-switch" id="btn-lang-switch" aria-label="${t("lang_switch_aria")}">${nextLang}</button>`;
}

export function bindLangSwitch(container) {
  const btn = container.querySelector("#btn-lang-switch");
  if (!btn) return;
  btn.addEventListener("click", () => {
    toggleLang();
    window.NihonGoApp.refresh();
  });
}
