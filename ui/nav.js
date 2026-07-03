// ui/nav.js
// Barra de navegación inferior, fija, pensada para uso con el pulgar.

import { t } from "../core/i18n.js";

const TABS = [
  { id: "home", labelKey: "nav_home", icon: "🏠" },
  { id: "lecciones", labelKey: "nav_lecciones", icon: "📖" },
  { id: "practicar", labelKey: "nav_practicar", icon: "🎯" },
  { id: "progreso", labelKey: "nav_progreso", icon: "📊" },
  { id: "perfil", labelKey: "nav_perfil", icon: "👤" },
];

export function renderNav(activeTab, onNavigate) {
  const nav = document.getElementById("bottom-nav");
  nav.innerHTML = "";

  TABS.forEach((tab) => {
    const btn = document.createElement("button");
    btn.className = "nav-btn" + (tab.id === activeTab ? " active" : "");
    btn.innerHTML = `<span class="nav-icon">${tab.icon}</span><span class="nav-label">${t(tab.labelKey)}</span>`;
    btn.addEventListener("click", () => onNavigate(tab.id));
    nav.appendChild(btn);
  });
}
