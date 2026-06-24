// ui/placeholders.js
// Pantalla temporal para Perfil, que aún no se desarrolla en esta fase.

export function renderPerfilPlaceholder(container) {
  container.innerHTML = `
    <header class="app-header">
      <h2 class="screen-title">Perfil</h2>
    </header>
    <section class="card placeholder-card">
      <span class="placeholder-icon">👤</span>
      <h3>Próximamente</h3>
      <p>Aquí vas a poder ajustar tu nivel, reiniciar progreso y ver logros.</p>
    </section>
  `;
}
