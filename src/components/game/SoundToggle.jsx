// SoundToggle.jsx — botón para activar/desactivar sonido ambiental
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SoundToggle({ onEnable, onDisable }) {
  const [enabled, setEnabled]           = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const toggle = () => {
    if (!hasInteracted) setHasInteracted(true);
    if (enabled) {
      onDisable?.();
      setEnabled(false);
    } else {
      onEnable?.();
      setEnabled(true);
    }
  };

  return (
    <button
      onClick={toggle}
      title={enabled ? "Silenciar" : "Activar sonido ambiental"}
      className="relative flex items-center gap-1.5 text-[10px] font-special uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200"
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M2 5H4.5L7.5 2.5V11.5L4.5 9H2V5Z"
            fill="currentColor"
            fillOpacity={enabled ? 0.8 : 0.35}
          />
          {enabled && (
            <>
              <path d="M9 4.5C9.8 5.3 10.3 6.1 10.3 7C10.3 7.9 9.8 8.7 9 9.5"
                stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.7" />
              <path d="M10.5 3C11.8 4.2 12.5 5.5 12.5 7C12.5 8.5 11.8 9.8 10.5 11"
                stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.4" />
            </>
          )}
          {!enabled && (
            <line x1="9" y1="4.5" x2="12" y2="9.5"
              stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.5" />
          )}
        </svg>
        {enabled && (
          <motion.div
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-primary"
          />
        )}
      </div>

      <span className="hidden sm:inline">{enabled ? "Sonido" : "Silencio"}</span>

      <AnimatePresence>
        {!hasInteracted && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 2.5, duration: 0.4 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-card border border-border/60 rounded px-2 py-1 text-[9px] font-inter text-muted-foreground/80 pointer-events-none"
          >
            Activar sonido ambiental
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}