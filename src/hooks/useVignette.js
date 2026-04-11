// useVignette.js
// Hook que conecta el estado emocional a efectos visuales dinámicos:
// - Vignette (oscurecimiento de bordes) según miedo/humanidad
// - Color tint sutil según atmósfera
// - Glitch effect en momentos de horror/atrocidad

import { useEffect, useRef, useCallback } from "react";

// ── Paleta de tints por atmósfera ─────────────────────────
const ATMOSPHERE_TINT = {
  horror:        { h: 0,   s: 70,  l: 12, a: 0.08 },
  violence:      { h: 10,  s: 60,  l: 15, a: 0.06 },
  chaos:         { h: 20,  s: 55,  l: 15, a: 0.07 },
  tension:       { h: 240, s: 20,  l: 10, a: 0.04 },
  moral_dilemma: { h: 270, s: 30,  l: 10, a: 0.05 },
  intense:       { h: 30,  s: 40,  l: 12, a: 0.05 },
  despair:       { h: 220, s: 40,  l: 8,  a: 0.07 },
  melancholy:    { h: 200, s: 20,  l: 10, a: 0.04 },
  intimate:      { h: 38,  s: 30,  l: 12, a: 0.03 },
  bittersweet:   { h: 38,  s: 35,  l: 12, a: 0.04 },
  stealth:       { h: 150, s: 15,  l: 8,  a: 0.05 },
  somber:        { h: 220, s: 15,  l: 8,  a: 0.04 },
};

// Atmósferas que disparan glitch
const GLITCH_ATMOSPHERES = new Set(["horror", "violence", "chaos", "moral_dilemma"]);

// Interpolación lineal entre dos valores
const lerp = (a, b, t) => a + (b - a) * Math.min(1, Math.max(0, t));

