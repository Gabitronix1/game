import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, RotateCcw, Home, X, Trash2, CheckCircle } from "lucide-react";
import { saveGame, deleteSave, hasSave, formatSaveDate } from "../../lib/saveSystem";

export default function PauseMenu({ isOpen, onClose, onRestart, onGoHome, gameState }) {
  const [saved, setSaved] = useState(false);
  const [saveDate, setSaveDate] = useState(null);
  const [confirmRestart, setConfirmRestart] = useState(false);
  const [confirmHome, setConfirmHome] = useState(false);

  // Actualizar fecha de guardado al abrir
  useEffect(() => {
    if (isOpen) {
      const save = hasSave();
      if (save) {
        try {
          const data = JSON.parse(localStorage.getItem("cenizas_save"));
          setSaveDate(data?.savedAt || null);
        } catch { setSaveDate(null); }
      } else {
        setSaveDate(null);
      }
      setSaved(false);
      setConfirmRestart(false);
      setConfirmHome(false);
    }
  }, [isOpen]);

  // Cerrar con ESC
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        if (confirmRestart || confirmHome) {
          setConfirmRestart(false);
          setConfirmHome(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, confirmRestart, confirmHome]);

  const handleSave = () => {
    const ok = saveGame(gameState);
    if (ok) {
      setSaved(true);
      setSaveDate(new Date().toISOString());
      setTimeout(() => setSaved(false), 2500);
    }
  };

  const handleDeleteSave = () => {
    deleteSave();
    setSaveDate(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm"
          >
            <div className="bg-card border border-border/60 rounded-xl shadow-2xl overflow-hidden">

              {/* Cabecera */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                <div>
                  <p className="text-[10px] font-special uppercase tracking-[0.4em] text-primary">
                    Pausa
                  </p>
                  <p className="text-xs font-inter text-muted-foreground mt-0.5">
                    {gameState?.currentSceneId
                      ? `Escena: ${gameState.currentSceneId.replace(/_/g, " ")}`
                      : ""}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Opciones */}
              <div className="p-4 space-y-2">

                {/* Guardar partida */}
                <div className="rounded-lg border border-border/40 bg-card/50 overflow-hidden">
                  <button
                    onClick={handleSave}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors text-left"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      saved ? "bg-green-500/20" : "bg-primary/10"
                    }`}>
                      {saved
                        ? <CheckCircle className="w-4 h-4 text-green-500" />
                        : <Save className="w-4 h-4 text-primary" />
                      }
                    </div>
                    <div>
                      <p className="text-sm font-special text-foreground">
                        {saved ? "Partida guardada" : "Guardar partida"}
                      </p>
                      {saveDate && (
                        <p className="text-[10px] font-inter text-muted-foreground mt-0.5">
                          Último guardado: {formatSaveDate(saveDate)}
                        </p>
                      )}
                    </div>
                  </button>

                  {/* Borrar guardado */}
                  {saveDate && !saved && (
                    <div className="border-t border-border/30 px-4 py-2 flex items-center justify-between">
                      <p className="text-[10px] font-inter text-muted-foreground/60">
                        Borrar partida guardada
                      </p>
                      <button
                        onClick={handleDeleteSave}
                        className="p-1 rounded text-muted-foreground/40 hover:text-destructive/70 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Continuar */}
                <button
                  onClick={onClose}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-border/40 bg-card/50 hover:bg-secondary/50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-special text-muted-foreground">▶</span>
                  </div>
                  <p className="text-sm font-special text-foreground">Continuar</p>
                </button>

                {/* Reiniciar */}
                {!confirmRestart ? (
                  <button
                    onClick={() => setConfirmRestart(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-border/40 bg-card/50 hover:bg-secondary/50 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <RotateCcw className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-special text-foreground">Reiniciar partida</p>
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-3"
                  >
                    <p className="text-xs font-fell text-muted-foreground leading-relaxed">
                      ¿Seguro? Se perderá el progreso actual. Los finales desbloqueados se conservan.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { onRestart(); onClose(); }}
                        className="flex-1 py-1.5 rounded-md bg-destructive/20 text-destructive text-xs font-special uppercase tracking-wider hover:bg-destructive/30 transition-colors"
                      >
                        Reiniciar
                      </button>
                      <button
                        onClick={() => setConfirmRestart(false)}
                        className="flex-1 py-1.5 rounded-md bg-secondary text-muted-foreground text-xs font-special uppercase tracking-wider hover:bg-secondary/80 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Ir al menú */}
                {!confirmHome ? (
                  <button
                    onClick={() => setConfirmHome(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-border/40 bg-card/50 hover:bg-secondary/50 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <Home className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-special text-foreground">Ir al menú principal</p>
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-lg border border-border/40 bg-card/50 p-4 space-y-3"
                  >
                    <p className="text-xs font-fell text-muted-foreground leading-relaxed">
                      ¿Guardar antes de salir?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { saveGame(gameState); onGoHome(); }}
                        className="flex-1 py-1.5 rounded-md bg-primary/20 text-primary text-xs font-special uppercase tracking-wider hover:bg-primary/30 transition-colors"
                      >
                        Guardar y salir
                      </button>
                      <button
                        onClick={onGoHome}
                        className="flex-1 py-1.5 rounded-md bg-secondary text-muted-foreground text-xs font-special uppercase tracking-wider hover:bg-secondary/80 transition-colors"
                      >
                        Salir sin guardar
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-border/30">
                <p className="text-[9px] font-inter text-muted-foreground/40 text-center uppercase tracking-widest">
                  ESC para cerrar
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
