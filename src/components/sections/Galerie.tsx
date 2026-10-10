"use client";

import { useRef, useState } from "react";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { SplitWords } from "@/components/ui/SplitWords";
import { PHOTOS, type PhotoId } from "@/config/photos";
import { useEditorialMotion } from "@/hooks/useEditorialMotion";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { Lightbox } from "./Lightbox";

/** Ordem da visualização ampliada: a mesma em que as fotografias aparecem na página. */
const ORDER: readonly PhotoId[] = ["croissants", "sonho", "biscuits", "vitrine", "gateau-chocolat", "gateau-moelleux", "burger-maison", "muffins", "burger-rustique", "pains"];

interface PieceProps {
  id: PhotoId;
  className: string;
  sizes: string;
  reveal?: "up" | "down" | "left" | "right" | "iris";
  drift?: number;
  align?: "left" | "right";
  onOpen: (id: PhotoId, rect: DOMRect) => void;
}

function Piece({ id, className, sizes, reveal = "up", drift = 7, align = "left", onOpen }: PieceProps) {
  const photo = PHOTOS[id];
  return (
    <figure className={className}>
      <button
        type="button"
        aria-label={`Ampliar fotografia: ${photo.caption}`}
        onClick={(event) => onOpen(id, event.currentTarget.getBoundingClientRect())}
        className="group relative block w-full cursor-zoom-in overflow-hidden text-left"
      >
        <PhotoFrame id={id} reveal={reveal} drift={drift} sizes={sizes} alt={photo.alt} className="[&_img]:transition-transform [&_img]:duration-700 [&_img]:ease-out group-hover:[&_img]:scale-[1.05]" />
        <span aria-hidden className="pointer-events-none absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-cream/90 text-chocolate opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <svg viewBox="0 0 16 16" className="size-4"><path d="M9 2h5v5M7 14H2V9M14 2L9 7M2 14l5-5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
        </span>
      </button>
      <figcaption className={`mt-2 font-hand text-xl text-crust-text ${align === "right" ? "text-right" : ""}`} lang="fr">{photo.caption}</figcaption>
    </figure>
  );
}

