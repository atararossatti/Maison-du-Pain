"use client";

import { useEffect, useRef } from "react";
import type { Product } from "@/config/products";

/** Painel de detalhes em `<dialog>` nativo: foco preso, Esc fecha e o foco volta ao botão de origem. */
export function ProductDialog({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (product && !dialog.open) dialog.showModal();
    if (!product && dialog.open) dialog.close();
  }, [product]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => event.target === event.currentTarget && onClose()}
      aria-labelledby="produto-titulo"
      className="m-auto w-[min(92vw,34rem)] rounded-3xl border border-chocolate/20 bg-cream p-0 text-chocolate shadow-2xl backdrop:bg-chocolate/55"
    >
      {product && (
        <div className="p-7 sm:p-9">
          <p className="font-hand text-2xl text-crust" lang="fr">{product.french}</p>
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
          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="mt-6 rounded-full bg-chocolate px-6 py-2.5 text-sm text-cream transition hover:bg-brick"
          >
            Fechar
          </button>
        </div>
      )}
    </dialog>
  );
}