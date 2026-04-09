import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";
import { useState } from "react";

export default function ChoiceButton({ choice, index, onSelect, disabled, locked, lockedMessage }) {
  const [showLockedMsg, setShowLockedMsg] = useState(false);

  const handleClick = () => {
    if (locked) {
      // Mostrar el mensaje de bloqueo brevemente al intentar clickear
      setShowLockedMsg(true);
      setTimeout(() => setShowLockedMsg(false), 2800);
      return;
    }
    if (!disabled) onSelect(choice);
  };

  return (
    <div className="relative">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 + index * 0.18, duration: 0.4 }}
        whileHover={!locked && !disabled ? { scale: 1.01, x: 4 } : {}}
        whileTap={!locked && !disabled ? { scale: 0.99 } : {}}
        onClick={handleClick}
        disabled={disabled && !locked}
        className={`w-full text-left group relative overflow-hidden rounded-lg border transition-all duration-300 p-4
          ${locked
            ? "border-border/30 bg-card/20 cursor-not-allowed opacity-60"
            : "border-border/60 bg-card/40 hover:bg-card/80 hover:border-primary/40 cursor-pointer"
          }
          ${disabled && !locked ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        {/* Hover gradient — solo si no está bloqueado */}
        {!locked && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        )}

        <div className="relative flex items-start gap-3">
          {/* Letra o candado */}
          <span className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-special mt-0.5 transition-colors
            ${locked
              ? "border-border/30 text-muted-foreground/40"
              : "border-primary/40 text-primary group-hover:bg-primary/10"
            }`}
          >
            {locked
              ? <Lock className="w-3 h-3" />
              : String.fromCharCode(65 + index)
            }
          </span>

          <div className="flex-1 space-y-1.5">
            <p className={`font-fell text-sm md:text-base leading-relaxed
              ${locked ? "text-foreground/40" : "text-foreground/85"}
            `}>
              {choice.text}
            </p>
            {choice.subtext && !locked && (
              <p className="text-xs font-inter italic text-muted-foreground/70 leading-relaxed border-l-2 border-primary/20 pl-2">
                {choice.subtext}
              </p>
            )}
          </div>
        </div>
      </motion.button>

      {/* Mensaje de bloqueo — aparece debajo al intentar clickear */}
      <AnimatePresence>
        {showLockedMsg && lockedMessage && (
          <motion.div
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-1 mx-1 px-3 py-2 rounded-md bg-card/60 border border-border/40">
              <p className="text-xs font-fell italic text-muted-foreground/70 leading-relaxed">
                {lockedMessage}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
