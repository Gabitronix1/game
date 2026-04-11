// useAmbientSound.js
// Melodías ambientales procedurales — escalas menores, arpegios, piano/cuerda sintéticos
// Cada atmósfera tiene su propia escala, tempo y carácter melódico

import { useRef, useEffect, useCallback } from "react";

const FADE_IN  = 2.8;
const FADE_OUT = 2.0;

// ── Escalas musicales (frecuencias en Hz, nota base = La2 = 110Hz) ──────────

const SCALES = {
  // Menor natural — melancólica, la más usada
  minor:        [110, 123.47, 130.81, 146.83, 164.81, 174.61, 195.99, 220],
  // Menor armónica — tensión, drama
  harmonicMinor:[110, 123.47, 130.81, 146.83, 164.81, 174.61, 207.65, 220],
  // Menor frigia — oscura, opresiva (modo III)
  phrygian:     [110, 116.54, 130.81, 146.83, 164.81, 174.61, 195.99, 220],
  // Pentatónica menor — desnuda, sola
  pentatonicMin:[110, 130.81, 146.83, 164.81, 195.99, 220, 261.63, 293.66],
  // Dórica — guerra, resignación con algo de esperanza
  dorian:       [110, 123.47, 130.81, 146.83, 164.81, 185.00, 195.99, 220],
  // Cromática — horror, disonancia
  chromatic:    [110, 116.54, 123.47, 130.81, 138.59, 146.83, 155.56, 164.81],
};

// Octavas disponibles para variar la melodía
const OCT = [0.5, 1, 2]; // subir/bajar octavas multiplicando/dividiendo

// ── Síntesis de instrumento ──────────────────────────────

// Piano sintético — ataque rápido, decay largo
function synthNote(ctx, dest, freq, vol, duration, type = "piano") {
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  osc1.type  = "sine";
  osc2.type  = "triangle";
  osc1.frequency.value = freq;
  osc2.frequency.value = freq * 2.001; // segundo armónico ligeramente desafinado

  const gain = ctx.createGain();
  const now  = ctx.currentTime;

  if (type === "piano") {
    // Ataque muy rápido, decay exponencial largo → piano
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(vol * 0.4, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  } else if (type === "strings") {
    // Ataque lento, sostenido → cuerda
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.4);
    gain.gain.setValueAtTime(vol, now + duration - 0.5);
    gain.gain.linearRampToValueAtTime(0.0001, now + duration);
  } else if (type === "pad") {
    // Pad atmosférico — ataque y release suaves
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(vol * 0.7, now + 1.0);
    gain.gain.setValueAtTime(vol * 0.7, now + duration - 1.2);
    gain.gain.linearRampToValueAtTime(0.0001, now + duration);
  }

  // Reverb sintético — delay + feedback muy corto
  const convGain = ctx.createGain();
  convGain.gain.value = 0.22;
  const delay = ctx.createDelay(0.8);
  delay.delayTime.value = 0.28;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.25;
  delay.connect(feedback);
  feedback.connect(delay);
  gain.connect(delay);
  delay.connect(convGain);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(dest);
  convGain.connect(dest);

  osc1.start(now); osc2.start(now);
  osc1.stop(now + duration + 0.1);
  osc2.stop(now + duration + 0.1);

  return { osc1, osc2, gain, delay, feedback, convGain };
}

// Nota de bajo — fundamental que sostiene la armonía
function bassNote(ctx, dest, freq, vol, duration) {
  const osc  = ctx.createOscillator();
  osc.type   = "sine";
  osc.frequency.value = freq * 0.5; // octava baja

  const filter = ctx.createBiquadFilter();
  filter.type            = "lowpass";
  filter.frequency.value = 200;

  const gain = ctx.createGain();
  const now  = ctx.currentTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(vol, now + 0.05);
  gain.gain.setValueAtTime(vol, now + duration - 0.3);
  gain.gain.linearRampToValueAtTime(0.0001, now + duration);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(dest);
  osc.start(now);
  osc.stop(now + duration + 0.1);
  return { osc, gain };
}

// ── Generadores de melodías por atmósfera ──────────────────

// Retorna un objeto con { stop, nodes[] }
// La melodía se autogenera en bucle usando setTimeout

