// services/storage.js
// Wrapper simple sobre localStorage. Todo lo que usa el resto de la app
// pasa por aquí para que el manejo de errores y el formato JSON estén
// en un solo lugar.

const PREFIX = "nihongo:";

export function getItem(key, fallback = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn("[storage] no se pudo leer", key, err);
    return fallback;
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn("[storage] no se pudo guardar", key, err);
    return false;
  }
}

export function removeItem(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch (err) {
    console.warn("[storage] no se pudo borrar", key, err);
  }
}

// También lo exponemos en window para depurar fácil desde la consola
// del navegador en el celular (ej: NihonGoStorage.getItem('progress'))
window.NihonGoStorage = { getItem, setItem, removeItem };
