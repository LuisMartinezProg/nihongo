// core/i18n.js
// Maneja el idioma de la interfaz (ES/EN) y la función de traducción.
// Importante: esto solo afecta los textos de la UI. El contenido en
// japonés (caracteres, romaji, audio TTS) nunca se traduce — sigue
// siendo japonés sin importar qué idioma esté activo aquí.

import { STRINGS } from "../data/i18n.js";

const STORAGE_KEY = "nihongo_lang";
const DEFAULT_LANG = "es";

let currentLang = DEFAULT_LANG;
try {
  currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
} catch (err) {
  currentLang = DEFAULT_LANG;
}

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  if (lang !== "es" && lang !== "en") return;
  currentLang = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (err) {
    // Almacenamiento no disponible (modo privado, cuota llena, etc).
    // El idioma sigue cambiando en memoria para esta sesión igual.
  }
}

export function toggleLang() {
  setLang(currentLang === "es" ? "en" : "es");
  return currentLang;
}

// t("home_lesson_sub", { mastered: 3, total: 46 })
// Busca la clave en el idioma activo y reemplaza los {placeholders}.
export function t(key, params) {
  const dict = STRINGS[currentLang] || STRINGS[DEFAULT_LANG];
  let str = dict[key];

  if (str === undefined) {
    console.warn(`[i18n] falta la clave "${key}" en "${currentLang}"`);
    str = STRINGS[DEFAULT_LANG][key] || key;
  }

  if (params) {
    Object.keys(params).forEach((p) => {
      str = str.replace(new RegExp(`{${p}}`, "g"), params[p]);
    });
  }

  return str;
}
