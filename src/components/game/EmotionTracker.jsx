import { motion } from "framer-motion";

// ── Definición de las 3 emociones ──────────────────────────
export const EMOTIONS = {
  humanidad: {
    label: "Humanidad",
    sublabel: "Lo que queda de quien eras",
    color: "hsl(38, 55%, 48%)",
    lowColor: "hsl(0, 40%, 38%)",
    poles: { high: "Intacta", low: "Fracturada" },
  },
  miedo: {
    label: "Miedo",
    sublabel: "Lo que el cuerpo sabe antes que la mente",
    color: "hsl(260, 45%, 52%)",
    lowColor: "hsl(260, 45%, 52%)",
    poles: { high: "Paralizante", low: "Controlado" },
  },
  conviccion: {
    label: "Convicción",
    sublabel: "Lo que te mantiene en pie",
    color: "hsl(200, 40%, 48%)",
    lowColor: "hsl(200, 20%, 35%)",
    poles: { high: "Firme", low: "Quebrada" },
  },
};

export const INITIAL_EMOTIONS = {
  humanidad: 80,
  miedo: 20,
  conviccion: 60,
};

// ── Frases de estado por combinación emocional ─────────────
// Se evalúan en orden — la primera que aplique gana
const STATE_PHRASES = [
  // Estados extremos primero
  {
    condition: (e) => e.humanidad <= 15 && e.miedo >= 80,
    phrase: "Karl ya no distingue bien entre el peligro real y el imaginado. Algo se ha roto.",
    tone: "critical",
  },
  {
    condition: (e) => e.humanidad <= 15 && e.conviccion <= 15,
    phrase: "Karl sigue en pie. No sabe bien por qué. El instinto es lo último en apagarse.",
    tone: "critical",
  },
  {
    condition: (e) => e.humanidad <= 20 && e.conviccion >= 50,
    phrase: "La certeza de Karl se sostiene sobre un vacío. Cree en algo. Ya no sabe si cree en él mismo.",
    tone: "dark",
  },
  {
    condition: (e) => e.miedo >= 85,
    phrase: "El miedo ya no es una señal de alarma. Es el aire que respira.",
    tone: "dark",
  },
  {
    condition: (e) => e.humanidad <= 30 && e.miedo >= 60,
    phrase: "Karl funciona. Come, obedece, avanza. Pensar demasiado tiene un coste que ya no puede pagar.",
    tone: "dark",
  },
  {
    condition: (e) => e.conviccion <= 10,
    phrase: "La convicción se fue hace tiempo. Lo que queda es inercia — seguir porque parar también cuesta.",
    tone: "dark",
  },
  // Estados medios
  {
    condition: (e) => e.humanidad >= 60 && e.miedo >= 60,
    phrase: "Karl tiene miedo y aún siente lo que eso significa. Eso, descubre, es una forma de suerte.",
    tone: "neutral",
  },
  {
    condition: (e) => e.humanidad >= 60 && e.conviccion <= 30,
    phrase: "Karl ve demasiado claramente lo que está pasando. Eso no lo hace más fácil.",
    tone: "neutral",
  },
  {
    condition: (e) => e.humanidad <= 40 && e.miedo <= 40 && e.conviccion >= 50,
    phrase: "Karl se ha vuelto eficiente. No está seguro de si eso es bueno.",
    tone: "neutral",
  },
  {
    condition: (e) => e.miedo >= 60 && e.conviccion >= 60,
    phrase: "El miedo y la convicción tiran en direcciones opuestas. Karl vive en esa tensión.",
    tone: "neutral",
  },
  {
    condition: (e) => e.humanidad <= 40 && e.conviccion <= 40,
    phrase: "Queda poco de lo que Karl era. Queda poco de lo que creía. Sigue igual.",
    tone: "dark",
  },
  // Estado inicial / relativamente estable
  {
    condition: (e) => e.humanidad >= 65 && e.miedo <= 40 && e.conviccion >= 50,
    phrase: "Karl todavía se reconoce. Por ahora.",
    tone: "ok",
  },
  {
    condition: () => true, // fallback
    phrase: "Karl avanza. Eso es lo único que sabe con certeza.",
    tone: "neutral",
  },
];

function getStatePhrase(emotions) {
  const match = STATE_PHRASES.find((s) => s.condition(emotions));
  return match || STATE_PHRASES[STATE_PHRASES.length - 1];
}

// ── Componente principal ───────────────────────────────────
export default function EmotionTracker({ emotions }) {
  const state = getStatePhrase(emotions);

  const isCritical = state.tone === "critical";
  const isDark = state.tone === "dark" || isCritical;

  return (
    <motion.div
      layout
      className={`rounded-lg border p-4 transition-colors duration-700 ${
        isCritical
          ? "bg-destructive/5 border-destructive/20"
          : isDark
          ? "bg-card/60 border-border/60"
          : "bg-card/40 border-border/40"
      }`}
    >
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-special uppercase tracking-widest text-muted-foreground">
          Estado de Karl
        </h3>
        {isCritical && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-[9px] font-inter uppercase tracking-widest text-destructive/70"
          >
            límite
          </motion.span>
        )}
      </div>

      {/* Barras de las 3 emociones */}
      <div className="space-y-3 mb-4">
        {Object.entries(EMOTIONS).map(([key, emotion], i) => {
          const value = Math.min(100, Math.max(0, emotions[key] ?? 0));
          const isLow = key === "humanidad" && value <= 25;
          const color = isLow ? emotion.lowColor : emotion.color;

          // Para humanidad: la barra se llena de derecha a izquierda
          // (alta humanidad = barra llena, baja = vacía)
          // Para miedo: barra normal (alto = llena)
          // Para convicción: barra normal
          const barWidth = `${value}%`;

          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-inter text-muted-foreground">
                    {emotion.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Polo semántico según valor */}
                  <span
                    className="text-[9px] font-inter italic"
                    style={{ color: `${color}99` }}
                  >
                    {value >= 65
                      ? emotion.poles.high
                      : value <= 30
                      ? emotion.poles.low
                      : ""}
                  </span>
                  <span className="text-[10px] font-inter tabular-nums w-5 text-right"
                    style={{ color: `${color}bb` }}>
                    {value}
                  </span>
                </div>
              </div>

              {/* Barra */}
              <div className="h-1 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: barWidth }}
                  transition={{ duration: 0.9, delay: i * 0.1, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Separador */}
      <div className="h-px bg-border/30 mb-3" />

      {/* Frase de estado */}
      <motion.p
        key={state.phrase}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`text-xs font-fell leading-relaxed italic ${
          isCritical
            ? "text-destructive/70"
            : isDark
            ? "text-muted-foreground/60"
            : "text-muted-foreground/50"
        }`}
      >
        {state.phrase}
      </motion.p>
    </motion.div>
  );
}
