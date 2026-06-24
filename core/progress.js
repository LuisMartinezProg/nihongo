// core/progress.js
// Maneja todo el estado de progreso del usuario: XP, nivel, racha diaria
// y la "caja" de repetición espaciada de cada kana (ver core/srs.js).

import { getItem, setItem } from "../services/storage.js";

const KEY = "progress";
const XP_PER_LEVEL = 100;
const XP_PER_CORRECT = 10;

function todayStr() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function defaultProgress() {
  return {
    xp: 0,
    streak: 0,
    lastActiveDate: null,
    kana: {}, // { "あ": { box: 0 } }
  };
}

let state = null;

export function loadProgress() {
  state = getItem(KEY, null) || defaultProgress();
  return state;
}

export function saveProgress() {
  setItem(KEY, state);
}

export function getProgress() {
  if (!state) loadProgress();
  return state;
}

export function getLevel() {
  return Math.floor(getProgress().xp / XP_PER_LEVEL) + 1;
}

export function getXpIntoLevel() {
  return getProgress().xp % XP_PER_LEVEL;
}

export function addXP(amount = XP_PER_CORRECT) {
  const p = getProgress();
  p.xp += amount;
  saveProgress();
  return p.xp;
}

// Se llama una vez al abrir la app. Si es un día nuevo consecutivo suma
// racha; si hubo un hueco de más de un día, la racha se reinicia.
export function checkAndUpdateStreak() {
  const p = getProgress();
  const today = todayStr();

  if (p.lastActiveDate === today) {
    return p.streak; // ya contado hoy
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().slice(0, 10);

  if (p.lastActiveDate === yStr) {
    p.streak += 1;
  } else {
    p.streak = 1; // primera vez o se rompió la racha
  }

  p.lastActiveDate = today;
  saveProgress();
  return p.streak;
}

export function getKanaBox(char) {
  const p = getProgress();
  return p.kana[char]?.box ?? 0;
}

export function setKanaBox(char, box) {
  const p = getProgress();
  if (!p.kana[char]) p.kana[char] = {};
  p.kana[char].box = box;
  saveProgress();
}

export function countMastered(kanaList, masteryBox = 4) {
  const p = getProgress();
  return kanaList.filter((k) => (p.kana[k.char]?.box ?? 0) >= masteryBox).length;
}

window.NihonGoProgress = {
  loadProgress,
  saveProgress,
  getProgress,
  getLevel,
  getXpIntoLevel,
  addXP,
  checkAndUpdateStreak,
  getKanaBox,
  setKanaBox,
  countMastered,
};
