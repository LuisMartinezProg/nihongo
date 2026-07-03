// ui/placeholders.js
// Pantalla temporal para Perfil, que aún no se desarrolla en esta fase.

import { t } from "../core/i18n.js";
import { renderLangSwitchHTML, bindLangSwitch } from "./langSwitch.js";

export function renderPerfilPlaceholder(container) {
  container.innerHTML = `
    <header class="app-header">
      <h2 class="screen-title">${t("profile_title")}</h2>
      ${renderLangSwitchHTML()}
    </header>
    <section class="card placeholder-card">
      <span class="placeholder-icon">👤</span>
      <h3>${t("profile_soon")}</h3>
      <p>${t("profile_desc")}</p>
    </section>
  `;
  bindLangSwitch(container);
}
