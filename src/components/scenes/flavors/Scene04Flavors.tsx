"use client";

import { useRef, useState, type ComponentType } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Photo } from "@/components/ui/Photo";
import { SplitWords } from "@/components/ui/SplitWords";
import { PHOTOS, type PhotoId } from "@/config/photos";
import { PRODUCTS, type Product, type ProductId } from "@/config/products";
import { useEditorialMotion } from "@/hooks/useEditorialMotion";
import { CoffeeArt } from "./illustrations/Coffee";
import { BaguetteArt, SourdoughArt } from "./illustrations/Breads";
import { CinnamonRollArt, CroissantArt, PainAuChocolatArt } from "./illustrations/Pastries";
import { ProductDialog } from "./ProductDialog";
import { ProductStage } from "./ProductStage";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { useFlavorsScroll } from "./useFlavorsScroll";

/** Ilustrações próprias; produtos com fotografia (`product.photo`) usam a foto no lugar. */
const ART: Partial<Record<ProductId, ComponentType>> = {
  "pain-au-chocolat": PainAuChocolatArt,
  levain: SourdoughArt,
  "cinnamon-roll": CinnamonRollArt,
  cafe: CoffeeArt,
  baguette: BaguetteArt,
  croissant: CroissantArt,
};

const CLASSICS: ProductId[] = ["croissant", "pain-au-chocolat", "baguette", "levain", "cinnamon-roll", "cafe"];

interface Slot {
  slot: string;
  frame: string;
  speed: number;
}

/**
 * Composição editorial: cada produto tem seu próprio encaixe, proporção e velocidade de paralaxe.
 * `speed` é o deslocamento vertical (em % da altura) que o item percorre durante a rolagem.
 * Os produtos com fotografia usam a proporção real da imagem, para nada ser cortado.
 */
const LAYOUT: Record<ProductId, Slot> = {
  croissant: { slot: "lg:col-span-5 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:mt-24", frame: "aspect-[742/974]", speed: 6 },
  "pain-au-chocolat": { slot: "lg:col-span-4 lg:col-start-8 lg:row-start-1 max-lg:ml-auto max-lg:w-[88%]", frame: "aspect-[7/5]", speed: -6 },
  baguette: { slot: "lg:col-span-8 lg:col-start-3 lg:row-start-3", frame: "aspect-[57/22]", speed: 4 },
  levain: { slot: "lg:col-span-4 lg:col-start-1 lg:row-start-4 max-lg:w-[88%]", frame: "aspect-[7/5]", speed: -8 },
  "cinnamon-roll": { slot: "lg:col-span-4 lg:col-start-6 lg:row-start-4 lg:mt-24 max-lg:ml-auto max-lg:w-[88%]", frame: "aspect-[7/5]", speed: 6 },
  cafe: { slot: "lg:col-span-3 lg:col-start-10 lg:row-start-4 lg:-mt-6 max-lg:w-[80%]", frame: "aspect-[7/5]", speed: -4 },
  sonho: { slot: "lg:col-span-7 lg:col-start-1 lg:row-start-1", frame: "aspect-[1280/853]", speed: 5 },
  "gateau-chocolat": { slot: "lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1 lg:mt-28 max-lg:ml-auto max-lg:w-[78%]", frame: "aspect-[687/1031]", speed: -7 },
  "gateau-moelleux": { slot: "lg:col-span-6 lg:col-start-2 lg:row-start-3 max-lg:w-[92%]", frame: "aspect-[1280/853]", speed: 5 },
  biscuits: { slot: "lg:col-span-3 lg:col-start-9 lg:row-start-3 lg:mt-16 max-lg:ml-auto max-lg:w-[66%]", frame: "aspect-[706/1010]", speed: -5 },
  muffins: { slot: "lg:col-span-6 lg:col-start-1 lg:row-start-4 lg:mt-10", frame: "aspect-[1280/853]", speed: 6 },
  "burger-maison": { slot: "lg:col-span-7 lg:col-start-6 lg:row-start-5 lg:-mt-8 max-lg:ml-auto max-lg:w-[94%]", frame: "aspect-[1470/980]", speed: -4 },
};

/** Fotografia dentro do `ProductStage`: o ponteiro desloca e aproxima a imagem (variáveis `--px`, `--py`, `--v`). */
function PhotoArt({ id }: { id: PhotoId }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: PHOTOS[id].color }}>
      <div
        className="absolute -inset-[7%]"
        style={{ transform: "translate(calc(var(--px, 0) * -2.4%), calc(var(--py, 0) * -2.4%)) scale(calc(1 + var(--v, 0.5) * 0.07))" }}
      >
        <Photo id={id} sizes="(min-width: 1024px) 50vw, 90vw" />
      </div>
    </div>
  );
}