/** Galerie: composição assimétrica com todas as fotografias, máscaras de revelação, paralaxe e visualização ampliada. */
export function Galerie() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [open, setOpen] = useState<{ index: number; rect: DOMRect | null } | null>(null);
  useEditorialMotion(rootRef, !reduced);

  const openPiece = (id: PhotoId, rect: DOMRect) => setOpen({ index: ORDER.indexOf(id), rect });
  const common = { onOpen: openPiece };

  return (
    <section
      ref={rootRef}
      id="galerie"
      data-nav="galerie"
      aria-labelledby="galerie-titulo"
      // Sobe por cima do último quadro (dourado) da cena do processo e termina dourado, cor em que a cena final começa.
      className={`relative z-[5] bg-butter ${reduced ? "pt-24" : "-mt-[100svh]"}`}
    >
      <header className={`relative grid place-items-center px-6 text-center ${reduced ? "pb-16" : "min-h-svh bg-gradient-to-b from-gold via-gold to-butter"}`}>
        <div>
          <p className="font-hand text-3xl text-chocolate/80" lang="fr" data-rise>la galerie</p>
          <h2 id="galerie-titulo" data-words className="mt-1 font-display text-[clamp(3.4rem,11vw,10rem)] font-light leading-[0.92] tracking-tight" style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}>
            <SplitWords text="Galerie" />
          </h2>
          <p data-rise className="mx-auto mt-5 max-w-[40ch] text-chocolate/80">Dez fotografias da casa. Toque ou clique em qualquer uma para vê-la em tela cheia.</p>
        </div>
      </header>

      <div className="relative px-6 pb-10 sm:px-12 lg:px-[6vw]">
        <div className="grid items-start gap-y-14 lg:grid-cols-12 lg:gap-x-8">
          <Piece id="croissants" className="max-lg:w-[78%] lg:col-span-4 lg:col-start-1" sizes="(min-width: 1024px) 32vw, 78vw" reveal="up" {...common} />
          <Piece id="sonho" className="lg:col-span-7 lg:col-start-6 lg:mt-40" sizes="(min-width: 1024px) 56vw, 94vw" reveal="left" drift={9} align="right" {...common} />
        </div>

        <div className="mt-16 grid items-start gap-y-14 lg:mt-12 lg:grid-cols-12 lg:gap-x-8">
          <Piece id="biscuits" className="max-lg:ml-auto max-lg:w-[64%] lg:col-span-3 lg:col-start-2" sizes="(min-width: 1024px) 24vw, 64vw" reveal="down" {...common} />
          <Piece id="vitrine" className="max-lg:w-[68%] lg:col-span-3 lg:col-start-6 lg:mt-24" sizes="(min-width: 1024px) 24vw, 68vw" reveal="up" {...common} />
          <Piece id="gateau-chocolat" className="max-lg:ml-auto max-lg:w-[72%] lg:col-span-3 lg:col-start-10 lg:mt-8" sizes="(min-width: 1024px) 24vw, 72vw" reveal="right" {...common} />
        </div>

        <div className="mt-20 grid items-start lg:mt-28 lg:grid-cols-12 lg:gap-x-8">
          <Piece id="gateau-moelleux" className="lg:col-span-8 lg:col-start-3" sizes="(min-width: 1024px) 64vw, 94vw" reveal="iris" drift={10} {...common} />
        </div>
      </div>

      <figure className="relative mt-16 lg:mt-28">
        <button
          type="button"
          aria-label={`Ampliar fotografia: ${PHOTOS["burger-maison"].caption}`}
          onClick={(event) => openPiece("burger-maison", event.currentTarget.getBoundingClientRect())}
          className="group relative block w-full cursor-zoom-in text-left"
        >
          <PhotoFrame id="burger-maison" reveal="iris" drift={12} ratio={false} sizes="100vw" alt={PHOTOS["burger-maison"].alt} className="h-[78svh] w-full" />
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/20" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 px-6 pb-10 text-cream sm:px-12 lg:px-[6vw]">
            <p className="font-hand text-3xl text-gold" lang="fr">{PHOTOS["burger-maison"].caption}</p>
            <p className="max-w-[24ch] font-display text-[clamp(1.8rem,4vw,3.4rem)] font-light italic leading-tight">Du pain, du beurre, de la patience.</p>
          </div>
        </button>
      </figure>

      <div className="relative px-6 pt-16 sm:px-12 lg:px-[6vw] lg:pt-28">
        <div className="grid items-start gap-y-14 lg:grid-cols-12 lg:gap-x-8">
          <Piece id="muffins" className="lg:col-span-7 lg:col-start-1" sizes="(min-width: 1024px) 56vw, 94vw" reveal="right" drift={9} {...common} />
          <Piece id="burger-rustique" className="max-lg:ml-auto max-lg:w-[68%] lg:col-span-3 lg:col-start-9 lg:mt-36" sizes="(min-width: 1024px) 24vw, 68vw" reveal="up" align="right" {...common} />
        </div>
        <div className="mt-16 grid items-start gap-y-10 lg:mt-24 lg:grid-cols-12 lg:gap-x-8">
          <Piece id="pains" className="max-lg:w-[80%] lg:col-span-4 lg:col-start-3" sizes="(min-width: 1024px) 32vw, 80vw" reveal="down" {...common} />
          <p data-rise className="max-w-[26ch] font-display text-[clamp(1.6rem,3vw,2.6rem)] font-light italic leading-tight text-chocolate/85 lg:col-span-4 lg:col-start-8 lg:mt-24">
            Cada imagem é uma fornada: feita com calma, servida quente.
          </p>
        </div>
      </div>

      <div className={`relative mt-24 grid place-items-start justify-center px-6 text-center ${reduced ? "pb-24" : "min-h-svh bg-gradient-to-b from-butter via-butter/60 to-gold pt-[18svh]"}`}>
        <p className="font-hand text-3xl text-chocolate/80" lang="fr">À bientôt.</p>
      </div>

      <Lightbox
        items={ORDER}
        index={open?.index ?? null}
        origin={open?.rect ?? null}
        onIndex={(index) => setOpen((current) => (current ? { ...current, index } : current))}
        onClose={() => setOpen(null)}
      />
    </section>
  );
}
