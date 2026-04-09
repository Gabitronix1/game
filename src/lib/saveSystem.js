// Sistema de persistencia — Cenizas del Frente
// Maneja guardado/carga de partida y registro de finales desbloqueados

const SAVE_KEY = "cenizas_save";
const ENDINGS_KEY = "cenizas_endings";

// ── Partida ────────────────────────────────────────────────

export function saveGame(state) {
  try {
    const data = {
      currentSceneId: state.currentSceneId,
      emotions: state.emotions,
      choicesMade: state.choicesMade,
      narrativeFlags: state.narrativeFlags,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function deleteSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function hasSave() {
  return !!localStorage.getItem(SAVE_KEY);
}

// Formatea la fecha de guardado para mostrar en UI
export function formatSaveDate(isoString) {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

// ── Finales desbloqueados ──────────────────────────────────

export function unlockEnding(endingType) {
  try {
    const current = getUnlockedEndings();
    if (!current.includes(endingType)) {
      current.push(endingType);
      localStorage.setItem(ENDINGS_KEY, JSON.stringify(current));
    }
  } catch {
    // silencioso
  }
}

export function getUnlockedEndings() {
  try {
    const raw = localStorage.getItem(ENDINGS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function clearAllData() {
  try {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(ENDINGS_KEY);
    return true;
  } catch {
    return false;
  }
}
