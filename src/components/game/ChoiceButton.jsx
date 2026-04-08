import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export default function ChoiceButton({ choice, index, onSelect, disabled, locked, lockedMessage }) {
  const isBlocked = locked;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.18, duration: 0.4 }}
    >
      <button
        onClick={() => !isBlocked && onSelect(choice)}
        disabled={disabled || isBlocked}
        className={`w-full text-left group relative overflow-hidden rounded-lg border transition-all duration-300 p-4
          ${isBlocked
            ? "border-border/30 bg-card/20 opacity-60 cursor-not-allowed"
            : "border-border/60 bg-card/40 hover:bg-card/80 hover:border-primary/40 cursor-pointer"
          }
          disabled:cursor-not-allowed`}
      >
        {!isBlocked && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
        <div className="relative flex items-start gap-3">
          <span className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-special mt-0.5 transition-colors
            ${isBlocked
              ? "border-muted-foreground/30 text-muted-foreground/40"
              : "border-primary/40 text-primary group-hover:bg-primary/10"
            }`}
          >
            {isBlocked ? <Lock className="w-3 h-3" /> : String.fromCharCode(65 + index)}
          </span>
          <div className="flex-1 space-y-1.5">
            <p className={`font-fell text-sm md:text-base leading-relaxed
              ${isBlocked ? "text-muted-foreground/50 line-through decoration-muted-foreground/30" : "text-foreground/85"}`}
            >
              {choice.text}
            </p>
            {choice.subtext && !isBlocked && (
              <p className="text-xs font-inter italic text-muted-foreground/70 leading-relaxed border-l-2 border-primary/20 pl-2">
                {choice.subtext}
              </p>
            )}
            {isBlocked && lockedMessage && (
              <p className="text-xs font-inter italic text-muted-foreground/60 leading-relaxed border-l-2 border-muted-foreground/20 pl-2">
                {lockedMessage}
              </p>
            )}
          </div>
        </div>
      </button>
    </motion.div>
  );
}
