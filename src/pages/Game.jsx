import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { scenes, INITIAL_EMOTIONS, isChoiceLocked } from "../lib/storyData";
import { CHOICE_FLAGS, buildNarrative } from "../lib/narrativeMemory";
import SceneHeader from "../components/game/SceneHeader";
import TypewriterText from "../components/game/TypewriterText";
import ChoiceButton from "../components/game/ChoiceButton";
import HistoricalNote from "../components/game/HistoricalNote";
import EmotionTracker from "../components/game/EmotionTracker";
import EndingScreen from "../components/game/EndingScreen";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export default function Game() {
  const navigate = useNavigate();
  const [currentSceneId, setCurrentSceneId] = useState("intro");
  const [emotions, setEmotions] = useState({ ...INITIAL_EMOTIONS });
  const [choicesMade, setChoicesMade] = useState([]);
  const [narrativeFlags, setNarrativeFlags] = useState({});
  const [textComplete, setTextComplete] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const currentScene = scenes[currentSceneId];

  const ATMOSPHERE_SPEED = {
    horror:        6,
    violence:      7,
    chaos:         7,
    tension:       9,
    moral_dilemma: 10,
    intense:       10,
    despair:       14,
    melancholy:    16,
    intimate:      16,
    bittersweet:   15,
    stealth:       11,
    somber:        14,
  };
  const baseSpeed = ATMOSPHERE_SPEED[currentScene?.atmosphere] ?? 12;

  const applyEmotionShift = useCallback((shift) => {
    if (!shift) return;
    setEmotions((prev) => {
      const next = { ...prev };
      Object.entries(shift).forEach(([key, value]) => {
        next[key] = Math.min(100, Math.max(0, (next[key] || 0) + value));
      });
      return next;
    });
  }, []);

  const handleChoice = useCallback(
    (choice) => {
      if (transitioning) return;
      setTransitioning(true);
      setChoicesMade((prev) => [...prev, choice.id]);

      // Activar flag de memoria narrativa si la elección lo tiene
      if (CHOICE_FLAGS[choice.id]) {
        setNarrativeFlags((prev) => ({
          ...prev,
          [CHOICE_FLAGS[choice.id]]: true,
        }));
      }

      // Aplicar shifts emocionales
      applyEmotionShift(currentScene.emotionShift);
      applyEmotionShift(choice.emotionShift);

      setTimeout(() => {
        setCurrentSceneId(choice.nextScene);
        setTextComplete(false);
        setTransitioning(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 600);
    },
    [currentScene, applyEmotionShift, transitioning]
  );

  const handleRestart = () => {
    setCurrentSceneId("intro");
    setEmotions({ ...INITIAL_EMOTIONS });
    setChoicesMade([]);
    setNarrativeFlags({});
    setTextComplete(false);
  };

  if (!currentScene) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground font-inter">Escena no encontrada</p>
      </div>
    );
  }

  if (currentScene.isEnding) {
    return (
      <EndingScreen
        scene={currentScene}
        emotions={emotions}
        choicesMade={choicesMade.length}
        onRestart={handleRestart}
      />
    );
  }

  // Narrativa con inyecciones de memoria aplicadas
  const narrative = buildNarrative(currentScene, narrativeFlags);

  return (
    <div className="min-h-screen bg-background film-grain">
      <div className="max-w-2xl mx-auto px-4 py-6 md:py-10">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/")}
            className="text-[10px] font-special uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Menú
          </button>
          <span className="text-[10px] font-special uppercase tracking-widest text-muted-foreground">
            Decisiones: {choicesMade.length}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSceneId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Cabecera de escena */}
            <SceneHeader scene={currentScene} />

            {/* Texto narrativo con memoria aplicada */}
            <div className="mb-6">
              <TypewriterText
                key={currentSceneId + JSON.stringify(narrativeFlags)}
                text={narrative}
                baseSpeed={baseSpeed}
                onComplete={() => setTextComplete(true)}
              />
            </div>

            {/* Nota histórica */}
            {textComplete && (
              <HistoricalNote note={currentScene.historicalNote} />
            )}

            {/* Rastreador emocional */}
            {textComplete && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-5"
              >
                <EmotionTracker emotions={emotions} />
              </motion.div>
            )}

            {/* Elecciones */}
            {textComplete && currentScene.choices.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 space-y-3"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-special uppercase tracking-[0.3em] text-primary">
                    ¿Qué haces?
                  </span>
                  <span className="flex-1 h-px bg-border/40" />
                </div>
                {currentScene.choices.map((choice, i) => (
                  <ChoiceButton
                    key={choice.id}
                    choice={choice}
                    index={i}
                    onSelect={handleChoice}
                    disabled={transitioning}
                    locked={isChoiceLocked(choice, emotions)}
                    lockedMessage={choice.lockedMessage}
                  />
                ))}
              </motion.div>
            )}

            {/* Indicador de scroll */}
            {textComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 1 }}
                className="flex justify-center mt-10 pb-8"
              >
                <ChevronDown className="w-4 h-4 text-muted-foreground animate-bounce" />
              </motion.div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
