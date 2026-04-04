import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function TypewriterText({ text, speed = 15, onComplete }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        onComplete?.();
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  const skipToEnd = () => {
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