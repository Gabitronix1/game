import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export default function HistoricalNote({ note }) {
  if (!note) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-4"
    >
      <div className="flex items-start gap-3">
        <BookOpen className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-[10px] font-special uppercase tracking-widest text-primary mb-1">
            Contexto Histórico
          </h4>
          <p className="text-xs font-inter text-muted-foreground leading-relaxed">
            {note}
          </p>
        </div>
      </div>
    </motion.div>
  );
}