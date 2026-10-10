"use client";

import { Dialog, DialogCloseButton } from "@/components/ui/Dialog";
import { Photo } from "@/components/ui/Photo";
import type { Product } from "@/config/products";

export function ProductDialog({ product, onClose }: { product: Product | null; onClose: () => void }) {
  return (
    <Dialog open={product !== null} onClose={onClose} labelledBy="produto-titulo">
      {product && (
        <>
          {product.photo && (
            <div className="relative -mx-7 -mt-7 mb-6 aspect-[3/2] overflow-hidden sm:-mx-9 sm:-mt-9">
              <Photo id={product.photo} sizes="(min-width: 640px) 36rem, 92vw" />
            </div>
          )}
          <p className="font-hand text-2xl text-crust-text" lang="fr">{product.french}</p>
          <h3 id="produto-titulo" className="mt-1 font-display text-3xl sm:text-4xl">{product.name}</h3>
          <p className="mt-4 text-chocolate/80">{product.description}</p>
          <dl className="mt-6 grid gap-3 text-sm">
            {(Object.entries(product.details) as [string, string][]).map(([label, value]) => (
              <div key={label} className="grid grid-cols-[6.5rem_1fr] gap-3 border-t border-chocolate/15 pt-3">
                <dt className="uppercase tracking-[0.18em] text-chocolate/60">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-xs text-chocolate/60">
            Maison du Pain é uma marca fictícia: as informações acima são ilustrativas e não há venda ou pedido neste site.
          </p>
          <DialogCloseButton onClose={onClose} />
        </>
      )}
    </Dialog>
  );
}