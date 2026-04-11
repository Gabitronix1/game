// useTypewriterSound.js — Cenizas del Frente
// Sonido de pluma/estilográfica sobre papel de época — orgánico, expresivo, cálido
// Arquitectura: cada trazo es único, las pausas tienen textura, el silencio respira
// Diseñado para no fatigar en sesiones largas de lectura

import { useRef, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// PARÁMETROS GLOBALES
// ─────────────────────────────────────────────────────────────
const MASTER_VOL = 0.58;   // Volumen global — discreto, nunca intrusivo
const CONTEXT_KEY = "__cenizas_tw_ctx";

// ─────────────────────────────────────────────────────────────
// SÍNTESIS DE TRAZO DE PLUMA
// Modelo acústico: la pluma sobre papel produce:
//   1. Fricción de punta → ruido de alta frecuencia, muy breve
//   2. Rasgado del papel → banda media, envolvente asimétrica
//   3. Resonancia del papel → suave cola de baja frecuencia
// ─────────────────────────────────────────────────────────────

/**
 * Genera un buffer de ruido con forma espectral personalizada
 * @param {AudioContext} ctx
 * @param {number} durationSec
 * @param {number} spectralTilt - 0=plano, positivo=más bajos, negativo=más agudos
 */
function makeColoredNoiseBuffer(ctx, durationSec, spectralTilt = 0) {
  const len    = Math.ceil(ctx.sampleRate * durationSec);
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
  const data   = buffer.getChannelData(0);

  // Ruido blanco base
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;

  // Colorear con integración simple (simula filtro de 1ª orden)
  if (spectralTilt !== 0) {
    let prev = 0;
    const coeff = spectralTilt > 0 ? 0.92 : 0.3;
    for (let i = 0; i < len; i++) {
      data[i] = spectralTilt > 0
        ? data[i] * (1 - coeff) + prev * coeff   // más grave
        : data[i] * coeff - prev * (1 - coeff);  // más agudo
      prev = data[i];
    }
  }

  return buffer;
}

/**
 * Envolvente ADSR completa en un GainNode
 */
function applyEnvelope(gainNode, ctx, { attack, decay, sustain, release }, startTime, totalDur) {
  const g   = gainNode.gain;
  const now = startTime;
  g.cancelScheduledValues(now);
  g.setValueAtTime(0, now);
  g.linearRampToValueAtTime(1, now + attack);
  g.linearRampToValueAtTime(sustain, now + attack + decay);
  g.setValueAtTime(sustain, now + totalDur - release);
  g.linearRampToValueAtTime(0, now + totalDur);
}

// ─────────────────────────────────────────────────────────────
// TIPOS DE CARACTERES → PARÁMETROS ACÚSTICOS
// ─────────────────────────────────────────────────────────────

function getCharParams(charType, atmosphere) {
  // Base de presión y duración según atmósfera
  const atmPressure = {
    intimate:      { pressureMul: 0.85, durationMul: 1.20 },
    tension:       { pressureMul: 1.10, durationMul: 0.90 },
    moral_dilemma: { pressureMul: 0.95, durationMul: 1.10 },
    intense:       { pressureMul: 1.15, durationMul: 0.80 },
    chaos:         { pressureMul: 1.20, durationMul: 0.75 },
    violence:      { pressureMul: 1.25, durationMul: 0.70 },
    despair:       { pressureMul: 0.80, durationMul: 1.30 },
    horror:        { pressureMul: 0.90, durationMul: 1.15 },
    melancholy:    { pressureMul: 0.75, durationMul: 1.40 },
    bittersweet:   { pressureMul: 0.88, durationMul: 1.15 },
    stealth:       { pressureMul: 0.70, durationMul: 1.25 },
    somber:        { pressureMul: 0.82, durationMul: 1.20 },
  };

  const atm = atmPressure[atmosphere] || { pressureMul: 1, durationMul: 1 };

  switch (charType) {
    case "space":
      // Leve sonido de la pluma levantándose — casi imperceptible
      return {
        enabled:     true,
        durationSec: 0.008 + Math.random() * 0.006,
        vol:         0.02 * atm.pressureMul,
        tipFreq:     3500 + Math.random() * 1000,
        paperFreq:   400,
        paperVol:    0.008,
        envelopeType: "lift",  // La pluma se levanta
        spectralTilt: -1,
      };

    case "punctuation":
      // Punto/coma: presión firme, muy breve
      return {
        enabled:     true,
        durationSec: (0.022 + Math.random() * 0.012) * atm.durationMul,
        vol:         (0.28 + Math.random() * 0.06) * atm.pressureMul,
        tipFreq:     4200 + Math.random() * 800,
        paperFreq:   280 + Math.random() * 120,
        paperVol:    0.12 * atm.pressureMul,
        envelopeType: "press",
        spectralTilt: 0,
      };

    case "dash":
      // Guión largo: trazo horizontal sostenido, más grave
      return {
        enabled:     true,
        durationSec: (0.055 + Math.random() * 0.025) * atm.durationMul,
        vol:         (0.18 + Math.random() * 0.05) * atm.pressureMul,
        tipFreq:     2200 + Math.random() * 400,
        paperFreq:   220 + Math.random() * 80,
        paperVol:    0.09 * atm.pressureMul,
        envelopeType: "slide",
        spectralTilt: 0.5,
      };

    case "newline":
      // Salto de línea: ruido de papel moviéndose
      return {
        enabled:     true,
        durationSec: 0.035 + Math.random() * 0.02,
        vol:         0.06 * atm.pressureMul,
        tipFreq:     800,
        paperFreq:   150,
        paperVol:    0.05,
        envelopeType: "paper_move",
        spectralTilt: 1.5,
      };

    default:
      // Letra normal: trazo de arrastre orgánico
      return {
        enabled:     true,
        durationSec: (0.016 + Math.random() * 0.018) * atm.durationMul,
        vol:         (0.12 + Math.random() * 0.08) * atm.pressureMul,
        tipFreq:     2800 + Math.random() * 1400,
        paperFreq:   300 + Math.random() * 200,
        paperVol:    (0.06 + Math.random() * 0.04) * atm.pressureMul,
        envelopeType: "stroke",
        spectralTilt: -0.3,
      };
  }
}

// ─────────────────────────────────────────────────────────────
// SÍNTESIS DE UN TRAZO INDIVIDUAL
// ─────────────────────────────────────────────────────────────

function synthesizeStroke(ctx, dest, masterGain, params, now) {
  if (!params.enabled) return;

  const dur = params.durationSec;

  // ── Capa 1: Punta de la pluma (fricción de alta freq) ──
  {
    const src  = ctx.createBufferSource();
    src.buffer = makeColoredNoiseBuffer(ctx, dur + 0.01, params.spectralTilt);

    const filter = ctx.createBiquadFilter();
    filter.type            = "bandpass";
    filter.frequency.value = params.tipFreq;
    filter.Q.value         = params.envelopeType === "stroke" ? 0.8 : 1.2;

    const gain = ctx.createGain();

    switch (params.envelopeType) {
      case "press":
        // Punto de impacto: ataque instantáneo, caída rápida
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(params.vol, now + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
        break;
      case "slide":
        // Deslizamiento: rampa suave
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(params.vol, now + dur * 0.2);
        gain.gain.setValueAtTime(params.vol * 0.85, now + dur * 0.7);
        gain.gain.linearRampToValueAtTime(0, now + dur);
        break;
      case "lift":
        // Levantamiento: muy breve, casi sin sonido
        gain.gain.setValueAtTime(params.vol * 0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
        break;
      case "paper_move":
        // Movimiento de papel: envolvente suave y grave
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(params.vol * 0.4, now + dur * 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
        break;
      default:
        // stroke normal: asimétrico — arranque rápido, cola larga
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(params.vol, now + dur * 0.12);
        gain.gain.setValueAtTime(params.vol * 0.7, now + dur * 0.35);
        gain.gain.linearRampToValueAtTime(0, now + dur);
    }

    src.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    src.start(now);
    src.stop(now + dur + 0.015);
  }

  // ── Capa 2: Resonancia del papel (banda baja) ──────────
  if (params.paperVol > 0.01 && params.envelopeType !== "lift") {
    const src2  = ctx.createBufferSource();
    src2.buffer = makeColoredNoiseBuffer(ctx, dur + 0.02, 1.8);

    const filter2 = ctx.createBiquadFilter();
    filter2.type            = "bandpass";
    filter2.frequency.value = params.paperFreq;
    filter2.Q.value         = 1.4;

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(params.paperVol, now + dur * 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + dur * 1.8);  // más larga que la fricción

    src2.connect(filter2);
    filter2.connect(gain2);
    gain2.connect(masterGain);
    src2.start(now);
    src2.stop(now + dur * 2 + 0.02);
  }

  // ── Capa 3: Clic de presión inicial — solo en letras de impacto ──
  if (params.envelopeType === "press" || (params.envelopeType === "stroke" && Math.random() < 0.15)) {
    const clickLen = Math.ceil(ctx.sampleRate * 0.003);
    const clickBuf = ctx.createBuffer(1, clickLen, ctx.sampleRate);
    const clickDat = clickBuf.getChannelData(0);
    for (let i = 0; i < clickLen; i++) {
      clickDat[i] = (Math.random() * 2 - 1) * (1 - i / clickLen);
    }

    const clickSrc = ctx.createBufferSource();
    clickSrc.buffer = clickBuf;

    const clickFilt = ctx.createBiquadFilter();
    clickFilt.type            = "highpass";
    clickFilt.frequency.value = 5000;

    const clickGain = ctx.createGain();
    clickGain.gain.value = params.vol * 0.35;

    clickSrc.connect(clickFilt);
    clickFilt.connect(clickGain);
    clickGain.connect(masterGain);
    clickSrc.start(now);
    clickSrc.stop(now + 0.004);
  }
}

// ─────────────────────────────────────────────────────────────
// SONIDO DE PAUSA ENTRE PÁRRAFOS
// El silencio también tiene textura — leve movimiento de hoja
// ─────────────────────────────────────────────────────────────

function synthesizeParagraphBreak(ctx, dest, masterGain, now) {
  // Hoja de papel que se apoya levemente
  const dur = 0.12 + Math.random() * 0.08;
  const buf  = makeColoredNoiseBuffer(ctx, dur, 2);
  const src  = ctx.createBufferSource();
  src.buffer = buf;

  const filt = ctx.createBiquadFilter();
  filt.type            = "lowpass";
  filt.frequency.value = 300;
  filt.Q.value         = 0.6;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.04, now + dur * 0.3);
  gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

  src.connect(filt);
  filt.connect(gain);
  gain.connect(masterGain);
  src.start(now);
  src.stop(now + dur + 0.02);
}

// ─────────────────────────────────────────────────────────────
// COLA DE PROCESAMIENTO ANTI-SATURACIÓN
// Asegura que los trazos rápidos no se solapen destructivamente
// ─────────────────────────────────────────────────────────────

class StrokeQueue {
  constructor(ctx) {
    this.ctx      = ctx;
    this.nextTime = ctx.currentTime;
    this.minGap   = 0.004;  // 4ms gap mínimo entre trazos
  }

  schedule(fn) {
    const now  = this.ctx.currentTime;
    const time = Math.max(now + 0.002, this.nextTime);
    fn(time);
    this.nextTime = time + this.minGap;
  }
}

// ─────────────────────────────────────────────────────────────
// HOOK PRINCIPAL
// ─────────────────────────────────────────────────────────────

export function useTypewriterSound() {
  const ctxRef       = useRef(null);
  const masterRef    = useRef(null);
  const queueRef     = useRef(null);
  const enabledRef   = useRef(false);
  const atmosphereRef = useRef("tension");

  // Clasificar carácter
  const classifyChar = useCallback((char) => {
    if (char === " " || char === "\t")    return "space";
    if (/[.,;:!?…]/.test(char))          return "punctuation";
    if (/[—–\-]/.test(char))             return "dash";
    if (char === "\n")                    return "newline";
    return "normal";
  }, []);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current  = new (window.AudioContext || window.webkitAudioContext)();

      // Ganancia maestra con compresión suave — evita picos
      const comp = ctxRef.current.createDynamicsCompressor();
      comp.threshold.value = -18;
      comp.knee.value      = 8;
      comp.ratio.value     = 4;
      comp.attack.value    = 0.003;
      comp.release.value   = 0.12;
      comp.connect(ctxRef.current.destination);

      masterRef.current = ctxRef.current.createGain();
      masterRef.current.gain.value = MASTER_VOL;
      masterRef.current.connect(comp);

      queueRef.current = new StrokeQueue(ctxRef.current);
    }
    return ctxRef.current;
  }, []);

  /**
   * Sonido principal por carácter
   * @param {string} charType - clasificación del carácter
   */
  const tick = useCallback((charType = "normal") => {
    if (!enabledRef.current) return;
    const ctx = getCtx();
    if (ctx.state === "suspended") ctx.resume();

    // Actualizar queue con tiempo actual
    if (!queueRef.current) queueRef.current = new StrokeQueue(ctx);

    const atmosphere = atmosphereRef.current;

    queueRef.current.schedule((time) => {
      const params = getCharParams(classifyChar(charType), atmosphere);
      synthesizeStroke(ctx, ctx.destination, masterRef.current, params, time);
    });
  }, [getCtx, classifyChar]);

  /**
   * Carriage return / fin de párrafo
   */
  const carriageReturn = useCallback(() => {
    if (!enabledRef.current) return;
    const ctx = getCtx();
    if (ctx.state === "suspended") ctx.resume();
    if (!queueRef.current) queueRef.current = new StrokeQueue(ctx);

    queueRef.current.schedule((time) => {
      synthesizeParagraphBreak(ctx, ctx.destination, masterRef.current, time + 0.05);
    });
  }, [getCtx]);

  /**
   * Cambiar atmósfera — afecta el carácter de los trazos
   */
  const setAtmosphere = useCallback((atmosphere) => {
    atmosphereRef.current = atmosphere;
  }, []);

  const enable = useCallback(() => {
    enabledRef.current = true;
    const ctx = getCtx();
    if (ctx.state === "suspended") ctx.resume();
  }, [getCtx]);

  const disable = useCallback(() => {
    enabledRef.current = false;
  }, []);

  useEffect(() => {
    return () => {
      enabledRef.current = false;
      try { ctxRef.current?.close(); } catch (_) {}
    };
  }, []);

  return { tick, carriageReturn, setAtmosphere, enable, disable };
}
