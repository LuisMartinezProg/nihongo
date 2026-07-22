// Persistencia en localStorage del navegador (a diferencia de un artifact de
// Claude, esta es una app real y localStorage funciona perfecto aquí).
const KEY = "racha-ingles-progress-v1";

export function loadProgress() {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("No se pudo leer el progreso guardado", e);
    return null;
  }
}

export function saveProgress(data) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error("No se pudo guardar el progreso", e);
    return false;
  }
}

export function clearProgress() {
  try {
    window.localStorage.removeItem(KEY);
    return true;
  } catch (e) {
    return false;
  }
}
