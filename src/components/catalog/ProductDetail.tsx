"use client";

import Link from "next/link";
import { useState } from "react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { QuantityStepper } from "@/components/cart/QuantityStepper";
import { AVAILABILITY_LABEL, formatBRL, getCategory, relatedTo, type CatalogProduct } from "@/config/catalog";
import { BackLink } from "@/components/layout/BackLink";
import { ProductCard } from "./ProductCard";
import { ProductPicture } from "./ProductPicture";

/** Página de um produto: galeria, descrição, quantidade e "Adicionar ao carrinho". Dados demonstrativos. */
export function ProductDetail({ product }: { product: CatalogProduct }) {
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState(0);
  const category = getCategory(product.category);
  const related = relatedTo(product);
  const current = product.images[selected];

  return (
    <article className="mx-auto max-w-[96rem] px-5 pb-28 pt-8 sm:px-9 lg:px-[4vw]">
      <BackLink fallbackHref="/catalogo">Voltar</BackLink>
      <nav aria-label="Você está em" className="mt-5 text-xs uppercase tracking-[0.16em] text-chocolate/65">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li><Link href="/catalogo" className="underline-offset-4 hover:underline">Cardápio</Link></li>
          <li aria-hidden>/</li>
          <li><Link href={`/catalogo?categoria=${product.category}`} className="underline-offset-4 hover:underline">{category?.name}</Link></li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-chocolate">{product.name}</li>
        </ol>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <div className={`relative overflow-hidden rounded-[2px] bg-blush/40 [container-type:inline-size] ${product.images.length > 0 ? "aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/4.6]" : "aspect-[4/3]"}`} data-product-image>
            <ProductPicture product={product} image={current} priority variant="hero" sizes="(min-width: 1024px) 58vw, 100vw" />
          </div>
          {product.images.length > 1 && (
            <ul className="mt-3 flex gap-3" aria-label="Galeria de imagens">
              {product.images.map((image, index) => (
                <li key={image.src}>
                  <button
                    type="button"
                    aria-label={`Ver imagem ${index + 1} de ${product.images.length}`}
                    aria-pressed={selected === index}
                    onClick={() => setSelected(index)}
                    className={`relative block h-20 w-16 overflow-hidden rounded-[2px] border-2 transition-colors motion-reduce:transition-none ${selected === index ? "border-chocolate" : "border-transparent opacity-70 hover:opacity-100"}`}
                  >
                    <ProductPicture product={product} image={image} sizes="64px" variant="thumb" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="lg:col-span-5 lg:pt-4">
          <p className="font-hand text-3xl leading-none text-crust-text" lang="fr">{product.french}</p>
          <h1 className="mt-2 font-display text-[clamp(2.4rem,5vw,4rem)] font-light leading-[1]" style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}>
            {product.name}
          </h1>
          {product.tags && product.tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Etiquetas">
              {product.tags.map((tag) => (
                <li key={tag} className="rounded-full border border-chocolate/30 px-3 py-1 text-[0.64rem] uppercase tracking-[0.18em]">{tag}</li>
              ))}
            </ul>
          )}
          <p className="mt-6 font-display text-3xl tabular-nums" data-product-price>{formatBRL(product.priceCents)}</p>
          <p className="mt-1 text-xs text-chocolate/65">Preço demonstrativo · {AVAILABILITY_LABEL[product.availability]}</p>

          <p className="mt-6 text-lg leading-snug text-chocolate/85">{product.short}</p>
          <p className="mt-3 max-w-[52ch] text-chocolate/75">{product.description}</p>

          {product.ingredients && (
            <div className="mt-6">
              <h2 className="text-xs uppercase tracking-[0.18em] text-chocolate/65">Composição ilustrativa</h2>
              <p className="mt-1 text-sm text-chocolate/80">{product.ingredients.join(", ")}.</p>
              <p className="mt-1 text-xs text-chocolate/60">Lista de demonstração: não representa a receita de um produto real nem traz informação de alergênicos.</p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <QuantityStepper editable value={qty} onChange={setQty} name={product.name} />
            <AddToCartButton variant="primary" productId={product.id} productName={product.name} qty={qty} />
          </div>
          <p className="mt-4 text-xs text-chocolate/60">Experiência de demonstração: nenhum pagamento é feito e nenhum pedido é enviado.</p>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="relacionados" className="mt-24">
          <p className="font-hand text-2xl text-crust-text" lang="fr">à découvrir aussi</p>
          <h2 id="relacionados" className="font-display text-3xl font-light sm:text-4xl">Você também pode gostar</h2>
          <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-6 lg:grid-cols-4">
            {related.map((item) => (
              <li key={item.id}>
                <ProductCard product={item} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