function createMelodyLoop(ctx, dest, config) {
  const {
    scale,       // array de frecuencias
    tempo,       // ms entre notas
    instrument,  // "piano" | "strings" | "pad"
    volMelody,   // volumen de la melodía
    volBass,     // volumen del bajo
    pattern,     // array de índices en la escala (null = silencio)
    bassPattern, // array de índices para el bajo (null = silencio)
    octave,      // multiplicador de octava base
  } = config;

  let stopped    = false;
  let stepIndex  = 0;
  const allNodes = [];
  let timeoutId  = null;

  // Ganancia maestra de esta capa — para fade in/out
  const layerGain = ctx.createGain();
  layerGain.gain.setValueAtTime(0, ctx.currentTime);
  layerGain.gain.linearRampToValueAtTime(1, ctx.currentTime + FADE_IN);
  layerGain.connect(dest);

  const step = () => {
    if (stopped) return;

    const melIdx  = pattern[stepIndex % pattern.length];
    const bassIdx = bassPattern ? bassPattern[stepIndex % bassPattern.length] : null;
    const noteDur = (tempo * 2) / 1000; // duración de la nota en segundos

    if (melIdx !== null && melIdx !== undefined) {
      const freq = scale[melIdx % scale.length] * (octave || 1);
      const n    = synthNote(ctx, layerGain, freq, volMelody, noteDur, instrument);
      allNodes.push(n);
    }

    if (bassIdx !== null && bassIdx !== undefined) {
      const freq = scale[bassIdx % scale.length] * (octave || 1);
      const b    = bassNote(ctx, layerGain, freq, volBass, noteDur * 1.5);
      allNodes.push(b);
    }

    stepIndex++;
    timeoutId = setTimeout(step, tempo);
  };

  // Pequeño delay inicial para que el fade in empiece primero
  timeoutId = setTimeout(step, 400);

  return {
    layerGain,
    stop: () => {
      stopped = true;
      if (timeoutId) clearTimeout(timeoutId);
      // Fade out del layer
      try {
        layerGain.gain.cancelScheduledValues(ctx.currentTime);
        layerGain.gain.setValueAtTime(layerGain.gain.value, ctx.currentTime);
        layerGain.gain.linearRampToValueAtTime(0, ctx.currentTime + FADE_OUT);
      } catch (_) {}
      // Parar osciladores tras el fade
      setTimeout(() => {
        allNodes.forEach(n => {
          try { n.osc1?.stop();  } catch (_) {}
          try { n.osc2?.stop();  } catch (_) {}
          try { n.osc?.stop();   } catch (_) {}
        });
      }, (FADE_OUT + 0.2) * 1000);
    },
  };
}

// Ruido de fondo muy suave — da textura sin dominar la melodía
function createAmbienceLayer(ctx, dest, filterFreq, vol) {
  const src    = ctx.createBufferSource();
  const len    = ctx.sampleRate * 5;
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
  const data   = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  src.buffer = buffer;
  src.loop   = true;

  const filter = ctx.createBiquadFilter();
  filter.type            = "lowpass";
  filter.frequency.value = filterFreq;
  filter.Q.value         = 0.3;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + FADE_IN);

  src.connect(filter);
  filter.connect(gain);
  gain.connect(dest);
  src.start();

  return {
    stop: () => {
      try {
        gain.gain.cancelScheduledValues(ctx.currentTime);
        gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + FADE_OUT);
        setTimeout(() => { try { src.stop(); } catch (_) {} }, (FADE_OUT + 0.1) * 1000);
      } catch (_) {}
    },
  };
}

// ── Configuraciones por atmósfera ─────────────────────────

