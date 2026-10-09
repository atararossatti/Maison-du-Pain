import { type RefObject } from "react";
import { BAKERY_LAYER_IDS, DOUGH_CENTER, INGREDIENTS } from "@/config/bakery";
import { useScrubbedScene } from "@/hooks/useScrubbedScene";
import { computeBakeryFrame, scaleAbout } from "./camera";
import { SACK_X, STREAM } from "./layers/Main";

/** Progresso exibido quando há movimento reduzido: massa formada, sova em andamento. */
const STATIC_PROGRESS = 0.62;

const query = (root: HTMLElement, name: string) => root.querySelector<SVGElement>(`[data-el="${name}"]`);

/** Localiza os elementos uma única vez; o quadro seguinte só escreve atributos. */
function setupBakery(root: HTMLElement) {
  const layers = BAKERY_LAYER_IDS.map((id) => ({ id, el: root.querySelector(`[data-layer="${id}"]`) }));
  const sack = query(root, "sack");
  const stream = query(root, "stream");
  const dust = query(root, "dust");
  const pile = query(root, "pile");
  const dough = query(root, "dough");
  const head = query(root, "head");
  const arms = query(root, "arms");
  const armL = query(root, "armL");
  const armR = query(root, "armR");
  const ingredients = INGREDIENTS.map((item) => query(root, `ingredient-${item.id}`));
  const wash = root.querySelector<HTMLElement>("[data-ui='wash']");
  const captions = {
    a: root.querySelector<HTMLElement>("[data-ui='captionA']"),
    b: root.querySelector<HTMLElement>("[data-ui='captionB']"),
  };

  const showCaption = (el: HTMLElement | null, value: number) => {
    if (!el) return;
    el.style.opacity = value.toFixed(3);
    el.style.transform = `translate3d(0, ${((1 - value) * 24).toFixed(1)}px, 0)`;
  };

  return (progress: number) => {
    const frame = computeBakeryFrame(progress);

    layers.forEach(({ id, el }) => el?.setAttribute("transform", scaleAbout(frame.layerScale[id])));
    // `wash` vai de 1 (cobre a tela) a 0; a íris é o furo transparente que cresce de 0 a 140%.
    if (wash) wash.style.setProperty("--hole", ((1 - frame.wash) * 140).toFixed(1));

    sack?.setAttribute("transform", `translate(0 ${frame.sack.y.toFixed(1)}) rotate(${frame.sack.tilt.toFixed(2)} ${SACK_X} 200)`);
    sack?.style.setProperty("opacity", frame.sack.opacity.toFixed(3));

    const fall = STREAM.bottom - STREAM.top;
    const top = STREAM.top + fall * frame.stream.from;
    stream?.setAttribute("y", top.toFixed(1));
    stream?.setAttribute("height", Math.max(0, fall * (frame.stream.to - frame.stream.from)).toFixed(1));
    dust?.style.setProperty("opacity", (frame.stream.to * (1 - frame.stream.from)).toFixed(3));

    pile?.setAttribute("transform", `translate(${DOUGH_CENTER.x} ${DOUGH_CENTER.y}) scale(${frame.pile.scale.toFixed(3)})`);
    pile?.style.setProperty("opacity", frame.pile.opacity.toFixed(3));

    ingredients.forEach((el, index) => {
      const state = frame.ingredients[index];
      if (!el || !state) return;
      el.setAttribute("transform", `translate(${state.x.toFixed(1)} ${state.y.toFixed(1)}) scale(${state.scale.toFixed(3)})`);
      el.style.opacity = state.opacity.toFixed(3);
    });

    dough?.setAttribute(
      "transform",
      `translate(${DOUGH_CENTER.x} ${DOUGH_CENTER.y}) scale(${frame.dough.scale.toFixed(4)} ${(frame.dough.scale * frame.dough.squash).toFixed(4)})`,
    );
    dough?.style.setProperty("opacity", frame.dough.opacity.toFixed(3));

    armL?.setAttribute("transform", `rotate(${frame.arms.left.angle.toFixed(2)}) scale(1 ${frame.arms.left.length.toFixed(3)})`);
    armR?.setAttribute("transform", `rotate(${frame.arms.right.angle.toFixed(2)}) scale(1 ${frame.arms.right.length.toFixed(3)})`);
    arms?.style.setProperty("opacity", frame.arms.opacity.toFixed(3));
    head?.setAttribute("transform", `translate(0 ${frame.headBob.toFixed(2)})`);

    showCaption(captions.a, frame.captionA);
    showCaption(captions.b, frame.captionB);
  };
}

/** Liga o scroll à Cena 02: farinha, ingredientes, sova, crescimento e mergulho na massa. */
export function useBakeryTimeline(rootRef: RefObject<HTMLElement | null>, enabled: boolean) {
  useScrubbedScene(rootRef, { enabled, setup: setupBakery, staticProgress: STATIC_PROGRESS });
}
