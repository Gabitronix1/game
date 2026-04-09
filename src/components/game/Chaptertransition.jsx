import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CHAPTER_DATA = {
  "Capítulo II": {
    line: "Seis semanas para fabricar un soldado.",
    context: "El ejército alemán entrenaba a sus reclutas con una presión psicológica diseñada para reemplazar la identidad individual por la del soldado del Reich. La obediencia no era un valor — era el único valor.",
    stat: "1.200.000 alemanes movilizados en septiembre de 1939",
    atmosphere: "intense",
  },
  "Capítulo III": {
    line: "Francia. Primavera de 1940.",
    context: "La Blitzkrieg barrió Francia en cuarenta y dos días. Lo que parecía invencible cayó en semanas. Para los soldados alemanes, la victoria fue tan rápida que casi resultó irreal. Para los franceses, fue el fin de un mundo.",
    stat: "6 semanas. De la frontera belga a París.",
    atmosphere: "chaos",
  },
  "Capítulo IV": {
    line: "La ciudad más bella del mundo, ocupada.",
    context: "París fue declarada ciudad abierta para evitar su destrucción. Los nazis desfilaron por los Campos Elíseos. En los cafés, la gente miraba hacia otro lado. Resistir, entonces, significaba simplemente no aplaudir.",
    stat: "14 de junio, 1940 — París cae sin un disparo",
    atmosphere: "bittersweet",
  },
  "Capítulo V": {
    line: "El este no es como Francia.",
    context: "La Operación Barbarroja fue la mayor invasión terrestre de la historia. Hitler prometió una guerra de semanas. El invierno ruso, a cuarenta grados bajo cero, demostró que los mapas mienten y los generales también.",
    stat: "−42°C. El aceite de los fusiles se congelaba.",
    atmosphere: "despair",
  },
  "Capítulo VI": {
    line: "Stalingrado. El nombre ya lo dice todo.",
    context: "La batalla duró 199 días. Los alemanes la llamaban Rattenkrieg — guerra de ratas. Se combatía habitación por habitación, piso por piso. Los soviéticos defendían cada metro como si fuera el último. Porque lo era.",
    stat: "300.000 hombres cercados. Menos de 6.000 volvieron a casa.",
    atmosphere: "horror",
  },
  "Epílogo": {
    line: "Lo que queda cuando todo termina.",
    context: "La guerra terminó en 1945. Para muchos soldados, no terminó nunca. Volvieron a países destruidos, a familias que habían aprendido a vivir sin ellos, cargando con cosas que no tenían nombre todavía. Lo que hoy llamamos trauma, entonces se llamaba silencio.",
    stat: "70 millones de muertos. La guerra más mortífera de la historia.",
    atmosphere: "melancholy",
  },
};

const ATMOSPHERE_ACCENT = {
  intense:     "hsl(38, 60%, 50%)",
  chaos:       "hsl(0, 60%, 50%)",
  bittersweet: "hsl(38, 40%, 45%)",
  despair:     "hsl(220, 30%, 50%)",
  horror:      "hsl(0, 50%, 40%)",
  melancholy:  "hsl(220, 20%, 45%)",
};

export default function ChapterTransition({ chapter, year, location, onComplete }) {
  const data = CHAPTER_DATA[chapter] || {
    line: "",
    context: "",
    stat: "",
    atmosphere: "intense",
  };

  const accentColor = ATMOSPHERE_ACCENT[data.atmosphere] || "hsl(38, 60%, 50%)";
  const [buttonVisible, setButtonVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setButtonVisible(true), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden"
    >
      {/* Gradiente de fondo sutil por atmósfera */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          background: `radial-gradient(ellipse at center, ${accentColor} 0%, transparent 70%)`,
        }}
      />

      {/* Líneas horizontales decorativas */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
        className="absolute top-[38%] left-0 right-0 h-px origin-left"
        style={{ backgroundColor: `${accentColor}25` }}
      />
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 0.3 }}
        className="absolute top-[63%] left-0 right-0 h-px origin-right"
        style={{ backgroundColor: `${accentColor}25` }}
      />

      {/* Contenido central */}
      <div className="relative z-10 px-8 md:px-16 max-w-2xl mx-auto w-full space-y-7">

        {/* Cabecera: capítulo + año */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="flex items-center gap-4"
        >
          <span
            className="text-[10px] font-special uppercase tracking-[0.6em] flex-shrink-0"
            style={{ color: accentColor }}
          >
            {chapter}
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: `${accentColor}35` }} />
          <span className="text-[10px] font-inter text-muted-foreground/50 tracking-widest flex-shrink-0">
            {year}
          </span>
        </motion.div>

        {/* Frase principal */}
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="font-special text-2xl md:text-3xl text-foreground leading-snug"
        >
          {data.line}
        </motion.h2>

        {/* Localización */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95, duration: 0.6 }}
          className="font-fell text-sm text-muted-foreground/60 italic"
        >
          {location}
        </motion.p>

        {/* Separador acento */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="w-8 h-px origin-left"
          style={{ backgroundColor: accentColor }}
        />

        {/* Contexto histórico */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="font-fell text-base md:text-lg text-foreground/75 leading-relaxed"
        >
          {data.context}
        </motion.p>

        {/* Dato estadístico */}
        {data.stat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.9, duration: 0.6 }}
            className="flex items-start gap-3"
          >
            <div
              className="w-0.5 self-stretch flex-shrink-0 rounded-full mt-0.5"
              style={{ backgroundColor: accentColor }}
            />
            <p
              className="font-inter text-xs tracking-wide leading-relaxed"
              style={{ color: `${accentColor}bb` }}
            >
              {data.stat}
            </p>
          </motion.div>
        )}

        {/* Botón continuar — aparece tras 2.5s */}
        <AnimatePresence>
          {buttonVisible && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="pt-2"
            >
              <button
                onClick={onComplete}
                className="group flex items-center gap-3 text-xs font-special uppercase tracking-[0.3em] transition-colors duration-200 hover:opacity-80"
                style={{ color: accentColor }}
              >
                <span>Continuar</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Número de capítulo como marca de agua */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.025 }}
        transition={{ delay: 0.5, duration: 1.2 }}
        className="absolute right-4 bottom-4 font-special leading-none select-none text-foreground pointer-events-none"
        style={{ fontSize: "clamp(100px, 18vw, 200px)" }}
      >
        {chapter.replace("Capítulo ", "").replace("Epílogo", "∞")}
      </motion.span>
    </motion.div>
  );
}