function ProductCard({ product, number, onOpen }: { product: Product; number: number; onOpen: (product: Product) => void }) {
  const Art = ART[product.id];
  const { slot, frame, speed } = LAYOUT[product.id];

  return (
    <article id={`item-${product.id}`} className={`relative ${slot}`} data-speed={speed} aria-labelledby={`produto-${product.id}`}>
      <span aria-hidden className="pointer-events-none absolute -top-6 left-0 z-10 font-display text-[clamp(4rem,9vw,8rem)] leading-none text-transparent [-webkit-text-stroke:1.5px_var(--color-caramel)] opacity-60">
        {String(number).padStart(2, "0")}
      </span>
      <div className={`relative ${frame}`} {...(product.photo ? { "data-reveal": "up" } : {})}>
        <div className="absolute inset-0" {...(product.photo ? { "data-reveal-img": "" } : {})}>
          <ProductStage product={product}>
            <div className="absolute inset-0">{product.photo ? <PhotoArt id={product.photo} /> : Art ? <Art /> : null}</div>
          </ProductStage>
        </div>
      </div>
      <div className="relative mt-3 max-w-[34ch]">
        <p className="font-hand text-xl text-crust-text" lang="fr">{product.french}</p>
        <h3 id={`produto-${product.id}`} className="font-display text-2xl text-chocolate sm:text-3xl">{product.name}</h3>
        <p className="mt-2 text-sm text-chocolate/75">{product.description}</p>
        <MagneticButton
          onClick={() => onOpen(product)}
          className="mt-4 rounded-full border border-chocolate/40 px-5 py-2 text-xs uppercase tracking-[0.2em] text-chocolate transition hover:bg-chocolate hover:text-cream"
        >
          Ver detalhes
        </MagneticButton>
      </div>
    </article>
  );
}

export function Scene04Flavors() {
  const rootRef = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const reduced = useReducedMotion();
  useFlavorsScroll(rootRef);
  useEditorialMotion(rootRef, !reduced);

  // As seis primeiras criações têm interação própria; a vitrine reúne as demais fotografias.
  const classics = PRODUCTS.filter((product) => CLASSICS.includes(product.id));
  const vitrine = PRODUCTS.filter((product) => !CLASSICS.includes(product.id));

  return (
    <section
      ref={rootRef}
      data-scene="flavors"
      aria-labelledby="sabores"
      className={`relative overflow-hidden bg-butter px-6 pb-40 pt-32 sm:px-12 lg:px-[6vw] ${reduced ? "" : "z-[4] -mt-[100svh] pt-[calc(100svh+8rem)]"}`}
    >
      <div aria-hidden className="pointer-events-none absolute -right-32 top-40 size-[34rem] rounded-full bg-olive/10" />
      <div aria-hidden className="pointer-events-none absolute -left-40 bottom-24 size-[28rem] rounded-full bg-caramel/10" />

      <header id="produtos" data-nav="produtos" className="relative max-w-3xl">
        <p className="font-hand text-3xl text-crust-text" lang="fr">L&apos;art de vivre, l&apos;art du pain.</p>
        <h2 id="sabores" data-ui="flavorsTitle" className="mt-3 font-display text-[clamp(2.6rem,7vw,6rem)] font-light leading-[0.98]" style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}>
          <SplitWords text="O universo dos sabores" />
        </h2>
        <p className="mt-5 max-w-[46ch] text-chocolate/75">
          Doze criações saídas do forno e da vitrine. Passe o ponteiro sobre cada uma, arraste com o dedo ou use as setas do teclado para explorar.
        </p>
      </header>

      <div className="relative mt-20 grid gap-y-24 lg:mt-12 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-14">
        {classics.map((product, index) => (
          <ProductCard key={product.id} product={product} number={index + 1} onOpen={setSelected} />
        ))}
      </div>

      <div className="relative mt-32 max-w-3xl lg:mt-44">
        <p className="font-hand text-3xl text-crust-text" lang="fr" data-rise>de la vitrine à la table</p>
        <h3 data-words className="mt-2 font-display text-[clamp(2.2rem,5.4vw,4.6rem)] font-light leading-[1]" style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}>
          <SplitWords text="La vitrine" />
        </h3>
        <p data-rise className="mt-4 max-w-[44ch] text-chocolate/75">Bolos, muffins, biscoitos e o que sai do balcão: fotografias reais da casa, uma a uma.</p>
      </div>
      <div className="relative mt-16 grid gap-y-24 lg:mt-12 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-16">
        {vitrine.map((product, index) => (
          <ProductCard key={product.id} product={product} number={classics.length + index + 1} onOpen={setSelected} />
        ))}
      </div>

      <ProductDialog product={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
