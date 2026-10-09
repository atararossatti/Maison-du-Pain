"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useMediaQuery";

interface LazySceneProps {
  /** Nome da cena, usado por testes e leitores de tela. */
  name: string;
  title: string;
  /** Altura reservada (classes Tailwind de `min-h`): igual à da cena montada, para o scroll não mudar. */
  reserve: string;
  /** Altura da cena montada com movimento reduzido (sem pin); padrão: a mesma de `reserve`. */
  reserveReduced?: string;
  children: ReactNode;
}

/**
 * Monta uma cena só quando ela se aproxima da tela (4 viewports de antecedência, para a pintura inicial acontecer antes de ser vista). As cenas abaixo da dobra deixam de entrar no
 * HTML inicial e na hidratação (o gargalo de Total Blocking Time medido no Lighthouse), mas o
 * placeholder ocupa a mesma altura, então a barra de scroll e as posições dos pins não mudam.
 * O título fica em texto oculto para a navegação por títulos de leitores de tela.
 */
export function LazyScene({ name, title, reserve, reserveReduced = reserve, children }: LazySceneProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (mounted || !el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setMounted(true);
      },
      { rootMargin: "400% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted]);

  if (mounted) return <>{children}</>;
  return (
    <div ref={ref} data-lazy={name} className={`bg-butter ${reduced ? reserveReduced : reserve}`}>
      <h2 className="sr-only">{title}</h2>
    </div>
  );
}