"use client";

import { enableFullMotion, useForcedFullMotion } from "@/hooks/motionPreference";
import { useSystemReducedMotion } from "@/hooks/useMediaQuery";

/**
 * Seu sistema pede movimento reduzido, então o site mostra a versão estática (sem pins nem câmera).
 * Como isso é fácil de ligar sem perceber (ex.: "Efeitos de animação" desligado no Windows), o aviso
 * explica e oferece a experiência completa por escolha do visitante.
 */
export function MotionNotice() {
  const systemReduced = useSystemReducedMotion();
  const forcedFull = useForcedFullMotion();
  if (!systemReduced || forcedFull) return null;

  return (
    <section
      aria-label="Aviso sobre animações"
      className="fixed bottom-4 left-1/2 z-[70] w-[min(92vw,34rem)] -translate-x-1/2 rounded-2xl border border-chocolate/25 bg-cream p-4 text-sm text-chocolate shadow-2xl"
    >
      <p>
        Seu dispositivo está com <strong>movimento reduzido</strong>, então você está vendo a versão estática do site, sem o scroll cinematográfico.
      </p>
      <button
        type="button"
        onClick={enableFullMotion}
        className="mt-3 rounded-full bg-chocolate px-5 py-2 text-cream transition hover:bg-brick"
      >
        Ver a experiência completa
      </button>
    </section>
  );
}