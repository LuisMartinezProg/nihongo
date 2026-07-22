import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useProgress } from "./hooks/useProgress.js";
import { useTextToSpeech, isTTSSupported } from "./hooks/useTextToSpeech.js";
import { buildSessionQueue } from "./lib/sessionBuilder.js";
import { MINIMAL_PAIRS } from "./data/minimalPairs.js";

import OnboardingScreen from "./components/screens/OnboardingScreen.jsx";
import HomeScreen from "./components/screens/HomeScreen.jsx";
import SessionScreen from "./components/screens/SessionScreen.jsx";
import SessionSummaryScreen from "./components/screens/SessionSummaryScreen.jsx";
import ProgressScreen from "./components/screens/ProgressScreen.jsx";
import SettingsScreen from "./components/screens/SettingsScreen.jsx";
import BottomNav from "./components/BottomNav.jsx";

export default function App() {
  const {
    progress,
    ready,
    milestoneHit,
    saveError,
    finishOnboarding,
    updateSettings,
    resetProgress,
    bumpMinimalPairIndex,
    applyCardResult,
    markPerfectSession,
    clearMilestone,
  } = useProgress();

  const [screen, setScreen] = useState("home");
  const [sessionQueue, setSessionQueue] = useState([]);
  const [sessionIndex, setSessionIndex] = useState(0);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0, xpEarned: 0 });

  const speak = useTextToSpeech(progress?.settings?.voiceLang, progress?.settings?.speechRate);

  if (!ready || !progress) {
    return (
      <div className="loading-screen">
        <Loader2 size={32} className="spin" color="var(--color-primary)" />
      </div>
    );
  }

  const effectiveScreen = !progress.onboarded ? "onboarding" : screen;

  function handleOnboardingFinish(patch) {
    finishOnboarding(patch);
    setScreen("home");
  }

  function handleStartSession() {
    const queue = buildSessionQueue(progress, 12);
    setSessionQueue(queue);
    setSessionIndex(0);
    setSessionStats({ correct: 0, total: 0, xpEarned: 0 });
    clearMilestone();
    bumpMinimalPairIndex(2, MINIMAL_PAIRS.length);
    setScreen("session");
  }

  function handleCardComplete(result) {
    const card = sessionQueue[sessionIndex];
    applyCardResult(card, result);

    const newCorrect = sessionStats.correct + (result.correct ? 1 : 0);
    const newTotal = sessionStats.total + 1;
    const newXpEarned = sessionStats.xpEarned + result.xp;
    setSessionStats({ correct: newCorrect, total: newTotal, xpEarned: newXpEarned });

    const nextIndex = sessionIndex + 1;
    const sessionEnding = nextIndex >= sessionQueue.length;
    if (sessionEnding) {
      if (newCorrect === newTotal && newTotal >= 8) {
        markPerfectSession();
      }
      setScreen("summary");
    } else {
      setSessionIndex(nextIndex);
    }
  }

  return (
    <div className="app-shell">
      {!isTTSSupported && (
        <div className="banner-warning">
          Tu navegador no soporta audio de voz. Algunas funciones pueden no sonar.
        </div>
      )}
      <div className="app-shell__content">
        {effectiveScreen === "onboarding" && <OnboardingScreen onFinish={handleOnboardingFinish} />}
        {effectiveScreen === "home" && <HomeScreen progress={progress} onStart={handleStartSession} />}
        {effectiveScreen === "session" && (
          <SessionScreen
            card={sessionQueue[sessionIndex]}
            index={sessionIndex}
            total={sessionQueue.length}
            onComplete={handleCardComplete}
            onExit={() => setScreen("home")}
            speak={speak}
            voiceLang={progress.settings.voiceLang}
          />
        )}
        {effectiveScreen === "summary" && (
          <SessionSummaryScreen
            sessionStats={sessionStats}
            streak={progress.streak}
            milestoneHit={milestoneHit}
            onContinue={() => setScreen("home")}
          />
        )}
        {effectiveScreen === "progress" && <ProgressScreen progress={progress} />}
        {effectiveScreen === "settings" && (
          <SettingsScreen progress={progress} onUpdateSettings={updateSettings} onReset={resetProgress} />
        )}
      </div>
      {["home", "progress", "settings"].includes(effectiveScreen) && (
        <BottomNav screen={effectiveScreen} onNavigate={setScreen} />
      )}
      {saveError && <div className="toast-error">No se pudo guardar tu progreso en este navegador</div>}
    </div>
  );
}
