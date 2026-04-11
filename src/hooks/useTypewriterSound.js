// useTypewriterSound.js
// Sonido de lápiz/pluma sobre papel — orgánico, suave, sin componente metálica
// Cada trazo es ruido de fricción muy filtrado con envolvente corta

import { useRef, useEffect, useCallback } from "react";

export function useTypewriterSound() {
  const ctxRef     = useRef(null);
  const enabledRef = useRef(false);
  // AudioContext compartido para no crear uno por tick
  const gainRef    = useRef(null); // ganancia maestra del typewriter

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current  = new (window.AudioContext || window.webkitAudioContext)();
      gainRef.current = ctxRef.current.createGain();
      gainRef.current.gain.value = 0.55; // volumen global del lápiz
      gainRef.current.connect(ctxRef.current.destination);
    }
    return ctxRef.current;
  }, []);

  // Trazo de lápiz — fricción suave sobre papel
  const tick = useCallback((charType = "normal") => {
    if (!enabledRef.current) return;
    const ctx  = getCtx();
    if (ctx.state === "suspended") ctx.resume();
    const now  = ctx.currentTime;
    const dest = gainRef.current;

    // Duración y carácter del trazo según tipo de caracter
    let durationMs, filterFreq, filterQ, vol;
    if (charType === "space") {
      // Espacio: sin sonido — el lápiz se levanta
      return;
    } else if (charType === "punctuation") {
      // Puntuación: trazo corto y más marcado — punta que presiona
      durationMs = 28;
      filterFreq = 3800;
      filterQ    = 0.6;
      vol        = 0.18;
    } else {
      // Letra normal: trazo de longitud variable, muy suave
      durationMs = 18 + Math.random() * 16; // 18-34ms
      filterFreq = 2200 + Math.random() * 800; // variación natural
      filterQ    = 0.4;
      vol        = 0.10 + Math.random() * 0.07;
    }

    const durSec = durationMs / 1000;
    const bufLen = Math.floor(ctx.sampleRate * durSec);
    const buffer = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data   = buffer.getChannelData(0);

    // Ruido con forma de trazo: sube rápido, cae suave
    for (let i = 0; i < bufLen; i++) {
      const t   = i / bufLen;
      // Envolvente: ataque 15%, sostenido leve, decay 85%
      const env = t < 0.15
        ? t / 0.15
        : 1 - ((t - 0.15) / 0.85);
      // Ruido con granularidad — simula el papel con textura
      const grain = Math.random() * 2 - 1;
      data[i] = grain * env * vol;
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;

    // Filtro paso alto + paso bajo → banda estrecha que suena a fricción de grafito
    const hipass = ctx.createBiquadFilter();
    hipass.type            = "highpass";
    hipass.frequency.value = 800;

    const lopass = ctx.createBiquadFilter();
    lopass.type            = "lowpass";
    lopass.frequency.value = filterFreq;
    lopass.Q.value         = filterQ;

    // Suavizado final para que no haya click al inicio/fin
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(1, now + 0.002);
    env.gain.setValueAtTime(1, now + durSec - 0.003);
    env.gain.linearRampToValueAtTime(0, now + durSec);

    src.connect(hipass);
    hipass.connect(lopass);
    lopass.connect(env);
    env.connect(dest);

    src.start(now);
    src.stop(now + durSec + 0.005);
  }, [getCtx]);

  // Pausa larga (fin de párrafo) — sin sonido, silencio natural
  const carriageReturn = useCallback(() => {
    // Con lápiz no hay retorno de carro mecánico
    // El silencio entre párrafos es el sonido
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

  return { tick, carriageReturn, enable, disable };
}