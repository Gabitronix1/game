// useAmbientSound.js — Cenizas del Frente
// Sistema de audio ambiental cinematográfico
// Arquitectura: capas independientes (drones, pulsos, texturas, viento) mezcladas por atmósfera
// Cada atmósfera tiene su propio carácter tímbrico, no solo melódico

import { useRef, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// CONSTANTES GLOBALES
// ─────────────────────────────────────────────────────────────
const FADE_IN  = 3.5;
const FADE_OUT = 2.8;
const MASTER_VOLUME = 0.72;

// ─────────────────────────────────────────────────────────────
// UTILIDADES DE SÍNTESIS BÁSICAS
// ─────────────────────────────────────────────────────────────

/** Crea un nodo GainNode con valor inicial */
function makeGain(ctx, value = 1) {
  const g = ctx.createGain();
  g.gain.value = value;
  return g;
}

/** Crossfade lineal de un gain a lo largo del tiempo */
function fadeTo(gainNode, targetValue, duration, ctx) {
  const now = ctx.currentTime;
  gainNode.gain.cancelScheduledValues(now);
  gainNode.gain.setValueAtTime(gainNode.gain.value, now);
  gainNode.gain.linearRampToValueAtTime(targetValue, now + duration);
}

/** Genera un buffer de ruido blanco de N segundos */
function makeNoiseBuffer(ctx, durationSec) {
  const len    = Math.ceil(ctx.sampleRate * durationSec);
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
  const data   = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

/** Fuente de ruido en bucle con filtro configurable */
function makeFilteredNoise(ctx, dest, filterType, freq, Q, vol, durationSec = 8) {
  const src    = ctx.createBufferSource();
  src.buffer   = makeNoiseBuffer(ctx, durationSec);
  src.loop     = true;

  const filter = ctx.createBiquadFilter();
  filter.type            = filterType;
  filter.frequency.value = freq;
  filter.Q.value         = Q;

  const gain = makeGain(ctx, 0);

  src.connect(filter);
  filter.connect(gain);
  gain.connect(dest);
  src.start();

  fadeTo(gain, vol, FADE_IN, ctx);

  return {
    src, filter, gain,
    stop: (delay = 0) => {
      fadeTo(gain, 0, FADE_OUT, ctx);
      setTimeout(() => { try { src.stop(); } catch (_) {} }, (FADE_OUT + delay + 0.2) * 1000);
    },
  };
}

/** Oscilador de baja frecuencia (LFO) para modular parámetros */
function makeLFO(ctx, dest, rate, depth, offset) {
  const lfo    = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.type           = "sine";
  lfo.frequency.value = rate;
  lfoGain.gain.value  = depth;
  lfo.connect(lfoGain);
  lfoGain.connect(dest);
  lfo.start();
  return { lfo, lfoGain, stop: () => { try { lfo.stop(); } catch (_) {} } };
}

/** Drone de tono complejo: fundamental + armónicos detuneados */
function makeDrone(ctx, dest, freq, vol, detune = 8, numOscillators = 4) {
  const gain = makeGain(ctx, 0);
  gain.connect(dest);

  const oscillators = [];
  for (let i = 0; i < numOscillators; i++) {
    const osc    = ctx.createOscillator();
    const oscGain = ctx.createGain();
    const detuneAmt = (i - (numOscillators - 1) / 2) * detune;

    osc.type           = i === 0 ? "sine" : (i % 2 === 0 ? "triangle" : "sine");
    osc.frequency.value = freq * (i === 0 ? 1 : (i === 1 ? 2 : (i === 2 ? 3 : 0.5)));
    osc.detune.value    = detuneAmt;
    oscGain.gain.value  = i === 0 ? 0.5 : (i === 1 ? 0.2 : (i === 2 ? 0.12 : 0.3));

    // LFO de amplitud suave para el efecto "respiración"
    const tremoloLFO  = ctx.createOscillator();
    const tremoloGain = ctx.createGain();
    tremoloLFO.frequency.value = 0.07 + i * 0.03;
    tremoloGain.gain.value     = 0.08;
    tremoloLFO.connect(tremoloGain);
    tremoloGain.connect(oscGain.gain);
    tremoloLFO.start();

    osc.connect(oscGain);
    oscGain.connect(gain);
    osc.start();
    oscillators.push({ osc, oscGain, tremoloLFO });
  }

  fadeTo(gain, vol, FADE_IN, ctx);

  return {
    gain,
    stop: (delay = 0) => {
      fadeTo(gain, 0, FADE_OUT, ctx);
      setTimeout(() => {
        oscillators.forEach(({ osc, tremoloLFO }) => {
          try { osc.stop(); } catch (_) {}
          try { tremoloLFO.stop(); } catch (_) {}
        });
      }, (FADE_OUT + delay + 0.2) * 1000);
    },
  };
}

/** Reverb convolución sintético (impulso exponencial) */
function makeReverb(ctx, decaySec = 3.5, preDelaySec = 0.02) {
  const convolver = ctx.createConvolver();
  const sampleRate = ctx.sampleRate;
  const length     = Math.ceil(sampleRate * decaySec);
  const impulse    = ctx.createBuffer(2, length, sampleRate);

  for (let c = 0; c < 2; c++) {
    const data = impulse.getChannelData(c);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
    }
  }
  convolver.buffer = impulse;

  const wet  = makeGain(ctx, 0.38);
  const dry  = makeGain(ctx, 1);
  const out  = makeGain(ctx, 1);

  // Pre-delay
  const delay = ctx.createDelay(0.5);
  delay.delayTime.value = preDelaySec;

  // Conexiones: input → dry + (input → delay → convolver → wet) → out
  const input = ctx.createGain();
  input.connect(dry);
  dry.connect(out);
  input.connect(delay);
  delay.connect(convolver);
  convolver.connect(wet);
  wet.connect(out);

  return { input, output: out, wet, dry };
}

// ─────────────────────────────────────────────────────────────
// GENERADORES DE CAPAS ESPECÍFICAS POR ATMÓSFERA
// ─────────────────────────────────────────────────────────────

/**
 * Latidos de corazón lentos y profundos — para horror/moral_dilemma
 */
function makeHeartbeat(ctx, dest, bpm, vol) {
  const interval = (60 / bpm) * 1000;
  let stopped    = false;
  const gain     = makeGain(ctx, 0);
  gain.connect(dest);

  fadeTo(gain, vol, FADE_IN, ctx);

  const beat = () => {
    if (stopped) return;
    const now = ctx.currentTime;

    // Dos golpes: lub-dub
    [0, 0.18].forEach((offset) => {
      const osc  = ctx.createOscillator();
      const envG = ctx.createGain();
      osc.type           = "sine";
      osc.frequency.value = 55 + Math.random() * 4;
      envG.gain.setValueAtTime(0, now + offset);
      envG.gain.linearRampToValueAtTime(0.9, now + offset + 0.035);
      envG.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.22);
      osc.connect(envG);
      envG.connect(gain);
      osc.start(now + offset);
      osc.stop(now + offset + 0.25);
    });

    setTimeout(beat, interval);
  };

  // Pequeño delay inicial
  const initTimeout = setTimeout(beat, 800);

  return {
    gain,
    stop: () => {
      stopped = true;
      clearTimeout(initTimeout);
      fadeTo(gain, 0, FADE_OUT, ctx);
    },
  };
}

