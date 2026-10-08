import { useCallback, type RefObject } from "react";
import { BOWL, EAR_CENTER, GRAIN_COUNT, HOPPER, PROCESS_SCREENS } from "@/config/process";
import { useScrubbedScene } from "@/hooks/useScrubbedScene";
import { computeProcessFrame } from "./camera";
import { STREAM_GEOMETRY } from "./layers/Kitchen";

/** Progresso estático com movimento reduzido: massa fermentando, com o relógio e a segunda frase. */
const STATIC_PROGRESS = 0.7;
/** Quanto a porta do forno sobe para liberar a boca (unidades do viewBox). */
const DOOR_TRAVEL = 150;
const MILL_ORBIT = { x: 150, y: 28, centerY: 376 };

const q = (root: HTMLElement, name: string) => root.querySelector<SVGElement>(`[data-el="${name}"]`);
const fixed = (value: number) => value.toFixed(3);

const setupProcess = (root: HTMLElement) => {
  const el = {
    field: q(root, "field"),
    kitchen: q(root, "kitchen"),
    ear: q(root, "ear"),
    grains: Array.from({ length: GRAIN_COUNT }, (_, i) => q(root, `grain-${i}`)),
    mill: q(root, "mill"),
    handle: q(root, "handle"),
    stream: q(root, "stream"),
    pile: q(root, "pile"),
    drops: [0, 1, 2].map((i) => q(root, `drop-${i}`)),
    dough: q(root, "dough"),
    bubbles: q(root, "bubbles"),
    clock: q(root, "clock"),
    hand: q(root, "clockHand"),
    oven: q(root, "oven"),
    door: q(root, "door"),
    glow: q(root, "glow"),
    bread: q(root, "bread"),
    bowl: q(root, "bowl"),
    bowlFront: q(root, "bowlFront"),
  };
  const stageItems = Array.from(root.querySelectorAll<HTMLElement>("[data-stage]"));
  const captions = {
    a: root.querySelector<HTMLElement>("[data-ui='captionA']"),
    b: root.querySelector<HTMLElement>("[data-ui='captionB']"),
  };
  const isStatic = root.dataset.static === "true";
  let lastStage = -1;

  const showCaption = (node: HTMLElement | null, value: number) => {
    if (!node) return;
    node.style.opacity = fixed(value);
    node.style.transform = `translate3d(0, ${((1 - value) * 24).toFixed(1)}px, 0)`;
  };

  return (progress: number) => {
    const frame = computeProcessFrame(progress);

    el.field?.setAttribute("transform", `translate(${EAR_CENTER.x} ${EAR_CENTER.y}) scale(${frame.fieldZoom.toFixed(4)}) translate(${-EAR_CENTER.x} ${-EAR_CENTER.y})`);
    el.field?.style.setProperty("opacity", fixed(frame.fieldOpacity));
    el.kitchen?.style.setProperty("opacity", fixed(frame.kitchen));
    el.ear?.style.setProperty("opacity", fixed(frame.ear));

    el.grains.forEach((grain, index) => {
      const state = frame.grains[index];
      if (!grain || !state) return;
      grain.setAttribute("transform", `translate(${state.x.toFixed(1)} ${state.y.toFixed(1)}) rotate(${state.rotate.toFixed(1)}) scale(${state.scale.toFixed(3)})`);
      grain.style.opacity = fixed(state.opacity);
    });

    el.mill?.style.setProperty("opacity", fixed(frame.mill.opacity));
    const orbit = frame.mill.handle;
    el.handle?.setAttribute("transform", `translate(${(HOPPER.x + MILL_ORBIT.x * Math.cos(orbit)).toFixed(1)} ${(MILL_ORBIT.centerY + MILL_ORBIT.y * Math.sin(orbit)).toFixed(1)})`);

    const fall = STREAM_GEOMETRY.bottom - STREAM_GEOMETRY.top;
    el.stream?.setAttribute("y", (STREAM_GEOMETRY.top + fall * frame.stream.from).toFixed(1));
    el.stream?.setAttribute("height", Math.max(0, fall * (frame.stream.to - frame.stream.from)).toFixed(1));
    el.pile?.setAttribute("transform", `translate(${BOWL.x} ${BOWL.y + 4}) scale(${frame.pile.scale.toFixed(3)})`);
    el.pile?.style.setProperty("opacity", fixed(frame.pile.opacity));
    el.drops.forEach((drop, index) => {
      const state = frame.drops[index];
      if (!drop || !state) return;
      drop.setAttribute("transform", `translate(${BOWL.x - 40 + index * 40} ${(BOWL.y - 150 + state.y * 1.7).toFixed(1)})`);
      drop.style.opacity = fixed(state.opacity);
    });

    el.bowl?.style.setProperty("opacity", fixed(frame.bowl));
    el.bowlFront?.style.setProperty("opacity", fixed(frame.bowl));
    el.dough?.setAttribute("transform", `translate(${frame.dough.x.toFixed(1)} ${frame.dough.y.toFixed(1)}) scale(${frame.dough.scale.toFixed(4)} ${(frame.dough.scale * frame.dough.squash).toFixed(4)})`);
    el.dough?.style.setProperty("opacity", fixed(frame.dough.opacity));
    el.bubbles?.style.setProperty("opacity", fixed(frame.bubbles.opacity * (0.55 + 0.45 * frame.bubbles.pulse)));

    el.clock?.style.setProperty("opacity", fixed(frame.clock.opacity));
    el.hand?.setAttribute("transform", `rotate(${frame.clock.angle.toFixed(1)})`);

    el.oven?.setAttribute("transform", `translate(${frame.oven.x.toFixed(1)} 0)`);
    el.oven?.style.setProperty("opacity", fixed(frame.oven.opacity));
    el.door?.setAttribute("transform", `translate(0 ${(-DOOR_TRAVEL * frame.oven.door).toFixed(1)})`);
    el.glow?.style.setProperty("opacity", fixed(frame.oven.glow));
    el.bread?.setAttribute("transform", `translate(${frame.bread.x.toFixed(1)} ${frame.bread.y.toFixed(1)}) scale(${frame.bread.scale.toFixed(3)})`);
    el.bread?.style.setProperty("opacity", fixed(frame.bread.opacity));

    if (frame.stageIndex !== lastStage) {
      lastStage = frame.stageIndex;
      stageItems.forEach((item, index) => {
        item.dataset.active = String(index === frame.stageIndex);
        if (index === frame.stageIndex) item.setAttribute("aria-current", "step");
        else item.removeAttribute("aria-current");
      });
    }
    if (isStatic) return;
    showCaption(captions.a, frame.captionA);
    showCaption(captions.b, frame.captionB);
  };
};

/** Liga o scroll à Cena 05: do campo de trigo ao pão saindo do forno. */
export function useProcessTimeline(rootRef: RefObject<HTMLElement | null>, enabled: boolean) {
  const setup = useCallback((root: HTMLElement) => setupProcess(root), []);
  useScrubbedScene(rootRef, { enabled, screens: PROCESS_SCREENS, setup, staticProgress: STATIC_PROGRESS });
}