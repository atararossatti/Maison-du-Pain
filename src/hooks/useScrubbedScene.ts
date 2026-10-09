import { useEffect, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface ScrubbedSceneOptions {
  enabled: boolean;
  /** Prepara os elementos uma vez e devolve a função que desenha o quadro para um progresso. */
  setup: (root: HTMLElement) => (progress: number) => void;
  /** Progresso exibido quando `enabled` é falso (movimento reduzido). */
  staticProgress: number;
}

/**
 * Liga o progresso do scroll sobre o palco (`ScrubStage`, o pai da cena) a `render`. O `scrub` suaviza apenas o número
 * de progresso; o desenho do quadro deve ser uma função pura dele.
 */
export function useScrubbedScene(rootRef: RefObject<HTMLElement | null>, options: ScrubbedSceneOptions) {
  const { enabled, setup, staticProgress } = options;

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

    const stage = root.parentElement;
    if (!stage) return () => visibility.disconnect();

    const ctx = gsap.context(() => {
      const state = { progress: 0 };
      gsap.to(state, {
        progress: 1,
        ease: "none",
        onUpdate: () => render(state.progress),
        scrollTrigger: {
          // O palco tem (telas + 1) viewports: o progresso vai de 0 a 1 enquanto a cena fica colada.
          trigger: stage,
          start: "top top",
          // O palco tem (telas + 1) viewports, mais 1 se outra cena sobe por cima: nesse caso o progresso termina
          // uma tela antes e o último quadro fica inteiro à vista até a próxima cena cobri-lo.
          end: () => `+=${stage.offsetHeight - window.innerHeight * (stage.dataset.covered === "true" ? 2 : 1)}`,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      render(0);
    }, root);

    // Fontes e ilustrações alteram alturas após a hidratação; recalcula os pontos de início e fim.
    ScrollTrigger.refresh();
    return () => {
      ctx.revert();
      visibility.disconnect();
    };
  }, [rootRef, enabled, setup, staticProgress]);
}