/**
 * Pasos y crujidos de nieve — para despair/somber (frente oriental)
 */
function makeSnowFootsteps(ctx, dest, vol) {
  let stopped = false;
  const gain  = makeGain(ctx, 0);
  gain.connect(dest);
  fadeTo(gain, vol, FADE_IN, ctx);

  const step = () => {
    if (stopped) return;
    const now = ctx.currentTime;
    const len = Math.ceil(ctx.sampleRate * 0.18);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const dat = buf.getChannelData(0);

    // Crujido: ruido en ráfaga corta con filtro
    for (let i = 0; i < len; i++) {
      const t   = i / len;
      const env = t < 0.05 ? t / 0.05 : Math.pow(1 - (t - 0.05) / 0.95, 2.2);
      dat[i]    = (Math.random() * 2 - 1) * env;
    }

    const src  = ctx.createBufferSource();
    src.buffer = buf;

    const filt = ctx.createBiquadFilter();
    filt.type            = "bandpass";
    filt.frequency.value = 1200 + Math.random() * 600;
    filt.Q.value         = 0.5;

    src.connect(filt);
    filt.connect(gain);
    src.start(now);
    src.stop(now + 0.2);

    const nextDelay = 1800 + Math.random() * 2400;
    setTimeout(step, nextDelay);
  };

  const initTimeout = setTimeout(step, 2000 + Math.random() * 2000);

  return {
    gain,
    stop: () => {
      stopped = true;
      clearTimeout(initTimeout);
      fadeTo(gain, 0, FADE_OUT, ctx);
    },
  };
}

/**
 * Viento procedural — varía suavemente en intensidad y timbre
 */