export function useVignette() {
  const overlayRef = useRef(null);
  const glitchTimeoutRef = useRef(null);
  const animFrameRef = useRef(null);
  const currentStateRef = useRef({
    vignetteOpacity: 0,
    tintOpacity: 0,
    tintColor: { h: 0, s: 0, l: 0 },
    isGlitching: false,
  });
  const targetStateRef = useRef({ ...currentStateRef.current });

  // Crear el overlay de efectos visuales
  const createOverlay = useCallback(() => {
    if (overlayRef.current) return;

    const overlay = document.createElement("div");
    overlay.id = "vignette-overlay";
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 45;
      transition: opacity 0.3s ease;
    `;

    // Vignette layer
    const vignette = document.createElement("div");
    vignette.id = "vignette-layer";
    vignette.style.cssText = `
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0) 100%);
      opacity: 0;
      transition: opacity 2s ease;
    `;

    // Tint layer
    const tint = document.createElement("div");
    tint.id = "tint-layer";
    tint.style.cssText = `
      position: absolute;
      inset: 0;
      opacity: 0;
      transition: opacity 2s ease, background-color 2.5s ease;
    `;

    // Glitch layer
    const glitch = document.createElement("div");
    glitch.id = "glitch-layer";
    glitch.style.cssText = `
      position: absolute;
      inset: 0;
      opacity: 0;
      mix-blend-mode: overlay;
    `;

    // Estilos de animación glitch (inyectados una vez)
    if (!document.getElementById("vignette-styles")) {
      const style = document.createElement("style");
      style.id = "vignette-styles";
      style.textContent = `
        @keyframes glitch-h {
          0%   { clip-path: inset(40% 0 61% 0); transform: translate(-4px, 0); }
          20%  { clip-path: inset(92% 0 1% 0);  transform: translate(4px, 0); }
          40%  { clip-path: inset(43% 0 1% 0);  transform: translate(-2px, 0); }
          60%  { clip-path: inset(25% 0 58% 0); transform: translate(2px, 0); }
          80%  { clip-path: inset(54% 0 7% 0);  transform: translate(-3px, 0); }
          100% { clip-path: inset(58% 0 43% 0); transform: translate(0, 0); }
        }
        @keyframes glitch-h2 {
          0%   { clip-path: inset(2% 0 86% 0);  transform: translate(3px, 0) skewX(-2deg); }
          20%  { clip-path: inset(77% 0 7% 0);  transform: translate(-3px, 0); }
          40%  { clip-path: inset(55% 0 42% 0); transform: translate(2px, 0) skewX(1deg); }
          60%  { clip-path: inset(12% 0 72% 0); transform: translate(-2px, 0); }
          80%  { clip-path: inset(84% 0 2% 0);  transform: translate(3px, 0); }
          100% { clip-path: inset(30% 0 60% 0); transform: translate(0, 0); }
        }
        .glitch-active-1 {
          content: '';
          position: absolute;
          inset: 0;
          background: inherit;
          animation: glitch-h 0.4s infinite linear alternate-reverse;
          opacity: 0.7;
        }
        .glitch-active-2 {
          animation: glitch-h2 0.4s infinite linear alternate-reverse;
          opacity: 0.5;
        }
      `;
      document.head.appendChild(style);
    }

    overlay.appendChild(vignette);
    overlay.appendChild(tint);
    overlay.appendChild(glitch);
    document.body.appendChild(overlay);
    overlayRef.current = overlay;
  }, []);

  // Actualizar vignette según emociones
  const updateEmotions = useCallback((emotions) => {
    if (!overlayRef.current) return;

    const { miedo = 20, humanidad = 80 } = emotions;

    // Vignette: alta con miedo alto o humanidad baja
    const miedoFactor = Math.max(0, (miedo - 30) / 70);    // 0 cuando miedo<30, 1 cuando miedo=100
    const humanidadFactor = Math.max(0, (40 - humanidad) / 40); // 0 cuando humanidad>40, 1 cuando =0

    const vignetteIntensity = Math.min(0.92, Math.max(miedoFactor, humanidadFactor) * 0.9);

    const vl = overlayRef.current.querySelector("#vignette-layer");
    if (vl) {
      // Degradado más o menos intenso según el factor
      const innerStop = lerp(45, 15, vignetteIntensity);
      const outerStop = lerp(0, 0.85, vignetteIntensity);
      vl.style.background = `radial-gradient(ellipse at center, transparent ${innerStop}%, rgba(0,0,0,${outerStop.toFixed(2)}) 100%)`;
      vl.style.opacity = "1";
    }
  }, []);

  // Actualizar tint y glitch según atmósfera
  const updateAtmosphere = useCallback((atmosphere) => {
    if (!overlayRef.current) return;

    const tintConfig = ATMOSPHERE_TINT[atmosphere] || ATMOSPHERE_TINT.tension;
    const tl = overlayRef.current.querySelector("#tint-layer");

    if (tl) {
      tl.style.backgroundColor = `hsla(${tintConfig.h}, ${tintConfig.s}%, ${tintConfig.l}%, 1)`;
      tl.style.opacity = tintConfig.a.toString();
    }

    // Activar/desactivar glitch
    if (GLITCH_ATMOSPHERES.has(atmosphere)) {
      scheduleGlitch(atmosphere);
    } else {
      stopGlitch();
    }
  }, []);

  // Glitch intermitente — se activa esporádicamente
  const scheduleGlitch = useCallback((atmosphere) => {
    if (glitchTimeoutRef.current) return; // ya programado

    const minDelay = atmosphere === "horror" ? 4000 : 8000;
    const maxDelay = atmosphere === "horror" ? 12000 : 20000;
    const delay = minDelay + Math.random() * (maxDelay - minDelay);

    glitchTimeoutRef.current = setTimeout(() => {
      glitchTimeoutRef.current = null;
      triggerGlitch(atmosphere);
    }, delay);
  }, []);

  const triggerGlitch = useCallback((atmosphere) => {
    if (!overlayRef.current) return;

    const gl = overlayRef.current.querySelector("#glitch-layer");
    if (!gl) return;

    // Crear pseudo-elementos con JS
    gl.innerHTML = `
      <div style="
        position: absolute; inset: 0;
        background: rgba(200,50,50,0.04);
        animation: glitch-h 0.35s 3 linear alternate-reverse;
        clip-path: inset(30% 0 50% 0);
        transform: translateX(-3px);
      "></div>
      <div style="
        position: absolute; inset: 0;
        background: rgba(50,50,200,0.03);
        animation: glitch-h2 0.35s 3 linear alternate-reverse;
        clip-path: inset(60% 0 20% 0);
        transform: translateX(2px);
      "></div>
    `;
    gl.style.opacity = "1";

    // Duración del glitch: 0.8 - 1.5s
    const duration = 800 + Math.random() * 700;
    setTimeout(() => {
      if (gl) {
        gl.style.opacity = "0";
        gl.innerHTML = "";
      }
      // Programar el siguiente
      if (GLITCH_ATMOSPHERES.has(atmosphere)) {
        scheduleGlitch(atmosphere);
      }
    }, duration);
  }, [scheduleGlitch]);

  const stopGlitch = useCallback(() => {
    if (glitchTimeoutRef.current) {
      clearTimeout(glitchTimeoutRef.current);
      glitchTimeoutRef.current = null;
    }
    if (overlayRef.current) {
      const gl = overlayRef.current.querySelector("#glitch-layer");
      if (gl) {
        gl.style.opacity = "0";
        gl.innerHTML = "";
      }
    }
  }, []);

  // Efecto flash rojo para momentos de impacto alto
  const triggerImpactFlash = useCallback(() => {
    if (!overlayRef.current) return;
    const flash = document.createElement("div");
    flash.style.cssText = `
      position: absolute;
      inset: 0;
      background: rgba(120, 0, 0, 0.15);
      pointer-events: none;
      transition: opacity 0.8s ease;
    `;
    overlayRef.current.appendChild(flash);
    setTimeout(() => { flash.style.opacity = "0"; }, 50);
    setTimeout(() => { flash.remove(); }, 850);
  }, []);

  // Inicializar al montar
  useEffect(() => {
    createOverlay();
    return () => {
      stopGlitch();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      const overlay = document.getElementById("vignette-overlay");
      if (overlay) overlay.remove();
      overlayRef.current = null;
    };
  }, [createOverlay, stopGlitch]);

  return {
    updateEmotions,
    updateAtmosphere,
    triggerImpactFlash,
    stopGlitch,
  };
}