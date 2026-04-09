import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Swords, BookOpen, Heart, AlertTriangle, RotateCcw } from "lucide-react";
import { ENDINGS_INFO } from "../lib/storyData";
import { hasSave, loadGame, getUnlockedEndings, clearAllData } from "../lib/saveSystem";

export default function Landing() {
  const navigate = useNavigate();
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [saveExists, setSaveExists] = useState(false);
  const [unlockedEndings, setUnlockedEndings] = useState([]);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    setSaveExists(hasSave());
    setUnlockedEndings(getUnlockedEndings());
  }, []);

  const handleContinue = () => {
    navigate("/game", { state: { loadSave: true } });
  };

  const handleNewGame = () => {
    navigate("/game", { state: { loadSave: false } });
  };

  const handleClearData = () => {
    clearAllData();
    setSaveExists(false);
    setUnlockedEndings([]);
    setConfirmClear(false);
  };

  const endingsList = Object.entries(ENDINGS_INFO);
  const totalEndings = endingsList.length;
  const unlockedCount = unlockedEndings.length;

  return (
    <div className="min-h-screen bg-background film-grain relative overflow-hidden">
      {/* Fondo */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card/50" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-2xl mx-auto w-full space-y-8"
        >
          {/* Icono */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center"
          >
            <div className="w-16 h-16 border-2 border-primary/40 rounded-full flex items-center justify-center">
              <Swords className="w-7 h-7 text-primary" />
            </div>
          </motion.div>

          {/* Título */}
          <div className="space-y-3">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[10px] font-special uppercase tracking-[0.5em] text-primary"
            >
              Una Aventura Interactiva de Historia
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="font-special text-4xl md:text-6xl text-foreground leading-tight"
            >
              Cenizas<br />
              <span className="text-primary">del Frente</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="font-fell text-base md:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed"
            >
              Berlín, 1939. Eres Karl Müller, un joven carpintero llamado a filas.
              La guerra te espera. Tus decisiones definirán tu destino.
            </motion.p>
          </div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="flex flex-wrap justify-center gap-6 text-xs font-inter text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-primary/70" />
              Historia real
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-accent/70" />
              {totalEndings} finales posibles
            </span>
            <span className="flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5 text-primary/70" />
              Decisiones morales
            </span>
          </motion.div>

          {/* Botones de acción */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="space-y-3"
          >
            {/* Continuar partida si existe */}
            {saveExists && (
              <div>
                <Button
                  size="lg"
                  onClick={handleContinue}
                  className="font-special uppercase tracking-[0.2em] text-sm bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-6 w-full max-w-xs"
                >
                  Continuar partida
                </Button>
              </div>
            )}

            {/* Nueva partida */}
            <div>
              <Button
                size="lg"
                variant={saveExists ? "outline" : "default"}
                onClick={handleNewGame}
                className={`font-special uppercase tracking-[0.2em] text-sm px-10 py-6 w-full max-w-xs ${
                  saveExists
                    ? "border-primary/30 text-primary hover:bg-primary/10"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {saveExists ? "Nueva partida" : "Comenzar"}
              </Button>
            </div>

            <button
              onClick={() => setShowDisclaimer(!showDisclaimer)}
              className="block mx-auto text-[10px] font-inter text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
            >
              Nota sobre el contenido
            </button>
          </motion.div>

          {/* Disclaimer */}
          <AnimatePresence>
            {showDisclaimer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 max-w-md mx-auto">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <p className="text-xs font-inter text-muted-foreground leading-relaxed text-left">
                      Este juego tiene fines exclusivamente educativos. Presenta la perspectiva de un soldado alemán
                      para explorar la complejidad moral de la guerra. No glorifica ni justifica el nazismo ni
                      ninguna forma de violencia. Los hechos históricos se presentan con respeto a todas las víctimas.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Galería de finales ─────────────────────────── */}
          {unlockedCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="pt-4"
            >
              <div className="border-t border-border/30 pt-8 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <p className="text-[10px] font-special uppercase tracking-[0.4em] text-muted-foreground">
                      Finales descubiertos
                    </p>
                    <span
                      className="text-[10px] font-inter px-2 py-0.5 rounded-full border"
                      style={{ color: "hsl(38, 60%, 50%)", borderColor: "hsl(38, 60%, 50%, 0.3)" }}
                    >
                      {unlockedCount} / {totalEndings}
                    </span>
                  </div>
                </div>

                {/* Grid de finales */}
                <div className="grid grid-cols-5 gap-2">
                  {endingsList.map(([key, ending]) => {
                    const isUnlocked = unlockedEndings.includes(key);
                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 * endingsList.findIndex(([k]) => k === key) }}
                        className={`relative rounded-lg border p-3 flex flex-col items-center gap-2 transition-all duration-300 ${
                          isUnlocked
                            ? "border-border/50 bg-card/50"
                            : "border-border/20 bg-card/20"
                        }`}
                        style={isUnlocked ? {
                          borderColor: `${ending.color}40`,
                          boxShadow: `0 0 12px ${ending.color}10`,
                        } : {}}
                      >
                        {/* Icono */}
                        <span className={`text-xl transition-all ${isUnlocked ? "" : "grayscale opacity-20"}`}>
                          {isUnlocked ? ending.icon : "?"}
                        </span>

                        {/* Título */}
                        <p
                          className="text-[9px] font-special uppercase tracking-wide text-center leading-tight"
                          style={{ color: isUnlocked ? ending.color : "hsl(var(--muted-foreground))" }}
                        >
                          {isUnlocked ? ending.title : "???"}
                        </p>

                        {/* Descripción al hover — solo si desbloqueado */}
                        {isUnlocked && (
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full w-40 pointer-events-none opacity-0 hover:opacity-100 group-hover:opacity-100 z-10">
                            <div className="bg-card border border-border/60 rounded-lg p-2 shadow-xl">
                              <p className="text-[10px] font-inter text-muted-foreground leading-relaxed">
                                {ending.description}
                              </p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Barra de progreso */}
                <div className="space-y-1.5">
                  <div className="h-1 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(unlockedCount / totalEndings) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                  {unlockedCount < totalEndings && (
                    <p className="text-[9px] font-inter text-muted-foreground/50 text-center">
                      {totalEndings - unlockedCount} {totalEndings - unlockedCount === 1 ? "final sin descubrir" : "finales sin descubrir"}
                    </p>
                  )}
                  {unlockedCount === totalEndings && (
                    <p className="text-[9px] font-special uppercase tracking-widest text-primary/60 text-center">
                      Todos los finales descubiertos
                    </p>
                  )}
                </div>

                {/* Borrar datos */}
                {!confirmClear ? (
                  <button
                    onClick={() => setConfirmClear(true)}
                    className="flex items-center gap-1.5 mx-auto text-[9px] font-inter text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    Borrar todos los datos
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center gap-3"
                  >
                    <p className="text-[9px] font-inter text-muted-foreground/50">¿Borrar todo?</p>
                    <button
                      onClick={handleClearData}
                      className="text-[9px] font-inter text-destructive/60 hover:text-destructive transition-colors"
                    >
                      Sí, borrar
                    </button>
                    <button
                      onClick={() => setConfirmClear(false)}
                      className="text-[9px] font-inter text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                    >
                      Cancelar
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Línea decorativa inferior */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        />
      </div>
    </div>
  );
}
