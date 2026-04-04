import { motion } from "framer-motion";
import { MapPin, Calendar, BookOpen } from "lucide-react";

export default function SceneHeader({ scene }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="border-b border-border/40 pb-5 mb-6"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-special uppercase tracking-[0.3em] text-primary">
          {scene.chapter}
        </span>
        <span className="w-8 h-px bg-primary/40" />
      </div>
      <h1 className="font-special text-2xl md:text-3xl text-foreground mb-3 tracking-wide">
        {scene.title}
      </h1>
      <div className="flex flex-wrap items-center gap-4 text-xs font-inter text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3 h-3" />
          {scene.year}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3 h-3" />
          {scene.location}
        </span>
        {scene.historicalNote && (
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3 h-3" />
            Dato histórico disponible
          </span>
        )}
      </div>
    </motion.div>
  );
}