function makeWind(ctx, dest, intensity, vol) {
  // intensity: 0=suave (íntimo), 1=huracanado (caos/horror)
  const gain = makeGain(ctx, 0);
  gain.connect(dest);

  const baseFreq  = 180 + (1 - intensity) * 120;
  const noiseHi   = makeFilteredNoise(ctx, gain, "bandpass", baseFreq, 0.4, 0.9);
  const noiseLo   = makeFilteredNoise(ctx, gain, "lowpass", 80, 1.2, 0.6);

  // LFO de frecuencia de filtro → efecto de ráfagas
  const lfoRate = 0.08 + intensity * 0.15;
  const lfoDepth = 60 + intensity * 100;

  const lfoWind  = ctx.createOscillator();
  const lfoGainW = ctx.createGain();
  lfoWind.frequency.value = lfoRate;
  lfoGainW.gain.value     = lfoDepth;
  lfoWind.connect(lfoGainW);
  lfoGainW.connect(noiseHi.filter.frequency);
  lfoWind.start();

  fadeTo(gain, vol, FADE_IN, ctx);

  return {
    gain,
    stop: (delay = 0) => {
      fadeTo(gain, 0, FADE_OUT, ctx);
      noiseHi.stop(delay);
      noiseLo.stop(delay);
      setTimeout(() => { try { lfoWind.stop(); } catch (_) {} }, (FADE_OUT + delay + 0.5) * 1000);
    },
  };
}

/**
 * Campanas/resonancias de iglesia dañada — para violence/chaos
 */
function makeDistantBells(ctx, dest, vol) {
  let stopped = false;
  const gain  = makeGain(ctx, 0);
  gain.connect(dest);
  fadeTo(gain, vol, FADE_IN, ctx);

  const BELL_FREQS = [220, 293.66, 349.23, 440, 523.25, 659.25];

  const ring = () => {
    if (stopped) return;
    const now  = ctx.currentTime;
    const freq = BELL_FREQS[Math.floor(Math.random() * BELL_FREQS.length)];
    const dur  = 3.5 + Math.random() * 2.5;

    // Campana: dos parciales en relación inarmónica
    [1, 2.756].forEach((ratio) => {
      const osc  = ctx.createOscillator();
      const envG = ctx.createGain();
      osc.type           = "sine";
      osc.frequency.value = freq * ratio;
      envG.gain.setValueAtTime(0, now);
      envG.gain.linearRampToValueAtTime(ratio === 1 ? 0.15 : 0.06, now + 0.01);
      envG.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      osc.connect(envG);
      envG.connect(gain);
      osc.start(now);
      osc.stop(now + dur + 0.1);
    });

    const nextDelay = 6000 + Math.random() * 12000;
    setTimeout(ring, nextDelay);
  };

  const initTimeout = setTimeout(ring, 1500 + Math.random() * 4000);

  return {
    gain,
    stop: () => {
      stopped = true;
      clearTimeout(initTimeout);
      fadeTo(gain, 0, FADE_OUT, ctx);
    },
  };
}

/**
 * Estática de radio militar — para tension/intense
 */
function makeRadioStatic(ctx, dest, vol) {
  let stopped = false;
  const gain  = makeGain(ctx, 0);
  gain.connect(dest);
  fadeTo(gain, vol, FADE_IN, ctx);

  // Base: ruido de banda muy estrecha que suena a radio
  const noiseLayer = makeFilteredNoise(ctx, gain, "bandpass", 1400, 8, 0.3);

  // Portadora de radio: tono muy suave modulado
  const carrier     = ctx.createOscillator();
  const carrierGain = makeGain(ctx, 0.04);
  carrier.frequency.value = 450;
  carrier.type            = "sine";
  carrier.connect(carrierGain);
  carrierGain.connect(gain);
  carrier.start();

  // Interrupciones esporádicas de estática
  const staticBurst = () => {
    if (stopped) return;
    const now    = ctx.currentTime;
    const burstG = ctx.createGain();
    const noise  = ctx.createBufferSource();
    noise.buffer = makeNoiseBuffer(ctx, 0.4);
    const filt   = ctx.createBiquadFilter();
    filt.type            = "bandpass";
    filt.frequency.value = 2200 + Math.random() * 1800;
    filt.Q.value         = 3;

    const dur = 0.05 + Math.random() * 0.25;
    burstG.gain.setValueAtTime(0, now);
    burstG.gain.linearRampToValueAtTime(0.12, now + 0.01);
    burstG.gain.linearRampToValueAtTime(0, now + dur);

    noise.connect(filt);
    filt.connect(burstG);
    burstG.connect(gain);
    noise.start(now);
    noise.stop(now + dur + 0.05);

    setTimeout(staticBurst, 4000 + Math.random() * 9000);
  };

  const initTimeout = setTimeout(staticBurst, 2000);

  return {
    gain,
    stop: () => {
      stopped = true;
      clearTimeout(initTimeout);
      noiseLayer.stop();
      fadeTo(gain, 0, FADE_OUT, ctx);
      setTimeout(() => { try { carrier.stop(); } catch (_) {} }, (FADE_OUT + 0.5) * 1000);
    },
  };
}

