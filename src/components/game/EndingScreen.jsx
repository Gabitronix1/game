import { motion } from "framer-motion";
import { RotateCcw, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ENDINGS_INFO } from "../../lib/storyData";
import EmotionTracker from "./EmotionTracker";

export default function EndingScreen({ scene, emotions, choicesMade, onRestart }) {
  const endingInfo = ENDINGS_INFO[scene.endingType];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-background flex items-center justify-center p-4"
    >
      <div className="max-w-xl w-full space-y-8">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center space-y-4"
        >
          <span className="text-[10px] font-special uppercase tracking-[0.4em] text-primary">
            Fin de la Historia
          </span>
          <h1 className="font-special text-3xl md:text-4xl text-foreground">
            {scene.title}
          </h1>
          <div
            className="inline-block px-4 py-1.5 rounded-full text-xs font-special uppercase tracking-wider"
            style={{
              backgroundColor: endingInfo?.color + "20",
              color: endingInfo?.color,
              border: `1px solid ${endingInfo?.color}40`,
            }}
          >
            Final: {endingInfo?.title}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card/50 border border-border/50 rounded-lg p-6"
        >
          <p className="font-fell text-base leading-relaxed text-foreground/85 whitespace-pre-line">
            {scene.narrative}
          </p>
        </motion.div>

        {scene.historicalNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-primary/5 border border-primary/20 rounded-lg p-4"
          >
            <p className="text-xs font-inter text-muted-foreground leading-relaxed">
              📖 {scene.historicalNote}
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <EmotionTracker emotions={emotions} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="bg-card/30 border border-border/40 rounded-lg p-4"
        >
          <p className="text-xs font-special uppercase tracking-widest text-muted-foreground mb-2">
            Decisiones Tomadas: {choicesMade}
          </p>
          <p className="text-xs font-inter text-muted-foreground">
            Cada decisión moldeó el destino de Karl. Hay {Object.keys(ENDINGS_INFO).length} finales posibles. ¿Quieres descubrir los demás?
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="flex justify-center"
        >
          <Button
            onClick={onRestart}
            className="font-special uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Jugar de Nuevo
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}