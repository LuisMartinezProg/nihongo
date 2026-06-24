// ui/placeholders.js
// Pantallas temporales para las pestañas que aún no se desarrollan
// en esta fase (llegan en fases posteriores del proyecto).

export function renderProgresoPlaceholder(container) {
  container.innerHTML = `
    <header class="app-header">
      <h2 class="screen-title">Progreso</h2>
    </header>
    <section class="card placeholder-card">
      <span class="placeholder-icon">📊</span>
      <h3>Próximamente</h3>
      <p>Aquí vas a ver precisión, errores frecuentes y tu mapa de errores por carácter.</p>
    </section>
  `;
}

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
