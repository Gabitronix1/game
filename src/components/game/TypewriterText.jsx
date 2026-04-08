import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

function getCharDelay(char, baseSpeed) {
  if (char === '.' || char === '!' || char === '?') return baseSpeed * 18;
  if (char === ',' || char === ';' || char === ':') return baseSpeed * 8;
  if (char === '—' || char === '…') return baseSpeed * 14;
  if (char === '\n') return baseSpeed * 10;
  return baseSpeed;
}

export default function TypewriterText({ text, baseSpeed = 15, onComplete }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef(null);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
    indexRef.current = 0;

    const typeNext = () => {
      const i = indexRef.current;
      if (i >= text.length) {
        setIsComplete(true);
        onComplete?.();
        return;
      }
      setDisplayedText(text.slice(0, i + 1));
      indexRef.current = i + 1;
      const delay = getCharDelay(text[i], baseSpeed);
      timeoutRef.current = setTimeout(typeNext, delay);
    };

    timeoutRef.current = setTimeout(typeNext, baseSpeed);
    return () => clearTimeout(timeoutRef.current);
  }, [text, baseSpeed]);

  const skipToEnd = () => {
    clearTimeout(timeoutRef.current);
    setDisplayedText(text);
    setIsComplete(true);
    onComplete?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
      onClick={!isComplete ? skipToEnd : undefined}
    >
      <p className="font-fell text-base md:text-lg leading-relaxed whitespace-pre-line text-foreground/90">
        {displayedText}
        {!isComplete && (
          <span className="inline-block w-0.5 h-5 bg-primary ml-0.5 animate-pulse" />
        )}
      </p>
      {!isComplete && (
        <p className="text-xs text-muted-foreground mt-3 italic font-inter">
          Toca para saltar la animación...
        </p>
      )}
    </motion.div>
  );
}
