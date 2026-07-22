# Racha de Inglés 🔥

App de práctica de inglés estilo "racha" (como Duolingo), pero enfocada 100% en
**reconocimiento auditivo y habla** — cero ejercicios de escribir.

## Por qué está diseñada así

- **Repetición espaciada (SM-2)**: cada palabra vuelve justo antes de que se te olvide.
  El efecto de espaciado es uno de los hallazgos más robustos en investigación de
  aprendizaje, incluyendo meta-análisis específicos de adquisición de segundas
  lenguas (Kim & Webb, 2022).
- **Recuperación activa, no solo exposición**: cada ejercicio te obliga a recordar la
  respuesta antes de mostrártela. Karpicke & Roediger (2008) mostraron justamente con
  vocabulario de idiomas que repasar pasivamente no mejora la retención a largo plazo,
  pero volver a ser evaluado sí.
- **Escucha antes que habla**: toda palabra nueva se presenta primero como
  reconocimiento auditivo (audio → significado). Solo después se te pide decirla en
  voz alta — el orden de "comprensión antes que producción" viene de la hipótesis del
  input de Krashen, aunque la app también incluye práctica de habla explícita porque
  la investigación (Swain) muestra que la sola comprensión no basta para hablar con
  precisión.
- **Pares mínimos**: ejercicios de discriminación auditiva con los contrastes de
  sonido donde más se equivocan los hispanohablantes (ship/sheep, think/sink,
  berry/very...), inspirados en el entrenamiento fonético perceptivo (HVPT), validado
  específicamente en estudios con hispanohablantes aprendiendo inglés.
- **Habla con feedback real**: usa el reconocimiento de voz del navegador para
  verificar tu pronunciación cuando está disponible, con un modo alterno de
  autoevaluación si tu navegador o dispositivo no da acceso al micrófono.
- **Racha + sesiones cortas**: la práctica corta y frecuente sostiene mejor el hábito
  que sesiones largas y esporádicas. El sistema de racha (con "congeladores" que
  perdonan un día saltado) está inspirado en el diseño de Duolingo.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre la URL que te muestra Vite (normalmente `http://localhost:5173`).

## Cómo compilarlo para producción / GitHub Pages

```bash
npm run build
```

Esto genera la carpeta `dist/` lista para servir estáticamente (Vercel, Netlify,
GitHub Pages, etc.).

## Estructura del proyecto

```
src/
  data/          → vocabulario, pares mínimos, logros, metas diarias
  lib/           → lógica pura: repetición espaciada, rachas, construcción de
                   sesión, coincidencia de voz, selectores de progreso
  hooks/         → useProgress (estado persistente), useTextToSpeech,
                   useSpeechRecognition
  components/
    exercises/   → los 4 tipos de ejercicio
    screens/     → pantallas de la app
  styles/        → sistema de diseño en CSS puro (sin Tailwind ni deps de build)
```

## Notas técnicas

- El progreso se guarda en `localStorage` del navegador — es local a cada
  dispositivo/navegador, no se sincroniza entre ellos.
- El reconocimiento de voz (`SpeechRecognition`) funciona mejor en Chrome/Edge. En
  navegadores sin soporte (o sin permiso de micrófono), la app cae automáticamente a
  un modo de autoevaluación para que la práctica nunca se bloquee.
- Para agregar más vocabulario, edita `src/data/vocabulary.js` — es solo un array de
  filas `[inglés, español, categoría]`.
- Para agregar más pares mínimos, edita `src/data/minimalPairs.js` de la misma forma.
