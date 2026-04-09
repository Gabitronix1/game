import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Frases que aparecen en la transición según el capítulo
const CHAPTER_LINES = {
  "Capítulo II":  "Seis semanas para fabricar un soldado.",
  "Capítulo III": "Francia. Primavera de 1940. Un rayo.",
  "Capítulo IV":  "París cayó en cuarenta y dos días.",
  "Capítulo V":   "El este no es como Francia.",
  "Capítulo VI":  "Stalingrado. El nombre ya lo dice todo.",
  "Epílogo":      "Lo que queda cuando todo termina.",
};

export default function ChapterTransition({ chapter, year, location, onComplete }) {
  const line = CHAPTER_LINES[chapter] || "";

  useEffect(() => {
    // La transición dura 3.2s y luego llama onComplete
    const timer = setTimeout(onComplete, 3200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        onClick={onComplete}
      >
        {/* Línea horizontal superior */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute top-1/2 left-0 right-0 h-px bg-border/30 origin-left"
        />

        {/* Línea horizontal inferior — se expande desde la derecha */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 0.1 }}
          className="absolute top-1/2 left-0 right-0 h-px bg-border/30 origin-right mt-16"
        />

        <div className="relative px-8 text-center space-y-5 max-w-lg mx-auto">

          {/* Número de capítulo */}
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-[10px] font-special uppercase tracking-[0.6em] text-primary"
          >
            {chapter}
          </motion.p>

          {/* Línea separadora */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="w-12 h-px bg-primary/50 mx-auto"
          />

          {/* Año */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="font-special text-5xl md:text-6xl text-foreground/20 tracking-widest select-none"
          >
            {year}
          </motion.p>

          {/* Ubicación */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="font-fell text-sm text-muted-foreground tracking-wide"
          >
            {location}
          </motion.p>

          {/* Línea temática del capítulo */}
          {line && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="font-fell text-xs italic text-primary/60 pt-2"
            >
              {line}
            </motion.p>
          )}

          {/* Toca para continuar */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{
              delay: 2.2,
              duration: 0.8,
              repeat: Infinity,
              repeatType: "loop",
            }}
            className="text-[9px] font-inter uppercase tracking-[0.4em] text-muted-foreground/40 pt-4"
          >
            toca para continuar
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
