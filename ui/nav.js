// ui/nav.js
// Barra de navegación inferior, fija, pensada para uso con el pulgar.

const TABS = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "lecciones", label: "Lecciones", icon: "📖" },
  { id: "practicar", label: "Practicar", icon: "🎯" },
  { id: "progreso", label: "Progreso", icon: "📊" },
  { id: "perfil", label: "Perfil", icon: "👤" },
];

export function renderNav(activeTab, onNavigate) {
  const nav = document.getElementById("bottom-nav");
  nav.innerHTML = "";

  TABS.forEach((tab) => {
    const btn = document.createElement("button");
    btn.className = "nav-btn" + (tab.id === activeTab ? " active" : "");
    btn.innerHTML = `<span class="nav-icon">${tab.icon}</span><span class="nav-label">${tab.label}</span>`;
    btn.addEventListener("click", () => onNavigate(tab.id));
    nav.appendChild(btn);
  });
}
