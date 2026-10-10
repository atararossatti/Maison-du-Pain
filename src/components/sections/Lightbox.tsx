"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { PHOTOS, type PhotoId } from "@/config/photos";
import { gsap } from "@/lib/gsap";

interface LightboxProps {
  items: readonly PhotoId[];
  /** Índice aberto; `null` = fechado. */
  index: number | null;
  /** Retângulo da miniatura clicada: a foto cresce a partir dele. */
  origin: DOMRect | null;
  onIndex: (index: number) => void;
  onClose: () => void;
}

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Visualização ampliada: `<dialog>` modal (foco preso, Esc fecha), setas do teclado, botões e gesto de arrastar. */
export function Lightbox({ items, index, origin, onIndex, onClose }: LightboxProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const figure = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number } | null>(null);
  const opened = useRef(false);
  const open = index !== null;

  const step = useCallback(
    (delta: number) => {
      if (index === null) return;
      onIndex((index + delta + items.length) % items.length);
    },
    [index, items.length, onIndex],
  );

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      opened.current = false;
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Entrada: a foto cresce da miniatura (FLIP). Troca de foto: desliza e aparece.
  useEffect(() => {
    const el = figure.current;
    if (index === null || !el) return;
    if (!opened.current) {
      opened.current = true;
      if (origin && !prefersReducedMotion()) {
        const to = el.getBoundingClientRect();
        gsap.fromTo(
          el,
          { x: origin.left + origin.width / 2 - (to.left + to.width / 2), y: origin.top + origin.height / 2 - (to.top + to.height / 2), scale: origin.width / to.width, opacity: 0.4 },
          { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.75, ease: "expo.out", clearProps: "transform,opacity" },
        );
        gsap.fromTo(ref.current, { backgroundColor: "rgba(46,29,22,0)" }, { backgroundColor: "rgba(46,29,22,0.96)", duration: 0.6, clearProps: "backgroundColor" });
      }
      return;
    }
    if (!prefersReducedMotion()) gsap.fromTo(el, { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, ease: "power3.out", clearProps: "transform,opacity" });
  }, [index, origin]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, step]);

  const photo = index === null ? null : PHOTOS[items[index] ?? items[0]!];

  return (
    <dialog
      ref={ref}
      aria-label="Galeria ampliada"
      onClose={onClose}
      onClick={(event) => event.target === event.currentTarget && onClose()}
      className="m-0 h-svh max-h-none w-screen max-w-none bg-ink p-0 text-cream backdrop:bg-transparent"
    >
      {photo && index !== null && (
        <div
          className="relative grid h-svh w-screen select-none grid-rows-[auto_1fr_auto] px-4 py-4 sm:px-10"
          onPointerDown={(event) => (drag.current = { x: event.clientX })}
          onPointerUp={(event) => {
            const start = drag.current;
            drag.current = null;
            if (start && Math.abs(event.clientX - start.x) > 60) step(event.clientX < start.x ? 1 : -1);
          }}
          style={{ touchAction: "pan-y" }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs tabular-nums tracking-[0.25em] text-cream/70" aria-live="polite">
              {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </p>
            <button type="button" onClick={onClose} aria-label="Fechar galeria" className="grid size-11 place-items-center rounded-full border border-cream/40 transition hover:bg-cream hover:text-ink">
              <svg viewBox="0 0 20 20" className="size-5" aria-hidden><path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          </div>

          <div className="relative flex min-h-0 items-center justify-center">
            <div ref={figure} className="relative max-h-full">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(min-width: 1024px) 70vw, 94vw"
                placeholder="blur"
                blurDataURL={photo.blur}
                priority
                draggable={false}
                className="max-h-[calc(100svh-11rem)] w-auto max-w-[94vw] object-contain sm:max-w-[min(88vw,1100px)]"
              />
            </div>
            <button type="button" onClick={() => step(-1)} aria-label="Foto anterior" className="absolute left-0 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-cream/40 bg-ink/40 transition hover:bg-cream hover:text-ink">
              <svg viewBox="0 0 20 20" className="size-5" aria-hidden><path d="M12.5 4L6.5 10l6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button type="button" onClick={() => step(1)} aria-label="Próxima foto" className="absolute right-0 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-cream/40 bg-ink/40 transition hover:bg-cream hover:text-ink">
              <svg viewBox="0 0 20 20" className="size-5" aria-hidden><path d="M7.5 4l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>

          <div className="pt-3 text-center">
            <p className="font-hand text-2xl text-gold" lang="fr">{photo.caption}</p>
            <p className="mx-auto max-w-[60ch] text-xs text-cream/65">{photo.alt}</p>
          </div>
        </div>
      )}
    </dialog>
  );
}
