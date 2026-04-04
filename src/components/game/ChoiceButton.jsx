import { motion } from "framer-motion";

export default function ChoiceButton({ choice, index, onSelect, disabled }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.18, duration: 0.4 }}
      whileHover={{ scale: 1.01, x: 4 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onSelect(choice)}
      disabled={disabled}
      className="w-full text-left group relative overflow-hidden rounded-lg border border-border/60 bg-card/40 hover:bg-card/80 hover:border-primary/40 transition-all duration-300 p-4 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative flex items-start gap-3">
        <span className="flex-shrink-0 w-6 h-6 rounded-full border border-primary/40 flex items-center justify-center text-xs font-special text-primary mt-0.5 group-hover:bg-primary/10 transition-colors">
          {String.fromCharCode(65 + index)}
        </span>
        <div className="flex-1 space-y-1.5">
          <p className="font-fell text-sm md:text-base text-foreground/85 leading-relaxed">
            {choice.text}
          </p>
          {choice.subtext && (
            <p className="text-xs font-inter italic text-muted-foreground/70 leading-relaxed border-l-2 border-primary/20 pl-2">
              {choice.subtext}
            </p>
          )}
        </div>
      </div>
    </motion.button>
  );
}