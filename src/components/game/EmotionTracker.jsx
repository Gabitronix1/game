import { motion } from "framer-motion";
import { EMOTIONS } from "../../lib/storyData";

export default function EmotionTracker({ emotions }) {
  const sortedEmotions = Object.entries(emotions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const dominant = sortedEmotions[0];

  return (
    <div className="bg-card/50 border border-border/50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-special uppercase tracking-widest text-muted-foreground">
          Estado Emocional
        </h3>
        {dominant && (
          <span className="text-xs font-inter text-primary">
            {EMOTIONS[dominant[0]]?.icon} {EMOTIONS[dominant[0]]?.label}
          </span>
        )}
      </div>
      <div className="space-y-2">
        {sortedEmotions.map(([key, value], i) => {
          const emotion = EMOTIONS[key];
          if (!emotion) return null;
          const clamped = Math.min(100, Math.max(0, value));
          return (
            <div key={key} className="flex items-center gap-2">
              <span className="text-[10px] font-inter w-20 text-muted-foreground truncate">
                {emotion.label}
              </span>
              <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${clamped}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: emotion.color }}
                />
              </div>
              <span className="text-[10px] font-inter text-muted-foreground w-6 text-right">
                {clamped}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}