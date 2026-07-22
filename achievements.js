import { Flame, BookOpen, Trophy, Star, Sparkles } from "lucide-react";
import { levelFromXP } from "../lib/srs.js";
import { masteredCount } from "../lib/selectors.js";
import { VOCAB } from "./vocabulary.js";

export const ACHIEVEMENTS = [
  { id: "streak7", label: "Racha 7 días", icon: Flame, check: (p) => p.streak.longest >= 7 },
  { id: "streak30", label: "Racha 30 días", icon: Flame, check: (p) => p.streak.longest >= 30 },
  { id: "streak100", label: "Racha 100 días", icon: Flame, check: (p) => p.streak.longest >= 100 },
  { id: "words25", label: "25 palabras", icon: BookOpen, check: (p) => masteredCount(p) >= 25 },
  { id: "words50", label: "50 palabras", icon: BookOpen, check: (p) => masteredCount(p) >= 50 },
  {
    id: "wordsAll",
    label: `${VOCAB.length} palabras`,
    icon: Trophy,
    check: (p) => masteredCount(p) >= VOCAB.length,
  },
  { id: "perfect", label: "Sesión perfecta", icon: Star, check: (p) => !!p.stats.hadPerfectSession },
  { id: "level5", label: "Nivel 5", icon: Sparkles, check: (p) => levelFromXP(p.xp.total) >= 5 },
];
