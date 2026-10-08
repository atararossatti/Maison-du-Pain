"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

export type SoundName = "tap" | "open";

interface SoundApi {
  enabled: boolean;
  toggle: () => void;
  play: (name: SoundName) => void;
}

/** Notas (Hz) e duração (s) de cada efeito: sintetizados, sem arquivos de áudio. */
const SOUNDS: Record<SoundName, { notes: number[]; length: number }> = {
  tap: { notes: [520, 390], length: 0.09 },
  open: { notes: [440, 660], length: 0.14 },
};

const SoundContext = createContext<SoundApi>({ enabled: false, toggle: () => {}, play: () => {} });

export const useSound = () => useContext(SoundContext);

/**
 * Efeitos sonoros opcionais. Começam desligados e o AudioContext só é criado quando
 * o usuário os liga (gesto explícito), então nada toca nem inicializa sozinho.
 */
export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const context = useRef<AudioContext | null>(null);

  useEffect(
    () => () => {
      void context.current?.close();
      context.current = null;
    },
    [],
  );

  const toggle = useCallback(() => {
    setEnabled((current) => {
      if (!current && !context.current) context.current = new AudioContext();
      void context.current?.resume();
      return !current;
    });
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      const audio = context.current;
      if (!enabled || !audio) return;
      const { notes, length } = SOUNDS[name];
      const gain = audio.createGain();
      gain.connect(audio.destination);
      gain.gain.setValueAtTime(0.0001, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, audio.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + length * notes.length);
      notes.forEach((frequency, index) => {
        const oscillator = audio.createOscillator();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        oscillator.connect(gain);
        oscillator.start(audio.currentTime + index * length);
        oscillator.stop(audio.currentTime + (index + 1) * length);
      });
    },
    [enabled],
  );

  const value = useMemo(() => ({ enabled, toggle, play }), [enabled, toggle, play]);
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}