import { useEffect, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface ScrubbedSceneOptions {
  enabled: boolean;
  /** Alturas de viewport que a cena permanece fixada. */
  screens: number;
  /** Prepara os elementos uma vez e devolve a função que desenha o quadro para um progresso. */
  setup: (root: HTMLElement) => (progress: number) => void;
  /** Progresso exibido quando `enabled` é falso (movimento reduzido). */
  staticProgress: number;
}

/**
 * Fixa a cena e liga o progresso do scroll a `render`. O `scrub` suaviza apenas o número
 * de progresso; o desenho do quadro deve ser uma função pura dele.
 */
export function useScrubbedScene(rootRef: RefObject<HTMLElement | null>, options: ScrubbedSceneOptions) {
  const { enabled, screens, setup, staticProgress } = options;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const render = setup(root);

    // Animações ambientais (nuvens, flores, trigo) fora da tela só gastam quadros: pausa via CSS.
    const visibility = new IntersectionObserver(([entry]) => {
      root.dataset.offscreen = String(!(entry?.isIntersecting ?? true));
    });
    visibility.observe(root);

    if (!enabled) {
      render(staticProgress);
      return () => visibility.disconnect();
    }

    const ctx = gsap.context(() => {
      const state = { progress: 0 };
      gsap.to(state, {
        progress: 1,
        ease: "none",
        onUpdate: () => render(state.progress),
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${window.innerHeight * screens}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      render(0);
    }, root);

    // Fontes e ilustrações alteram alturas após a hidratação; recalcula os pontos de pin.
    ScrollTrigger.refresh();
    return () => {
      ctx.revert();
      visibility.disconnect();
    };
  }, [rootRef, enabled, screens, setup, staticProgress]);
}