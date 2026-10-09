import { useEffect, type RefObject } from "react";
import { gsap } from "@/lib/gsap";

/** Deslocamento máximo, em px, do desenho inteiro em cada eixo. */
const REACH = { x: 14, y: 8 } as const;

/**
 * Faz a ilustração acompanhar de leve o ponteiro: um único `translate` 2D no elemento `<svg>`
 * (mexer camadas internas a cada movimento invalidava a pintura do SVG inteiro). O GSAP anima só um objeto
 * de posição e o estilo é escrito aqui: o `translate3d` que ele usaria promoveria o SVG a camada composta,
 * e com filhos animados o Chrome deixa essa camada rasterizada pela metade. Só em mouse.
 */
export function usePointerParallax(rootRef: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const root = rootRef.current;
    const target = root?.querySelector<SVGSVGElement>("[data-pointer-root]");
    if (!root || !target || !enabled) return;

    const pos = { x: 0, y: 0 };
    const apply = () => {
      target.style.transform = `translate(${pos.x.toFixed(2)}px, ${pos.y.toFixed(2)}px)`;
    };
    const tween = { duration: 0.9, ease: "power3.out", onUpdate: apply };
    const moveX = gsap.quickTo(pos, "x", tween);
    const moveY = gsap.quickTo(pos, "y", tween);
    const onMove = (event: PointerEvent) => {
      moveX(-(event.clientX / window.innerWidth - 0.5) * 2 * REACH.x);
      moveY(-(event.clientY / window.innerHeight - 0.5) * 2 * REACH.y);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      gsap.killTweensOf(pos);
      target.style.transform = "";
    };
  }, [rootRef, enabled]);
}