const ATMOSPHERE_MUSIC = {

  // Berlín — hogar, intimidad. Piano lento, mayor relativo, nostálgico
  intimate: {
    scale:       SCALES.dorian,
    tempo:       1800,
    instrument:  "piano",
    volMelody:   0.12,
    volBass:     0.07,
    octave:      2,
    pattern:     [4, null, 2, null, 0, null, 3, null, 5, null, 4, null, 2, null, null, null],
    bassPattern: [0, null, null, null, 4, null, null, null, 0, null, null, null, 5, null, null, null],
    ambience:    { filterFreq: 80, vol: 0.025 },
  },

  // Cuarteles — tensión contenida. Notas espaciadas, armónica menor
  tension: {
    scale:       SCALES.harmonicMinor,
    tempo:       2200,
    instrument:  "piano",
    volMelody:   0.10,
    volBass:     0.08,
    octave:      1,
    pattern:     [0, null, null, 3, null, 2, null, null, 4, null, null, 7, null, null, null, null],
    bassPattern: [0, null, null, null, null, null, null, null, 4, null, null, null, null, null, null, null],
    ambience:    { filterFreq: 120, vol: 0.035 },
  },

  // Dilema moral — arpegio lento, pentatónica, inquietante
  moral_dilemma: {
    scale:       SCALES.pentatonicMin,
    tempo:       2600,
    instrument:  "strings",
    volMelody:   0.09,
    volBass:     0.06,
    octave:      1,
    pattern:     [0, 2, 4, 6, 4, 2, 0, null, 1, 3, 5, 3, 1, null, null, null],
    bassPattern: [0, null, null, null, null, null, 4, null, null, null, null, null, null, null, null, null],
    ambience:    { filterFreq: 100, vol: 0.030 },
  },

  // Intensa — cuarteles, adiestramiento. Ritmo más marcado, dórica
  intense: {
    scale:       SCALES.dorian,
    tempo:       1400,
    instrument:  "piano",
    volMelody:   0.11,
    volBass:     0.09,
    octave:      1,
    pattern:     [0, null, 2, null, 3, null, 5, null, 7, null, 5, null, 3, null, 2, null],
    bassPattern: [0, null, null, null, 0, null, null, null, 4, null, null, null, 4, null, null, null],
    ambience:    { filterFreq: 150, vol: 0.040 },
  },

  // Francia / caos — acordes disonantes rápidos, frígia
  chaos: {
    scale:       SCALES.phrygian,
    tempo:       900,
    instrument:  "strings",
    volMelody:   0.10,
    volBass:     0.10,
    octave:      1,
    pattern:     [0, 1, 3, null, 5, 3, 1, 0, 2, null, 4, 2, 0, null, null, null],
    bassPattern: [0, null, null, null, 3, null, null, null, 5, null, null, null, 0, null, null, null],
    ambience:    { filterFreq: 200, vol: 0.055 },
  },

  // Violencia / combate urbano — disonante, cromático, opresivo
  violence: {
    scale:       SCALES.chromatic,
    tempo:       1100,
    instrument:  "strings",
    volMelody:   0.09,
    volBass:     0.11,
    octave:      1,
    pattern:     [0, null, 2, null, 1, null, 3, null, 0, null, 4, null, 2, null, null, null],
    bassPattern: [0, null, null, null, null, null, 3, null, null, null, null, null, 0, null, null, null],
    ambience:    { filterFreq: 180, vol: 0.060 },
  },

  // Marcha / bittersweet — melodía casi esperanzadora pero en menor
  bittersweet: {
    scale:       SCALES.dorian,
    tempo:       1600,
    instrument:  "piano",
    volMelody:   0.11,
    volBass:     0.07,
    octave:      2,
    pattern:     [0, 2, 4, 5, 4, 2, 0, null, 3, 5, 7, 5, 3, null, null, null],
    bassPattern: [0, null, null, null, 4, null, null, null, 3, null, null, null, 0, null, null, null],
    ambience:    { filterFreq: 100, vol: 0.025 },
  },

  // Furtivo — notas muy separadas, piano suave, pentatónica
  stealth: {
    scale:       SCALES.pentatonicMin,
    tempo:       2400,
    instrument:  "piano",
    volMelody:   0.08,
    volBass:     0.05,
    octave:      1,
    pattern:     [0, null, null, 4, null, null, 2, null, null, 6, null, null, 4, null, null, null],
    bassPattern: [0, null, null, null, null, null, null, null, 4, null, null, null, null, null, null, null],
    ambience:    { filterFreq: 90, vol: 0.020 },
  },

  // Desesperación / frente ruso — pad lento, armónica menor, muy bajo
  despair: {
    scale:       SCALES.harmonicMinor,
    tempo:       3000,
    instrument:  "pad",
    volMelody:   0.10,
    volBass:     0.08,
    octave:      0.5,
    pattern:     [0, null, null, null, 2, null, null, null, 3, null, null, null, 0, null, null, null],
    bassPattern: [0, null, null, null, null, null, null, null, 3, null, null, null, null, null, null, null],
    ambience:    { filterFreq: 80, vol: 0.045 },
  },

  // Horror / Stalingrado — disonancia cromática, pad muy oscuro
  horror: {
    scale:       SCALES.chromatic,
    tempo:       3400,
    instrument:  "pad",
    volMelody:   0.08,
    volBass:     0.12,
    octave:      0.5,
    pattern:     [0, null, null, null, null, 1, null, null, null, null, 3, null, null, null, null, null],
    bassPattern: [0, null, null, null, null, null, null, null, null, null, 2, null, null, null, null, null],
    ambience:    { filterFreq: 100, vol: 0.065 },
  },

  // Sombrío / Stalingrado ciudad — menor armónica lenta
  somber: {
    scale:       SCALES.harmonicMinor,
    tempo:       2800,
    instrument:  "strings",
    volMelody:   0.09,
    volBass:     0.08,
    octave:      0.5,
    pattern:     [0, null, null, 2, null, null, 0, null, null, null, 3, null, null, 2, null, null],
    bassPattern: [0, null, null, null, null, null, null, null, 3, null, null, null, null, null, null, null],
    ambience:    { filterFreq: 110, vol: 0.050 },
  },

  // Melancolía / epílogo — la más desnuda. Pentatónica, piano solo
  melancholy: {
    scale:       SCALES.pentatonicMin,
    tempo:       2500,
    instrument:  "piano",
    volMelody:   0.10,
    volBass:     0.05,
    octave:      2,
    pattern:     [0, null, null, null, 2, null, null, null, 1, null, null, null, 0, null, null, null],
    bassPattern: [0, null, null, null, null, null, null, null, null, null, null, null, 0, null, null, null],
    ambience:    { filterFreq: 70, vol: 0.020 },
  },
};

