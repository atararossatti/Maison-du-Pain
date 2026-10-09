import { useCallback, type RefObject } from "react";
import { useScrubbedScene } from "@/hooks/useScrubbedScene";
import { computeCroissantFrame } from "./camera";

/** Progresso exibido com movimento reduzido: croissant assado, camadas parcialmente abertas. */
const STATIC_PROGRESS = 0.75;

/** O furo da máscara cresce além de 100% para o véu de massa sumir por completo nos cantos. */
const WASH_HOLE_MAX = 140;

const showCaption = (el: HTMLElement | null, value: number) => {
  if (!el) return;
  el.style.opacity = value.toFixed(3);
  el.style.transform = `translate3d(0, ${((1 - value) * 24).toFixed(1)}px, 0)`;
};

/**
 * Escreve o progresso numa ref (lida pelo laço do R3F) e atualiza a máscara de massa e as legendas.
 * O WebGL nunca depende de estado React: rolar não provoca re-renders.
 */
export function useCroissantTimeline(
  rootRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  progressRef: RefObject<number>,
) {
  const setup = useCallback(
    (root: HTMLElement) => {
      const wash = root.querySelector<HTMLElement>("[data-ui='doughWash']");
      const captionA = root.querySelector<HTMLElement>("[data-ui='captionA']");
      const captionB = root.querySelector<HTMLElement>("[data-ui='captionB']");
      const stage = root.querySelector<HTMLElement>("[data-ui='stage']");
      const isStatic = root.dataset.static === "true";

      return (progress: number) => {
        progressRef.current = progress;
        const frame = computeCroissantFrame(progress);
        wash?.style.setProperty("--hole", (frame.reveal * WASH_HOLE_MAX).toFixed(1));
        if (wash) wash.style.visibility = frame.reveal >= 1 ? "hidden" : "visible";
        root.style.setProperty("--edge", (1 - frame.exit).toFixed(3));
        if (stage) stage.style.opacity = (1 - frame.exit).toFixed(3);
        if (isStatic) return;
        showCaption(captionA, frame.captionA);
        showCaption(captionB, frame.captionB);
      };
    },
    [progressRef],
  );

  useScrubbedScene(rootRef, { enabled, setup, staticProgress: STATIC_PROGRESS });
}
