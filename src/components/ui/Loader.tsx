"use client";

import { useEffect, useRef, useState } from "react";
import { MIN_BAKE_MS } from "@/config/loading";
import { useCriticalAssets } from "@/hooks/useCriticalAssets";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { gsap } from "@/lib/gsap";
import { OvenIllustration, SPARK_COUNT } from "./OvenIllustration";

interface LoaderProps {
  /** Disparado quando o vapor cobre a tela: a primeira cena pode começar a se organizar por baixo. */
  onReveal: () => void;
  /** Disparado quando o loader já está invisível e pode ser desmontado. */
  onDone: () => void;
}

const select = (root: HTMLElement, name: string) => root.querySelectorAll<HTMLElement>(`[data-el="${name}"]`);

export function Loader({ onReveal, onDone }: LoaderProps) {
  const { progress: realProgress, failures } = useCriticalAssets();
  const reduced = useReducedMotion();
  const tier = useDeviceTier();
  const rootRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<gsap.Context | null>(null);
  const bake = useRef({ value: 0 });
  const finished = useRef(false);
  const [ready, setReady] = useState(false);

  const hasFailures = failures.length > 0;
  // Qualquer dispositivo limitado, preferência por menos movimento ou falha de recurso
  // recebe a versão simplificada: sem vapor, sem travessia de câmera.
  const cinematic = !reduced && tier === "high" && !hasFailures;

  useEffect(() => {
    const context = gsap.context(() => {}, rootRef);
    contextRef.current = context;
    return () => {
      context.revert();
      contextRef.current = null;
    };
  }, []);

  const applyBake = (value: number) => {
    const root = rootRef.current;
    if (!root) return;
    root.style.setProperty("--warm", value.toFixed(3));
    select(root, "glow").forEach((el) => (el.style.opacity = value.toFixed(3)));
    select(root, "golden").forEach((el) => (el.style.opacity = Math.max(0, (value - 0.15) / 0.85).toFixed(3)));
    select(root, "spark").forEach((el, index) => {
      el.style.opacity = value * SPARK_COUNT > index + 1 ? "1" : "0";
    });
    root.querySelector('[role="progressbar"]')?.setAttribute("aria-valuenow", String(Math.round(value * 100)));
  };

  const finish = (instant: boolean) => {
    if (finished.current) return;
    finished.current = true;
    contextRef.current?.add(() => {
      const root = rootRef.current;
      if (!root) return;
      setReady(true);
      const timeline = gsap.timeline({ onComplete: onDone });

      if (instant) {
        onReveal();
        timeline.to(root, { opacity: 0, duration: 0.25 });
        return;
      }

      timeline.to(select(root, "label"), { opacity: 0, y: -8, duration: 0.3 }, 0);
      timeline.to(select(root, "door"), { scaleX: 0.08, svgOrigin: "122 290", duration: 1, ease: "power2.inOut" }, 0.1);
      timeline.fromTo(select(root, "ready-text"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8 }, 0.5);

      if (cinematic) {
        timeline.fromTo(
          select(root, "steam-puff"),
          { scale: 0.2, opacity: 0, transformOrigin: "50% 50%" },
          { scale: 1.6, opacity: 0.9, duration: 1.4, stagger: 0.12, ease: "power1.out" },
          0.7,
        );
        timeline.to(select(root, "stage"), { scale: 9, duration: 1.5, ease: "power3.in" }, 1.7);
        timeline.to(select(root, "veil"), { opacity: 1, duration: 0.9, ease: "power1.in" }, 2.2);
        timeline.add(onReveal, 3.1);
        timeline.to(root, { opacity: 0, duration: 0.9, ease: "power1.out" }, 3.2);
      } else {
        timeline.add(onReveal, 1.5);
        timeline.to(root, { opacity: 0, duration: 0.6 }, 1.6);
      }
    });
  };

  useEffect(() => {
    // Reduced motion: sem animação de cozimento, apenas confirma e revela.
    if (reduced) {
      if (realProgress >= 1) finish(false);
      return;
    }
    contextRef.current?.add(() => {
      const remaining = realProgress - bake.current.value;
      if (remaining <= 0) return;
      gsap.to(bake.current, {
        value: realProgress,
        duration: Math.max(0.5, (remaining * MIN_BAKE_MS) / 1000),
        ease: "none",
        overwrite: true,
        onUpdate: () => applyBake(bake.current.value),
        onComplete: () => {
          if (bake.current.value >= 1) finish(false);
        },
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reage só ao progresso real; helpers usam refs.
  }, [realProgress, reduced]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        ["--warm" as string]: 0,
        background: "color-mix(in srgb, var(--color-gold) calc(var(--warm) * 38%), var(--color-butter))",
      }}
      role="status"
      aria-live="polite"
    >
      <div data-el="stage" className="w-[min(78vw,420px)]" style={{ transformOrigin: "50% 60%" }}>
        <OvenIllustration />
      </div>

      <div className="relative mt-2 h-20 text-center">
        <p data-el="label" className="font-sans text-xs uppercase tracking-[0.32em] text-chocolate/70">
          {hasFailures ? "Alguns recursos não carregaram — seguimos com a versão simplificada" : "Aquecendo o forno"}
          <span role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0} className="sr-only">
            Carregando
          </span>
        </p>
        <div data-el="ready-text" className="absolute inset-x-0 top-0 opacity-0" aria-hidden={!ready}>
          <p className="font-display text-3xl italic text-chocolate sm:text-4xl" lang="fr">
            « La magie est prête. »
          </p>
          <p className="mt-1 font-hand text-xl text-crust-text">A magia está pronta.</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => finish(true)}
        className="absolute bottom-6 rounded-full border border-chocolate/30 px-4 py-2 text-xs uppercase tracking-[0.2em] text-chocolate/70 transition hover:border-chocolate hover:text-chocolate"
      >
        Pular introdução
      </button>

      <div data-el="veil" className="pointer-events-none absolute inset-0 bg-cream opacity-0" aria-hidden />
    </div>
  );
}