// Fallback
ATMOSPHERE_MUSIC._default = ATMOSPHERE_MUSIC.tension;

// ── Hook principal ────────────────────────────────────────

export function useAmbientSound() {
  const ctxRef     = useRef(null);
  const masterRef  = useRef(null);
  const layersRef  = useRef([]); // array de { stop } de la sesión actual
  const enabledRef = useRef(false);
  const pendingAtm = useRef("tension");
  const currentAtm = useRef(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current   = new (window.AudioContext || window.webkitAudioContext)();
      masterRef.current = ctxRef.current.createGain();
      masterRef.current.gain.value = 0;
      masterRef.current.connect(ctxRef.current.destination);
    }
    return ctxRef.current;
  }, []);

  const stopAllLayers = useCallback(() => {
    layersRef.current.forEach(layer => {
      try { layer.stop(); } catch (_) {}
    });
    layersRef.current = [];
  }, []);

  const spawnAtmosphere = useCallback((atmosphere, ctx, dest) => {
    const cfg = ATMOSPHERE_MUSIC[atmosphere] || ATMOSPHERE_MUSIC._default;
    const layers = [];

    // Capa melódica principal
    const melody = createMelodyLoop(ctx, dest, cfg);
    layers.push(melody);

    // Capa de ambiente de fondo (textura muy sutil)
    if (cfg.ambience) {
      const amb = createAmbienceLayer(ctx, dest, cfg.ambience.filterFreq, cfg.ambience.vol);
      layers.push(amb);
    }

    currentAtm.current  = atmosphere;
    layersRef.current   = layers;
  }, []);

  const enable = useCallback(() => {
    const ctx = getCtx();
    if (ctx.state === "suspended") ctx.resume();
    enabledRef.current = true;

    masterRef.current.gain.cancelScheduledValues(ctx.currentTime);
    masterRef.current.gain.setValueAtTime(masterRef.current.gain.value, ctx.currentTime);
    masterRef.current.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.8);

    stopAllLayers();
    setTimeout(() => {
      if (!enabledRef.current) return;
      spawnAtmosphere(pendingAtm.current, ctx, masterRef.current);
    }, 400);
  }, [getCtx, stopAllLayers, spawnAtmosphere]);

  const disable = useCallback(() => {
    if (!ctxRef.current) return;
    const ctx = ctxRef.current;
    enabledRef.current  = false;
    currentAtm.current  = null;

    masterRef.current.gain.cancelScheduledValues(ctx.currentTime);
    masterRef.current.gain.setValueAtTime(masterRef.current.gain.value, ctx.currentTime);
    masterRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.8);

    setTimeout(() => stopAllLayers(), 2000);
  }, [stopAllLayers]);

  const setAtmosphere = useCallback((atmosphere) => {
    pendingAtm.current = atmosphere;
    if (!enabledRef.current || !ctxRef.current) return;
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") return;
    if (currentAtm.current === atmosphere) return;

    stopAllLayers();
    setTimeout(() => {
      if (!enabledRef.current) return;
      spawnAtmosphere(atmosphere, ctx, masterRef.current);
    }, FADE_OUT * 1000);
  }, [stopAllLayers, spawnAtmosphere]);

  useEffect(() => {
    return () => {
      enabledRef.current = false;
      stopAllLayers();
      try { ctxRef.current?.close(); } catch (_) {}
    };
  }, [stopAllLayers]);

  return { enable, disable, setAtmosphere };
}