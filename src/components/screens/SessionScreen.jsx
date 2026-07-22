import { ChevronLeft } from "lucide-react";
import ListenChooseExercise from "../exercises/ListenChooseExercise.jsx";
import ChooseAudioExercise from "../exercises/ChooseAudioExercise.jsx";
import SpeakExercise from "../exercises/SpeakExercise.jsx";
import MinimalPairExercise from "../exercises/MinimalPairExercise.jsx";

export default function SessionScreen({ card, index, total, onComplete, onExit, speak, voiceLang }) {
  if (!card) return null;
  const pct = total > 0 ? Math.round((index / total) * 100) : 0;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div className="session-topbar">
        <button onClick={onExit} aria-label="Salir" className="text-muted" style={{ display: "flex" }}>
          <ChevronLeft size={24} />
        </button>
        <div className="session-progress-track">
          <div className="session-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-muted text-mono" style={{ fontSize: "0.7rem", width: 40, textAlign: "right" }}>
          {index + 1}/{total}
        </span>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px 20px",
          overflowY: "auto",
        }}
      >
        {card.type === "listen-choose" && (
          <ListenChooseExercise key={card.key} card={card} speak={speak} onComplete={onComplete} />
        )}
        {card.type === "choose-audio" && (
          <ChooseAudioExercise key={card.key} card={card} speak={speak} onComplete={onComplete} />
        )}
        {card.type === "speak" && (
          <SpeakExercise key={card.key} card={card} speak={speak} voiceLang={voiceLang} onComplete={onComplete} />
        )}
        {card.type === "minimal-pair" && (
          <MinimalPairExercise key={card.key} card={card} speak={speak} onComplete={onComplete} />
        )}
      </div>
    </div>
  );
}
