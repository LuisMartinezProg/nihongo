// data/i18n.js
// Diccionario de traducciones de la interfaz (ES / EN).
// El contenido en japonés (caracteres, romaji, audio TTS) NO pasa por
// aquí — ese es siempre japonés sin importar el idioma de la UI.
// Cada valor puede tener placeholders {asi} que core/i18n.js -> t()
// reemplaza por datos reales (números, caracteres, etc).

export const STRINGS = {
  es: {
    // Navegación inferior
    nav_home: "Home",
    nav_lecciones: "Lecciones",
    nav_practicar: "Practicar",
    nav_progreso: "Progreso",
    nav_perfil: "Perfil",

    // Home
    home_eyebrow: "今日のレッスン",
    home_lesson_title: "Hiragana",
    home_lesson_sub: "{mastered}/{total} dominados",
    home_btn_start: "Empezar →",
    home_stat_xp_label: "XP total",
    home_stat_xp_sub: "{xpIntoLevel}/100 al siguiente nivel",
    home_stat_mastered_label: "Caracteres sellados",
    home_stat_mastered_sub: "de {total} hiragana",
    home_btn_practice: "Practicar ahora",

    // Lecciones
    lessons_title: "Lecciones",
    lessons_level: "Nivel 1",
    lessons_hiragana_title: "Hiragana",
    lessons_hiragana_sub: "{total} caracteres · toca uno para escucharlo",
    lessons_katakana_title: "Katakana",
    lessons_soon: "Próximamente",
    lessons_mastered_aria: "dominado",

    // Practicar
    practice_title: "Practicar",
    practice_focused_banner: "🎯 Modo enfocado · {count} caracteres",
    practice_exit: "Salir",
    practice_mode_write: "Escribir",
    practice_mode_speak: "Hablar",

    // Progreso
    progress_title: "Progreso",
    progress_accuracy_label: "Precisión",
    progress_accuracy_sub: "en hiragana",
    progress_mastered_label: "Sellados",
    progress_streak_sub: "{streak} días de racha",
    progress_error_map_title: "Mapa de errores",
    progress_empty_msg: "Todavía no hay suficientes datos. Practica un poco y aquí van a aparecer los caracteres que más se te complican.",
    progress_btn_focused: "Practicar mis errores",
    progress_error_rate: "{rate}% de error · {errors}/{attempts} intentos",
    progress_confusion: "Se confunde con \"{char}\"",

    // Quiz (modo Escribir)
    quiz_question: "¿Cómo se lee este carácter?",
    quiz_listen_aria: "Escuchar",
    quiz_correct: "¡Correcto! +10 XP",
    quiz_incorrect: "Era \"{romaji}\"",

    // Pronunciación (modo Hablar)
    pron_instruction: "Pronuncia este carácter en voz alta",
    pron_hint_aria: "Escuchar ejemplo",
    pron_tap_to_speak: "Toca y habla",
    pron_listening: "Escuchando...",
    pron_correct: "¡Bien pronunciado! +10 XP",
    pron_heard: "Se escuchó \"{heard}\" — la respuesta es \"{char}\"",
    pron_not_recognized: "No se reconoció bien. La respuesta es \"{char}\"",
    pron_next: "Siguiente →",
    pron_retry: "Intentar de nuevo",
    pron_generic_error: "Hubo un error, intenta de nuevo.",
    pron_err_not_allowed: "Activa el permiso del micrófono para Chrome en los ajustes del celular.",
    pron_err_no_speech: "No se detectó tu voz. Acércate al micrófono e intenta de nuevo.",
    pron_err_network: "El reconocimiento de voz necesita conexión a internet.",
    pron_err_audio_capture: "No se encontró un micrófono disponible.",
    pron_err_not_supported: "Tu navegador no soporta reconocimiento de voz. Usa Chrome en Android.",

    // Perfil (placeholder)
    profile_title: "Perfil",
    profile_soon: "Próximamente",
    profile_desc: "Aquí vas a poder ajustar tu nivel, reiniciar progreso y ver logros.",

    // main.js
    load_error: "No se pudo cargar el contenido. Revisa que data/kana.json esté subido correctamente.",

    // Selector de idioma
    lang_switch_aria: "Cambiar idioma",
  },

  en: {
    // Bottom navigation
    nav_home: "Home",
    nav_lecciones: "Lessons",
    nav_practicar: "Practice",
    nav_progreso: "Progress",
    nav_perfil: "Profile",

    // Home
    home_eyebrow: "今日のレッスン",
    home_lesson_title: "Hiragana",
    home_lesson_sub: "{mastered}/{total} mastered",
    home_btn_start: "Start →",
    home_stat_xp_label: "Total XP",
    home_stat_xp_sub: "{xpIntoLevel}/100 to next level",
    home_stat_mastered_label: "Characters mastered",
    home_stat_mastered_sub: "out of {total} hiragana",
    home_btn_practice: "Practice now",

    // Lessons
    lessons_title: "Lessons",
    lessons_level: "Level 1",
    lessons_hiragana_title: "Hiragana",
    lessons_hiragana_sub: "{total} characters · tap one to hear it",
    lessons_katakana_title: "Katakana",
    lessons_soon: "Coming soon",
    lessons_mastered_aria: "mastered",

    // Practice
    practice_title: "Practice",
    practice_focused_banner: "🎯 Focused mode · {count} characters",
    practice_exit: "Exit",
    practice_mode_write: "Write",
    practice_mode_speak: "Speak",

    // Progress
    progress_title: "Progress",
    progress_accuracy_label: "Accuracy",
    progress_accuracy_sub: "in hiragana",
    progress_mastered_label: "Mastered",
    progress_streak_sub: "{streak}-day streak",
    progress_error_map_title: "Error map",
    progress_empty_msg: "Not enough data yet. Practice a bit and the characters giving you the most trouble will show up here.",
    progress_btn_focused: "Practice my mistakes",
    progress_error_rate: "{rate}% error rate · {errors}/{attempts} attempts",
    progress_confusion: "Often confused with \"{char}\"",

    // Quiz (Write mode)
    quiz_question: "What's this character?",
    quiz_listen_aria: "Listen",
    quiz_correct: "Correct! +10 XP",
    quiz_incorrect: "It was \"{romaji}\"",

    // Pronunciation (Speak mode)
    pron_instruction: "Say this character out loud",
    pron_hint_aria: "Hear example",
    pron_tap_to_speak: "Tap to speak",
    pron_listening: "Listening...",
    pron_correct: "Nice pronunciation! +10 XP",
    pron_heard: "We heard \"{heard}\" — the answer is \"{char}\"",
    pron_not_recognized: "Didn't quite catch that. The answer is \"{char}\"",
    pron_next: "Next →",
    pron_retry: "Try again",
    pron_generic_error: "Something went wrong, try again.",
    pron_err_not_allowed: "Turn on microphone access for Chrome in your phone's settings.",
    pron_err_no_speech: "Didn't hear anything. Get closer to the mic and try again.",
    pron_err_network: "Speech recognition needs an internet connection.",
    pron_err_audio_capture: "No microphone was found.",
    pron_err_not_supported: "Your browser doesn't support speech recognition. Use Chrome on Android.",

    // Profile (placeholder)
    profile_title: "Profile",
    profile_soon: "Coming soon",
    profile_desc: "Here you'll be able to adjust your level, reset progress, and check your achievements.",

    // main.js
    load_error: "Couldn't load the content. Make sure data/kana.json was uploaded correctly.",

    // Language switch
    lang_switch_aria: "Switch language",
  },
};
