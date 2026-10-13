"use client";

import { useEffect, useRef, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import type { Product } from "@/config/products";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { gsap } from "@/lib/gsap";
import { clamp } from "@/lib/math";

const KEY_STEP = 0.1;

interface Pose {
  /** Posição horizontal normalizada (0–1): eixo principal de cada interação. */
  v: number;
  /** Posição do ponteiro de −1 a 1, para movimentos que reagem nos dois eixos. */
  px: number;
  py: number;
}

/**
 * Superfície interativa de um produto. Expõe a pose como variáveis CSS (`--v`, `--px`, `--py`)
 * e cada ilustração decide como reagir a elas, sem re-render do React.
 * É também um slider acessível: setas do teclado e arrastar no toque movem o mesmo valor do mouse.
 */
export function ProductStage({ product, children }: { product: Product; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const pose = useRef<Pose>({ v: product.rest, px: 0, py: 0 });
  const target = useRef<Pose>({ v: product.rest, px: 0, py: 0 });

  const paint = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--v", pose.current.v.toFixed(3));
    el.style.setProperty("--px", pose.current.px.toFixed(3));
    el.style.setProperty("--py", pose.current.py.toFixed(3));
    el.setAttribute("aria-valuenow", String(Math.round(pose.current.v * 100)));
  };

  const moveTo = (next: Pose) => {
    target.current = next;
    if (reduced) {
      pose.current = { ...next };
      paint();
      return;
    }
    gsap.to(pose.current, { ...next, duration: 0.7, ease: "power3.out", overwrite: true, onUpdate: paint });
  };

  useEffect(() => {
    paint();
    const current = pose.current;
    return () => {
      gsap.killTweensOf(current);
    };
  }, []);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const nx = clamp((event.clientX - rect.left) / rect.width);
    const ny = clamp((event.clientY - rect.top) / rect.height);
    moveTo({ v: nx, px: nx * 2 - 1, py: ny * 2 - 1 });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const { v, py } = target.current;
    const keys: Record<string, number> = { ArrowRight: KEY_STEP, ArrowUp: KEY_STEP, ArrowLeft: -KEY_STEP, ArrowDown: -KEY_STEP };
    let next: number | undefined;
    if (event.key in keys) next = clamp(v + (keys[event.key] ?? 0));
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = 1;
    if (next === undefined) return;
    event.preventDefault();
    moveTo({ v: next, px: next * 2 - 1, py });
  };

  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label={product.interaction}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(product.rest * 100)}
      onPointerMove={onPointerMove}
      onPointerLeave={() => moveTo({ v: product.rest, px: 0, py: 0 })}
      onKeyDown={onKeyDown}
      className="product-stage"
      style={{ touchAction: "pan-y" }}
    >
      {children}
    </div>
  );
}