/**
 * Notas de piano espaciadas — íntimas, expresivas
 * Más orgánico que el sistema anterior: usa muestras sintéticas con resonancia real
 */
function makePianoNotes(ctx, dest, scale, intervalMs, vol, reverb) {
  let stopped = false;
  let stepIdx = 0;
  const gain  = makeGain(ctx, 0);

  // Conectar a través del reverb
  if (reverb) {
    gain.connect(reverb.input);
    reverb.output.connect(dest);
  } else {
    gain.connect(dest);
  }

  fadeTo(gain, vol, FADE_IN, ctx);

  const playNote = () => {
    if (stopped) return;
    const now  = ctx.currentTime;
    const freq = scale[stepIdx % scale.length];
    stepIdx++;

    // Piano sintético mejorado: 3 osciladores + ruido de ataque
    const noteGain = makeGain(ctx, 0);
    noteGain.connect(gain);

    // Oscilador principal — fundamental
    const osc1  = ctx.createOscillator();
    osc1.type   = "sine";
    osc1.frequency.value = freq;

    // Segundo armónico
    const osc2  = ctx.createOscillator();
    osc2.type   = "triangle";
    osc2.frequency.value = freq * 2;
    osc2.detune.value    = 3;

    const osc2g = makeGain(ctx, 0.22);

    // Tercer armónico (octava)
    const osc3  = ctx.createOscillator();
    osc3.type   = "sine";
    osc3.frequency.value = freq * 4;
    const osc3g = makeGain(ctx, 0.06);

    // Ruido de ataque (el martillo sobre la cuerda)
    const atkNoise = ctx.createBufferSource();
    atkNoise.buffer = makeNoiseBuffer(ctx, 0.06);
    const atkFilt   = ctx.createBiquadFilter();
    atkFilt.type            = "bandpass";
    atkFilt.frequency.value = freq * 3;
    atkFilt.Q.value         = 4;
    const atkGain = makeGain(ctx, 0);

    atkGain.gain.setValueAtTime(0, now);
    atkGain.gain.linearRampToValueAtTime(0.18, now + 0.004);
    atkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    atkNoise.connect(atkFilt);
    atkFilt.connect(atkGain);
    atkGain.connect(noteGain);

    // Envolvente de la nota: ataque instantáneo, decay, sustain largo, release
    const dur = 3.2 + Math.random() * 1.8;
    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(1, now + 0.006);
    noteGain.gain.exponentialRampToValueAtTime(0.35, now + 0.18);
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    osc1.connect(noteGain);
    osc2.connect(osc2g); osc2g.connect(noteGain);
    osc3.connect(osc3g); osc3g.connect(noteGain);

    [osc1, osc2, osc3].forEach((o) => { o.start(now); o.stop(now + dur + 0.1); });
    atkNoise.start(now); atkNoise.stop(now + 0.07);

    const nextInterval = intervalMs + (Math.random() - 0.5) * intervalMs * 0.35;
    setTimeout(playNote, nextInterval);
  };

  const initTimeout = setTimeout(playNote, 600 + Math.random() * 1200);

  return {
    gain,
    stop: () => {
      stopped = true;
      clearTimeout(initTimeout);
      fadeTo(gain, 0, FADE_OUT, ctx);
    },
  };
}

/**
 * Cuerdas en pad lento — atmósferas de desesperación/horror
 */
function makeStringPad(ctx, dest, chord, vol, reverb) {
  const gain = makeGain(ctx, 0);
  if (reverb) {
    gain.connect(reverb.input);
    reverb.output.connect(dest);
  } else {
    gain.connect(dest);
  }

  fadeTo(gain, vol, FADE_IN, ctx);

  const oscillators = [];
  chord.forEach((freq, i) => {
    const osc    = ctx.createOscillator();
    const oscGain = makeGain(ctx, 0);
    osc.type           = i % 3 === 0 ? "sawtooth" : "triangle";
    osc.frequency.value = freq;
    osc.detune.value    = (Math.random() - 0.5) * 12;

    // LFO de vibrato muy sutil
    const vib     = ctx.createOscillator();
    const vibGain = makeGain(ctx, 4);
    vib.frequency.value = 5.2 + Math.random() * 0.8;
    vib.connect(vibGain);
    vibGain.connect(osc.detune);
    vib.start();

    // Fade in lento de cada nota
    oscGain.gain.setValueAtTime(0, ctx.currentTime);
    oscGain.gain.linearRampToValueAtTime(
      0.12 / chord.length,
      ctx.currentTime + 1.5 + i * 0.3
    );

    // Filtro paso bajo para suavidad
    const filt = ctx.createBiquadFilter();
    filt.type            = "lowpass";
    filt.frequency.value = 1200;
    filt.Q.value         = 0.5;

    osc.connect(filt);
    filt.connect(oscGain);
    oscGain.connect(gain);
    osc.start();
    oscillators.push({ osc, vib, oscGain });
  });

  return {
    gain,
    stop: () => {
      fadeTo(gain, 0, FADE_OUT, ctx);
      setTimeout(() => {
        oscillators.forEach(({ osc, vib }) => {
          try { osc.stop(); } catch (_) {}
          try { vib.stop(); } catch (_) {}
        });
      }, (FADE_OUT + 0.3) * 1000);
    },
  };
}

