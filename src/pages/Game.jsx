import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { scenes, INITIAL_EMOTIONS, isChoiceLocked } from "../lib/storyData";
import { CHOICE_FLAGS, buildNarrative } from "../lib/narrativeMemory";
import SceneHeader from "../components/game/SceneHeader";
import TypewriterText from "../components/game/TypewriterText";
import ChoiceButton from "../components/game/ChoiceButton";
import HistoricalNote from "../components/game/HistoricalNote";
import EmotionTracker from "../components/game/EmotionTracker";
import EndingScreen from "../components/game/EndingScreen";
import ChapterTransition from "../components/game/ChapterTransition";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export default function Game() {
  const navigate = useNavigate();

  // sceneId que se está MOSTRANDO (puede ir detrás de pendingSceneId durante la animación)
  const [currentSceneId, setCurrentSceneId] = useState("intro");
  // sceneId al que vamos a ir una vez que la animación de salida termine
  const [pendingSceneId, setPendingSceneId] = useState(null);

  const [emotions, setEmotions] = useState({ ...INITIAL_EMOTIONS });
  const [choicesMade, setChoicesMade] = useState([]);
  const [narrativeFlags, setNarrativeFlags] = useState({});
  const [textComplete, setTextComplete] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [chapterTransition, setChapterTransition] = useState(null);

  const currentChapterRef = useRef(scenes["intro"]?.chapter);

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

      if (CHOICE_FLAGS[choice.id]) {
        setNarrativeFlags((prev) => ({
          ...prev,
          [CHOICE_FLAGS[choice.id]]: true,
        }));
      }

      applyEmotionShift(currentScene.emotionShift);
      applyEmotionShift(choice.emotionShift);

      const nextScene = scenes[choice.nextScene];
      const nextChapter = nextScene?.chapter;
      const isChapterChange =
        nextChapter &&
        nextChapter !== currentScene.chapter &&
        nextChapter !== currentChapterRef.current;

      if (isChapterChange) {
        // Guardamos el destino para después de la transición de capítulo
        currentChapterRef.current = nextChapter;
        // Iniciamos salida de escena actual, luego mostramos la pantalla de capítulo
        setPendingSceneId(choice.nextScene);
        setTimeout(() => {
          setChapterTransition({
            chapter: nextChapter,
            year: nextScene.year,
            location: nextScene.location,
            nextSceneId: choice.nextScene,
          });
          setTransitioning(false);
        }, 500);
      } else {
        // Cambio normal: marcamos pendingSceneId para que AnimatePresence
        // no muestre el contenido nuevo hasta que onExitComplete lo permita
        setPendingSceneId(choice.nextScene);
        setTextComplete(false);
      }
    },
    [currentScene, applyEmotionShift, transitioning]
  );

  // Se llama cuando la animación de SALIDA de la escena actual termina
  const handleExitComplete = useCallback(() => {
    if (pendingSceneId && !chapterTransition) {
      setCurrentSceneId(pendingSceneId);
      setPendingSceneId(null);
      setTransitioning(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pendingSceneId, chapterTransition]);

  const handleTransitionComplete = useCallback(() => {
    if (!chapterTransition) return;
    const { nextSceneId } = chapterTransition;
    setChapterTransition(null);
    setCurrentSceneId(nextSceneId);
    setPendingSceneId(null);
    setTextComplete(false);
    setTransitioning(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [chapterTransition]);

  const handleRestart = () => {
    setCurrentSceneId("intro");
    setPendingSceneId(null);
    setEmotions({ ...INITIAL_EMOTIONS });
    setChoicesMade([]);
    setNarrativeFlags({});
    setTextComplete(false);
    setChapterTransition(null);
    setTransitioning(false);
    currentChapterRef.current = scenes["intro"]?.chapter;
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

  const narrative = buildNarrative(currentScene, narrativeFlags);

  // La escena visible es la actual; solo mostramos su contenido
  // si NO hay un pendingSceneId esperando (evita el flash del texto nuevo)
  const showContent = !pendingSceneId || !!chapterTransition;

  return (
    <div className="min-h-screen bg-background film-grain">

      {/* Transición entre capítulos */}
      <AnimatePresence>
        {chapterTransition && (
          <ChapterTransition
            key="chapter-transition"
            chapter={chapterTransition.chapter}
            year={chapterTransition.year}
            location={chapterTransition.location}
            onComplete={handleTransitionComplete}
          />
        )}
      </AnimatePresence>

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

        <AnimatePresence
          mode="wait"
          onExitComplete={handleExitComplete}
        >
          <motion.div
            // La key cambia solo cuando currentSceneId cambia,
            // no cuando pendingSceneId cambia — así la animación de salida
            // se dispara en el momento correcto
            key={currentSceneId}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : -8 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45 }}
          >
            {showContent && (
              <>
                <SceneHeader scene={currentScene} />

                <div className="mb-6">
                  <TypewriterText
                    key={currentSceneId}
                    text={narrative}
                    baseSpeed={baseSpeed}
                    onComplete={() => setTextComplete(true)}
                  />
                </div>

                {textComplete && (
                  <HistoricalNote note={currentScene.historicalNote} />
                )}

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
                        disabled={transitioning || !!pendingSceneId}
                        locked={isChoiceLocked(choice, emotions)}
                        lockedMessage={choice.lockedMessage}
                      />
                    ))}
                  </motion.div>
                )}

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
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
