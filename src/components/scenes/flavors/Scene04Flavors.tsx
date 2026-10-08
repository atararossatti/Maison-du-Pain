"use client";

import { useRef, useState, type ComponentType } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SplitWords } from "@/components/ui/SplitWords";
import { PRODUCTS, type Product, type ProductId } from "@/config/products";
import { CoffeeArt } from "./illustrations/Coffee";
import { BaguetteArt, SourdoughArt } from "./illustrations/Breads";
import { CinnamonRollArt, CroissantArt, PainAuChocolatArt } from "./illustrations/Pastries";
import { ProductDialog } from "./ProductDialog";
import { ProductStage } from "./ProductStage";
import { useFlavorsScroll } from "./useFlavorsScroll";

const ART: Record<ProductId, ComponentType> = {
  croissant: CroissantArt,
  "pain-au-chocolat": PainAuChocolatArt,
  baguette: BaguetteArt,
  levain: SourdoughArt,
  "cinnamon-roll": CinnamonRollArt,
  cafe: CoffeeArt,
};

/**
 * Composição editorial: cada produto tem seu próprio encaixe, proporção e velocidade de paralaxe.
 * `speed` é o deslocamento vertical (em % da altura) que o item percorre durante a rolagem.
 */
const LAYOUT: Record<ProductId, { slot: string; frame: string; speed: number }> = {
  croissant: { slot: "lg:col-span-6 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:mt-28", frame: "aspect-[7/5]", speed: 7 },
  "pain-au-chocolat": { slot: "lg:col-span-4 lg:col-start-8 lg:row-start-1 max-lg:ml-auto max-lg:w-[88%]", frame: "aspect-[7/5]", speed: -6 },
  baguette: { slot: "lg:col-span-8 lg:col-start-3 lg:row-start-3", frame: "aspect-[57/22]", speed: 4 },
  levain: { slot: "lg:col-span-4 lg:col-start-1 lg:row-start-4 max-lg:w-[88%]", frame: "aspect-[7/5]", speed: -8 },
  "cinnamon-roll": { slot: "lg:col-span-4 lg:col-start-6 lg:row-start-4 lg:mt-24 max-lg:ml-auto max-lg:w-[88%]", frame: "aspect-[7/5]", speed: 6 },
  cafe: { slot: "lg:col-span-3 lg:col-start-10 lg:row-start-4 lg:-mt-6 max-lg:w-[80%]", frame: "aspect-[7/5]", speed: -4 },
};

function ProductCard({ product, index, onOpen }: { product: Product; index: number; onOpen: (product: Product) => void }) {
  const Art = ART[product.id];
  const { slot, frame, speed } = LAYOUT[product.id];

  return (
    <article className={`relative ${slot}`} data-speed={speed} aria-labelledby={`produto-${product.id}`}>
      <span aria-hidden className="pointer-events-none absolute -top-6 left-0 font-display text-[clamp(4rem,9vw,8rem)] leading-none text-transparent [-webkit-text-stroke:1.5px_var(--color-caramel)] opacity-60">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className={`relative ${frame}`}>
        <ProductStage product={product}>
          <div className="absolute inset-0">
            <Art />
          </div>
        </ProductStage>
      </div>
      <div className="relative mt-3 max-w-[34ch]">
        <p className="font-hand text-xl text-crust" lang="fr">{product.french}</p>
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
  useFlavorsScroll(rootRef);

  return (
    <section
      ref={rootRef}
      data-scene="flavors"
      aria-labelledby="sabores"
      className="relative overflow-hidden bg-butter px-6 pb-40 pt-32 sm:px-12 lg:px-[6vw]"
    >
      <div aria-hidden className="pointer-events-none absolute -right-32 top-40 size-[34rem] rounded-full bg-olive/10" />
      <div aria-hidden className="pointer-events-none absolute -left-40 bottom-24 size-[28rem] rounded-full bg-caramel/10" />

      <header className="relative max-w-3xl">
        <p className="font-hand text-3xl text-crust" lang="fr">L&apos;art de vivre, l&apos;art du pain.</p>
        <h2 id="sabores" data-ui="flavorsTitle" className="mt-3 font-display text-[clamp(2.6rem,7vw,6rem)] font-light leading-[0.98]" style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}>
          <SplitWords text="O universo dos sabores" />
        </h2>
        <p className="mt-5 max-w-[46ch] text-chocolate/75">
          Seis histórias saídas do forno. Passe o ponteiro sobre cada uma, arraste com o dedo ou use as setas do teclado para explorar.
        </p>
      </header>

      <div className="relative mt-20 grid gap-y-24 lg:mt-12 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-14">
        {PRODUCTS.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} onOpen={setSelected} />
        ))}
      </div>

      <ProductDialog product={selected} onClose={() => setSelected(null)} />
    </section>
  );
}