// ─────────────────────────────────────────────────────────────
// ESCALAS Y ACORDES
// ─────────────────────────────────────────────────────────────

// La menor natural (A2 = 110Hz como tónica)
const SCALES = {
  // Melodía íntima — La menor dórica, tono cálido
  intimate: [
    110, 130.81, 146.83, 164.81, 196, 220,
    261.63, 246.94, 220, 196, 174.61, 164.81
  ],
  // Tensión — La menor armónica ascendente
  tension: [
    110, 123.47, 130.81, 146.83, 164.81, 174.61, 207.65, 220,
    246.94, 220, 207.65
  ],
  // Desesperación — Frigia, muy oscura
  despair: [
    82.41, 87.31, 98, 110, 123.47, 130.81, 155.56, 164.81,
    155.56, 130.81
  ],
  // Caos — Pentatónica disminuida
  chaos: [
    92.5, 110, 138.59, 164.81, 185, 207.65, 233.08, 246.94
  ],
  // Melancolía — Mi menor pentatónica, muy espaciada
  melancholy: [
    82.41, 98, 110, 123.47, 146.83, 164.81, 196,
    164.81, 146.83
  ],
  // Horror — cromática baja
  horror: [
    82.41, 87.31, 92.5, 98, 103.83, 110, 116.54
  ],
  // Íntimo bittersweet — Re menor, más cálido
  bittersweet: [
    146.83, 164.81, 174.61, 196, 220, 246.94, 261.63,
    246.94, 220, 196
  ],
};

// Acordes para pads de cuerda
const CHORDS = {
  intimate:      [110, 130.81, 164.81, 220],          // La m
  tension:       [110, 130.81, 155.56, 207.65],       // La m(maj7)
  despair:       [82.41, 98, 123.47, 164.81],         // Mi m
  horror:        [87.31, 103.83, 123.47, 155.56],     // Fa dim
  chaos:         [92.5, 110, 138.59, 185],            // Fa# dim
  melancholy:    [98, 116.54, 146.83, 185],           // Sol m
  bittersweet:   [146.83, 174.61, 220, 261.63],       // Re m
  violence:      [87.31, 110, 138.59, 174.61],        // Fa/La
  moral_dilemma: [98, 116.54, 138.59, 164.81],        // Si dim
  intense:       [110, 138.59, 164.81, 196],          // La m7
  stealth:       [82.41, 98, 123.47, 155.56],         // Mi m7
  somber:        [98, 116.54, 146.83, 174.61],        // Sol m7
};

// Frecuencias de drones por atmósfera
const DRONE_FREQS = {
  intimate:      55,
  tension:       46.25,   // Si♭1 — ligeramente disonante
  despair:       41.2,    // Mi1
  horror:        38.89,   // Re#1
  chaos:         43.65,   // Fa1
  violence:      40,      // entre Mi y Fa
  moral_dilemma: 41.2,
  melancholy:    43.65,
  intense:       46.25,
  stealth:       41.2,
  bittersweet:   49,      // Sol1
  somber:        43.65,
};

