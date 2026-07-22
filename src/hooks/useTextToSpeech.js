import { useCallback, useEffect, useRef } from "react";

export const isTTSSupported = typeof window !== "undefined" && !!window.speechSynthesis;

export function useTextToSpeech(voiceLang, rate) {
  const voicesRef = useRef([]);

  useEffect(() => {
    function loadVoices() {
      voicesRef.current = (window.speechSynthesis && window.speechSynthesis.getVoices()) || [];
    }
    loadVoices();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = useCallback(
    (text) => {
      try {
        if (!window.speechSynthesis) return false;
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = voiceLang || "en-US";
        utter.rate = rate || 1;
        const voices = voicesRef.current;
        const exact = voices.find((v) => v.lang === voiceLang);
        const anyEnglish = voices.find((v) => (v.lang || "").toLowerCase().startsWith("en"));
        if (exact) utter.voice = exact;
        else if (anyEnglish) utter.voice = anyEnglish;
        window.speechSynthesis.speak(utter);
        return true;
      } catch (e) {
        console.error("Error de síntesis de voz", e);
        return false;
      }
    },
    [voiceLang, rate]
  );

  return speak;
}
