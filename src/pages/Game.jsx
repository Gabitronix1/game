import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { scenes, isChoiceLocked } from "../lib/storyData";
import { CHOICE_FLAGS, buildNarrative } from "../lib/narrativeMemory";
import { INITIAL_EMOTIONS } from "../components/game/EmotionTracker";
import { saveGame, loadGame, unlockEnding } from "../lib/saveSystem";
import SceneHeader from "../components/game/SceneHeader";
import TypewriterText from "../components/game/TypewriterText";
import ChoiceButton from "../components/game/ChoiceButton";
import HistoricalNote from "../components/game/HistoricalNote";
import EmotionTracker from "../components/game/EmotionTracker";
import EndingScreen from "../components/game/EndingScreen";
import ChapterTransition from "../components/game/ChapterTransition";
import PauseMenu from "../components/game/PauseMenu";
import SoundToggle from "../components/game/SoundToggle";
import { ChevronDown, Menu } from "lucide-react";
import { useAmbientSound } from "../hooks/useAmbientSound";
import { useTypewriterSound } from "../hooks/useTypewriterSound";
import { useVignette } from "../hooks/useVignette";

const HIGH_IMPACT_ATMOSPHERES = new Set(["horror", "violence", "moral_dilemma", "chaos"]);

export default function Game() {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentSceneId, setCurrentSceneId] = useState("intro");
  const [emotions, setEmotions]             = useState({ ...INITIAL_EMOTIONS });
  const [choicesMade, setChoicesMade]       = useState([]);
  const [narrativeFlags, setNarrativeFlags] = useState({});
  const [textComplete, setTextComplete]     = useState(false);
  const [transitioning, setTransitioning]   = useState(false);
  const [chapterTransition, setChapterTransition] = useState(null);
  const [isPaused, setIsPaused]             = useState(false);

  const currentChapterRef = useRef(scenes["intro"]?.chapter);

  const sound      = useAmbientSound();
  const typeSound  = useTypewriterSound();
  const vignette   = useVignette();

  // Cargar partida guardada si viene del Landing con loadSave: true
  useEffect(() => {
    if (location.state?.loadSave) {
      const save = loadGame();
      if (save) {
        setCurrentSceneId(save.currentSceneId);
        setEmotions(save.emotions);
        setChoicesMade(save.choicesMade || []);
        setNarrativeFlags(save.narrativeFlags || {});
        const scene = scenes[save.currentSceneId];
        if (scene) currentChapterRef.current = scene.chapter;
      }
    }
  }, []);

  // ESC para pausa
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && !chapterTransition) {
        setIsPaused((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [chapterTransition]);

  const currentScene = scenes[currentSceneId];

  // Actualizar atmósfera de audio y visual cuando cambia la escena
  useEffect(() => {
    if (!currentScene) return;
    sound.setAtmosphere(currentScene.atmosphere);
    vignette.updateAtmosphere(currentScene.atmosphere);
  }, [currentSceneId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Actualizar vignette cuando cambian las emociones
  useEffect(() => {
    vignette.updateEmotions(emotions);
  }, [emotions]); // eslint-disable-line react-hooks/exhaustive-deps

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
      if (transitioning || isPaused) return;
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

      if (HIGH_IMPACT_ATMOSPHERES.has(currentScene.atmosphere)) {
        vignette.triggerImpactFlash();
      }

      const nextScene   = scenes[choice.nextScene];
      const nextChapter = nextScene?.chapter;
      const isChapterChange =
        nextChapter &&
        nextChapter !== currentScene.chapter &&
        nextChapter !== currentChapterRef.current;

      setTimeout(() => {
        if (isChapterChange) {
          currentChapterRef.current = nextChapter;
          setChapterTransition({
            chapter:     nextChapter,
            year:        nextScene.year,
            location:    nextScene.location,
            nextSceneId: choice.nextScene,
          });
          setTransitioning(false);
        } else {
          setCurrentSceneId(choice.nextScene);
          setTextComplete(false);
          setTransitioning(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 500);
    },
    [currentScene, applyEmotionShift, transitioning, isPaused, vignette]
  );

  const handleTransitionComplete = useCallback(() => {
    if (!chapterTransition) return;
    const { nextSceneId } = chapterTransition;
    setChapterTransition(null);
    setCurrentSceneId(nextSceneId);
    setTextComplete(false);
    setTransitioning(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [chapterTransition]);

  const handleRestart = useCallback(() => {
    setCurrentSceneId("intro");
    setEmotions({ ...INITIAL_EMOTIONS });
    setChoicesMade([]);
    setNarrativeFlags({});
    setTextComplete(false);
    setChapterTransition(null);
    setTransitioning(false);
    setIsPaused(false);
    currentChapterRef.current = scenes["intro"]?.chapter;
  }, []);

  const handleGoHome = useCallback(() => {
    sound.disable();
    navigate("/");
  }, [navigate, sound]);

  // Activar todos los sistemas de sonido con un solo click
  const handleSoundEnable = useCallback(() => {
    sound.enable();
    typeSound.enable();
  }, [sound, typeSound]);

  const handleSoundDisable = useCallback(() => {
    sound.disable();
    typeSound.disable();
  }, [sound, typeSound]);

  const gameState = {
    currentSceneId,
    emotions,
    choicesMade,
    narrativeFlags,
  };

  if (!currentScene) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground font-inter">Escena no encontrada</p>
      </div>
    );
  }

  if (currentScene.isEnding) {
    if (currentScene.endingType) {
      unlockEnding(currentScene.endingType);
    }
    sound.disable();
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

  return (
    <div className="min-h-screen bg-background film-grain">

      <PauseMenu
        isOpen={isPaused}
        onClose={() => setIsPaused(false)}
        onRestart={handleRestart}
        onGoHome={handleGoHome}
        gameState={gameState}
      />

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
            onClick={() => setIsPaused(true)}
            className="flex items-center gap-2 text-[10px] font-special uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            <Menu className="w-3.5 h-3.5" />
            Menú
          </button>
          <div className="flex items-center gap-4">
            <SoundToggle
              onEnable={handleSoundEnable}
              onDisable={handleSoundDisable}
            />
            <span className="text-[10px] font-special uppercase tracking-widest text-muted-foreground">
              Decisiones: {choicesMade.length}
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSceneId}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
          >
            <SceneHeader scene={currentScene} />

            <div className="mb-6">
              <TypewriterText
                key={currentSceneId}
                text={narrative}
                baseSpeed={baseSpeed}
                onComplete={() => setTextComplete(true)}
                onTick={(charType) => typeSound.tick(charType)}
                onCarriageReturn={() => typeSound.carriageReturn()}
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
                    disabled={transitioning}
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

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
