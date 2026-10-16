import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { formatBRL, getCategory, type CatalogProduct } from "@/config/catalog";
import { ProductPicture } from "./ProductPicture";

interface ProductCardProps {
  product: CatalogProduct;
  /** As primeiras imagens da página carregam com prioridade; as demais, sob demanda. */
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  return (
    <article data-product-card data-product-id={product.id} className="group relative flex flex-col">
      <Link href={`/catalogo/${product.id}`} className="block rounded-[2px] outline-offset-4">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-blush/40 [container-type:inline-size]">
          <ProductPicture
            product={product}
            priority={priority}
            sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 48vw"
            className="transition-transform duration-[900ms] ease-out motion-safe:group-hover:scale-[1.05] motion-reduce:transition-none"
          />
          {(product.featured || product.tags?.includes("Novidade")) && (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-cream/90 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.18em] text-chocolate backdrop-blur-sm">
              {product.tags?.includes("Novidade") ? "Novidade" : "Destaque"}
            </span>
          )}
          <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none" />
        </div>
        <p className="mt-3 text-[0.64rem] uppercase tracking-[0.2em] text-chocolate/60">{getCategory(product.category)?.name}</p>
        <h3 className="mt-0.5 font-display text-xl leading-tight sm:text-[1.35rem]">
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1px] motion-reduce:transition-none">{product.name}</span>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-snug text-chocolate/70">{product.short}</p>
      </Link>
      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-base font-medium tabular-nums" data-price>{formatBRL(product.priceCents)}</p>
        <AddToCartButton productId={product.id} productName={product.name} />
      </div>
    </article>
  );
}
