import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Swords, BookOpen, Heart, AlertTriangle } from "lucide-react";

export default function Landing() {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  return (
    <div className="min-h-screen bg-background film-grain relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card/50" />
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-2xl mx-auto space-y-8"
        >
          {/* Iron Cross decorative element */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center"
          >
            <div className="w-16 h-16 border-2 border-primary/40 rounded-full flex items-center justify-center">
              <Swords className="w-7 h-7 text-primary" />
            </div>
          </motion.div>

          <div className="space-y-3">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[10px] font-special uppercase tracking-[0.5em] text-primary"
            >
              Una Aventura Interactiva de Historia
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="font-special text-4xl md:text-6xl text-foreground leading-tight"
            >
              Cenizas<br />
              <span className="text-primary">del Frente</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="font-fell text-base md:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed"
            >
              Berlín, 1939. Eres Karl Müller, un joven carpintero llamado a filas.
              La guerra te espera. Tus decisiones definirán tu destino.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="flex flex-wrap justify-center gap-6 text-xs font-inter text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-primary/70" />
              Historia real
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-accent/70" />
              5 finales posibles
            </span>
            <span className="flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5 text-primary/70" />
              Decisiones morales
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="space-y-3"
          >
            <Link to="/game">
              <Button
                size="lg"
                className="font-special uppercase tracking-[0.2em] text-sm bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-6"
              >
                Comenzar la Aventura
              </Button>
            </Link>
            <button
              onClick={() => setShowDisclaimer(!showDisclaimer)}
              className="block mx-auto text-[10px] font-inter text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
            >
              Nota sobre el contenido
            </button>
          </motion.div>

          <AnimatePresence>
            {showDisclaimer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 max-w-md mx-auto">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <p className="text-xs font-inter text-muted-foreground leading-relaxed text-left">
                      Este juego tiene fines exclusivamente educativos. Presenta la perspectiva de un soldado alemán 
                      para explorar la complejidad moral de la guerra. No glorifica ni justifica el nazismo ni 
                      ninguna forma de violencia. Los hechos históricos se presentan con respeto a todas las víctimas.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bottom decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        />
      </div>
    </div>
  );
}