// ─────────────────────────────────────────────────────────────
// CONFIGURACIONES POR ATMÓSFERA
// Cada atmósfera combina capas: drone, viento, ruido, piano, pad, extras
// ─────────────────────────────────────────────────────────────
const ATMOSPHERE_CONFIG = {

  // ── ÍNTIMO — Berlín, casa, carpintería ────────────────────
  intimate: {
    drone:     { vol: 0.10, detune: 5, numOsc: 3 },
    wind:      { intensity: 0.05, vol: 0.03 },
    noise:     { filterType: "lowpass", freq: 180, Q: 0.8, vol: 0.012 },
    piano:     { scale: SCALES.intimate, intervalMs: 3200, vol: 0.40 },
    pad:       { chord: CHORDS.intimate, vol: 0.06 },
    reverb:    { decay: 2.5, preDelay: 0.015 },
    heartbeat: null,
    radio:     null,
    bells:     null,
    footsteps: null,
  },

  // ── TENSIÓN — Cuarteles, control ─────────────────────────
  tension: {
    drone:     { vol: 0.16, detune: 9, numOsc: 4 },
    wind:      { intensity: 0.20, vol: 0.04 },
    noise:     { filterType: "bandpass", freq: 320, Q: 1.5, vol: 0.018 },
    piano:     { scale: SCALES.tension, intervalMs: 4800, vol: 0.22 },
    pad:       { chord: CHORDS.tension, vol: 0.08 },
    reverb:    { decay: 3.5, preDelay: 0.025 },
    heartbeat: null,
    radio:     { vol: 0.07 },
    bells:     null,
    footsteps: null,
  },

  // ── DILEMA MORAL — Decisiones de conciencia ────────────────
  moral_dilemma: {
    drone:     { vol: 0.18, detune: 12, numOsc: 4 },
    wind:      { intensity: 0.10, vol: 0.025 },
    noise:     { filterType: "lowpass", freq: 240, Q: 1.0, vol: 0.015 },
    piano:     { scale: SCALES.tension, intervalMs: 5500, vol: 0.18 },
    pad:       { chord: CHORDS.moral_dilemma, vol: 0.12 },
    reverb:    { decay: 4.5, preDelay: 0.03 },
    heartbeat: { bpm: 52, vol: 0.06 },
    radio:     null,
    bells:     null,
    footsteps: null,
  },

  // ── INTENSO — Entrenamiento, marcha ───────────────────────
  intense: {
    drone:     { vol: 0.20, detune: 6, numOsc: 4 },
    wind:      { intensity: 0.30, vol: 0.05 },
    noise:     { filterType: "bandpass", freq: 450, Q: 2, vol: 0.022 },
    piano:     null,
    pad:       { chord: CHORDS.intense, vol: 0.10 },
    reverb:    { decay: 2, preDelay: 0.01 },
    heartbeat: null,
    radio:     { vol: 0.09 },
    bells:     null,
    footsteps: null,
  },

  // ── CAOS — Francia, Blitzkrieg ────────────────────────────
  chaos: {
    drone:     { vol: 0.22, detune: 18, numOsc: 5 },
    wind:      { intensity: 0.75, vol: 0.08 },
    noise:     { filterType: "bandpass", freq: 600, Q: 1.8, vol: 0.030 },
    piano:     null,
    pad:       { chord: CHORDS.chaos, vol: 0.08 },
    reverb:    { decay: 1.8, preDelay: 0.008 },
    heartbeat: null,
    radio:     { vol: 0.11 },
    bells:     { vol: 0.05 },
    footsteps: null,
  },

  // ── VIOLENCIA — Combate urbano ────────────────────────────
  violence: {
    drone:     { vol: 0.25, detune: 20, numOsc: 5 },
    wind:      { intensity: 0.60, vol: 0.07 },
    noise:     { filterType: "bandpass", freq: 500, Q: 2.5, vol: 0.028 },
    piano:     null,
    pad:       { chord: CHORDS.violence, vol: 0.09 },
    reverb:    { decay: 2.5, preDelay: 0.02 },
    heartbeat: { bpm: 68, vol: 0.04 },
    radio:     { vol: 0.08 },
    bells:     { vol: 0.03 },
    footsteps: null,
  },

  // ── BITTERSWEET — París ocupada ───────────────────────────
  bittersweet: {
    drone:     { vol: 0.12, detune: 7, numOsc: 3 },
    wind:      { intensity: 0.12, vol: 0.03 },
    noise:     { filterType: "lowpass", freq: 200, Q: 0.7, vol: 0.010 },
    piano:     { scale: SCALES.bittersweet, intervalMs: 3800, vol: 0.30 },
    pad:       { chord: CHORDS.bittersweet, vol: 0.07 },
    reverb:    { decay: 3, preDelay: 0.02 },
    heartbeat: null,
    radio:     null,
    bells:     null,
    footsteps: null,
  },

  // ── SIGILO — Movimiento furtivo ───────────────────────────
  stealth: {
    drone:     { vol: 0.14, detune: 8, numOsc: 3 },
    wind:      { intensity: 0.08, vol: 0.025 },
    noise:     { filterType: "lowpass", freq: 160, Q: 0.6, vol: 0.012 },
    piano:     { scale: SCALES.melancholy, intervalMs: 6000, vol: 0.14 },
    pad:       { chord: CHORDS.stealth, vol: 0.08 },
    reverb:    { decay: 4, preDelay: 0.04 },
    heartbeat: { bpm: 44, vol: 0.035 },
    radio:     null,
    bells:     null,
    footsteps: { vol: 0.04 },
  },

  // ── DESESPERACIÓN — Frente ruso, nieve ────────────────────
  despair: {
    drone:     { vol: 0.22, detune: 14, numOsc: 4 },
    wind:      { intensity: 0.55, vol: 0.09 },
    noise:     { filterType: "lowpass", freq: 140, Q: 0.5, vol: 0.016 },
    piano:     { scale: SCALES.despair, intervalMs: 7000, vol: 0.18 },
    pad:       { chord: CHORDS.despair, vol: 0.13 },
    reverb:    { decay: 5, preDelay: 0.04 },
    heartbeat: null,
    radio:     null,
    bells:     null,
    footsteps: { vol: 0.06 },
  },

  // ── HORROR — Stalingrado, masacres ───────────────────────
  horror: {
    drone:     { vol: 0.28, detune: 22, numOsc: 5 },
    wind:      { intensity: 0.45, vol: 0.06 },
    noise:     { filterType: "highpass", freq: 80, Q: 0.3, vol: 0.020 },
    piano:     { scale: SCALES.horror, intervalMs: 9000, vol: 0.12 },
    pad:       { chord: CHORDS.horror, vol: 0.15 },
    reverb:    { decay: 6, preDelay: 0.05 },
    heartbeat: { bpm: 38, vol: 0.08 },
    radio:     null,
    bells:     { vol: 0.04 },
    footsteps: null,
  },

  // ── SOMBRÍO — Rendición, derrota ─────────────────────────
  somber: {
    drone:     { vol: 0.18, detune: 10, numOsc: 4 },
    wind:      { intensity: 0.35, vol: 0.06 },
    noise:     { filterType: "lowpass", freq: 160, Q: 0.6, vol: 0.014 },
    piano:     { scale: SCALES.despair, intervalMs: 8000, vol: 0.16 },
    pad:       { chord: CHORDS.somber, vol: 0.11 },
    reverb:    { decay: 4.5, preDelay: 0.035 },
    heartbeat: null,
    radio:     null,
    bells:     { vol: 0.03 },
    footsteps: { vol: 0.035 },
  },

  // ── MELANCOLÍA — Epílogo, recuerdos ──────────────────────
  melancholy: {
    drone:     { vol: 0.10, detune: 6, numOsc: 3 },
    wind:      { intensity: 0.08, vol: 0.025 },
    noise:     { filterType: "lowpass", freq: 180, Q: 0.5, vol: 0.009 },
    piano:     { scale: SCALES.melancholy, intervalMs: 5500, vol: 0.32 },
    pad:       { chord: CHORDS.melancholy, vol: 0.06 },
    reverb:    { decay: 4, preDelay: 0.03 },
    heartbeat: null,
    radio:     null,
    bells:     null,
    footsteps: null,
  },
};

ATMOSPHERE_CONFIG._default = ATMOSPHERE_CONFIG.tension;

// ─────────────────────────────────────────────────────────────
// HOOK PRINCIPAL
// ─────────────────────────────────────────────────────────────

export function useAmbientSound() {
  const ctxRef      = useRef(null);
  const masterRef   = useRef(null);
  const layersRef   = useRef([]);
  const enabledRef  = useRef(false);
  const pendingAtm  = useRef("tension");
  const currentAtm  = useRef(null);
  const reverbRef   = useRef(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current  = new (window.AudioContext || window.webkitAudioContext)();
      masterRef.current = ctxRef.current.createGain();
      masterRef.current.gain.value = 0;
      masterRef.current.connect(ctxRef.current.destination);
    }
    return ctxRef.current;
  }, []);

  const stopAllLayers = useCallback((immediate = false) => {
    layersRef.current.forEach((layer) => {
      try {
        if (immediate) {
          layer.gain?.gain?.setValueAtTime(0, ctxRef.current?.currentTime || 0);
        }
        layer.stop();
      } catch (_) {}
    });
    layersRef.current = [];
    reverbRef.current = null;
  }, []);

  const spawnAtmosphere = useCallback((atmosphere, ctx, dest) => {
    const cfg = ATMOSPHERE_CONFIG[atmosphere] || ATMOSPHERE_CONFIG._default;
    const layers = [];

    // Crear reverb compartido para piano y pad
    let reverb = null;
    if (cfg.reverb && (cfg.piano || cfg.pad)) {
      reverb = makeReverb(ctx, cfg.reverb.decay, cfg.reverb.preDelay);
      reverbRef.current = reverb;
    }

    // ── Capa 1: Drone de base ────────────────────────────
    if (cfg.drone) {
      const droneFreq = DRONE_FREQS[atmosphere] || 55;
      const drone = makeDrone(ctx, dest, droneFreq, cfg.drone.vol, cfg.drone.detune, cfg.drone.numOsc);
      layers.push(drone);
    }

    // ── Capa 2: Viento ───────────────────────────────────
    if (cfg.wind && cfg.wind.vol > 0) {
      const wind = makeWind(ctx, dest, cfg.wind.intensity, cfg.wind.vol);
      layers.push(wind);
    }

    // ── Capa 3: Ruido de textura ─────────────────────────
    if (cfg.noise) {
      const noiseLayer = makeFilteredNoise(
        ctx, dest,
        cfg.noise.filterType,
        cfg.noise.freq,
        cfg.noise.Q,
        cfg.noise.vol
      );
      layers.push(noiseLayer);
    }

    // ── Capa 4: Piano ────────────────────────────────────
    if (cfg.piano) {
      const piano = makePianoNotes(ctx, dest, cfg.piano.scale, cfg.piano.intervalMs, cfg.piano.vol, reverb);
      layers.push(piano);
    }

    // ── Capa 5: Pad de cuerdas ───────────────────────────
    if (cfg.pad) {
      const pad = makeStringPad(ctx, dest, cfg.pad.chord, cfg.pad.vol, cfg.piano ? null : reverb);
      layers.push(pad);
    }

    // ── Capa 6: Latidos ──────────────────────────────────
    if (cfg.heartbeat) {
      const hb = makeHeartbeat(ctx, dest, cfg.heartbeat.bpm, cfg.heartbeat.vol);
      layers.push(hb);
    }

    // ── Capa 7: Estática de radio ────────────────────────
    if (cfg.radio) {
      const radio = makeRadioStatic(ctx, dest, cfg.radio.vol);
      layers.push(radio);
    }

    // ── Capa 8: Campanas distantes ───────────────────────
    if (cfg.bells) {
      const bells = makeDistantBells(ctx, dest, cfg.bells.vol);
      layers.push(bells);
    }

    // ── Capa 9: Pasos en nieve ───────────────────────────
    if (cfg.footsteps) {
      const steps = makeSnowFootsteps(ctx, dest, cfg.footsteps.vol);
      layers.push(steps);
    }

    currentAtm.current = atmosphere;
    layersRef.current  = layers;
  }, []);

  const enable = useCallback(() => {
    const ctx = getCtx();
    if (ctx.state === "suspended") ctx.resume();
    enabledRef.current = true;

    const now = ctx.currentTime;
    masterRef.current.gain.cancelScheduledValues(now);
    masterRef.current.gain.setValueAtTime(masterRef.current.gain.value, now);
    masterRef.current.gain.linearRampToValueAtTime(MASTER_VOLUME, now + 2.2);

    stopAllLayers();
    setTimeout(() => {
      if (!enabledRef.current) return;
      spawnAtmosphere(pendingAtm.current, ctx, masterRef.current);
    }, 500);
  }, [getCtx, stopAllLayers, spawnAtmosphere]);

  const disable = useCallback(() => {
    if (!ctxRef.current) return;
    const ctx = ctxRef.current;
    enabledRef.current = false;
    currentAtm.current = null;

    const now = ctx.currentTime;
    masterRef.current.gain.cancelScheduledValues(now);
    masterRef.current.gain.setValueAtTime(masterRef.current.gain.value, now);
    masterRef.current.gain.linearRampToValueAtTime(0, now + FADE_OUT);

    setTimeout(() => stopAllLayers(), (FADE_OUT + 0.3) * 1000);
  }, [stopAllLayers]);

  const setAtmosphere = useCallback((atmosphere) => {
    pendingAtm.current = atmosphere;
    if (!enabledRef.current || !ctxRef.current) return;
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") return;
    if (currentAtm.current === atmosphere) return;

    // Crossfade: fade out capas actuales, spawn nuevas tras pausa
    stopAllLayers();
    setTimeout(() => {
      if (!enabledRef.current) return;
      spawnAtmosphere(atmosphere, ctx, masterRef.current);
    }, FADE_OUT * 1000);
  }, [stopAllLayers, spawnAtmosphere]);

  useEffect(() => {
    return () => {
      enabledRef.current = false;
      stopAllLayers(true);
      try { ctxRef.current?.close(); } catch (_) {}
    };
  }, [stopAllLayers]);

  return { enable, disable, setAtmosphere };
}
