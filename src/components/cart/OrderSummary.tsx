"use client";

import Link from "next/link";
import { useState } from "react";
import { ProductPicture } from "@/components/catalog/ProductPicture";
import { formatBRL } from "@/config/catalog";
import { clearCart, removeFromCart, setQuantity, useCart } from "@/lib/cart";
import { QuantityStepper } from "./QuantityStepper";

/** Resumo do pedido de DEMONSTRAÇÃO: sem pagamento, sem dados pessoais, sem envio a terceiros. */
export function OrderSummary() {
  const { lines, count, subtotalCents } = useCart();
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div data-order-done className="mx-auto grid max-w-xl gap-5 px-6 py-24 text-center">
        <p className="font-hand text-3xl text-crust-text" lang="fr">merci beaucoup !</p>
        <h2 className="font-display text-4xl font-light">Demonstração concluída</h2>
        <p className="text-chocolate/75">Nenhum pedido foi criado e nada foi enviado. Esta tela só mostra como o fim da compra funcionaria.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => { clearCart(); setDone(false); }} className="rounded-full bg-chocolate px-6 py-3 text-xs uppercase tracking-[0.18em] text-cream transition-colors hover:bg-brick">
            Esvaziar o carrinho
          </button>
          <button type="button" onClick={() => setDone(false)} className="rounded-full border border-chocolate/40 px-6 py-3 text-xs uppercase tracking-[0.18em]">
            Manter os itens
          </button>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div data-order-empty className="mx-auto grid max-w-xl gap-5 px-6 py-24 text-center">
        <h2 className="font-display text-4xl font-light">Seu carrinho está vazio</h2>
        <p className="text-chocolate/75">Adicione produtos no catálogo para ver o resumo do pedido de demonstração.</p>
        <Link href="/catalogo" className="mx-auto rounded-full bg-chocolate px-7 py-3.5 text-xs uppercase tracking-[0.2em] text-cream transition-colors hover:bg-brick">
          Explorar o catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-[80rem] gap-10 px-5 pb-28 sm:px-9 lg:grid-cols-12 lg:gap-14 lg:px-[4vw]">
      <ul className="divide-y divide-chocolate/12 border-y border-chocolate/12 lg:col-span-8" aria-label="Itens do pedido">
        {lines.map(({ product, qty, totalCents }) => (
          <li key={product.id} data-order-line={product.id} className="grid grid-cols-[5.5rem_1fr] gap-4 py-6 sm:grid-cols-[7rem_1fr_auto] sm:items-center sm:gap-6">
            <Link href={`/catalogo/${product.id}`} className="relative block aspect-[4/5] overflow-hidden rounded-[2px] bg-blush/40 [container-type:inline-size]" aria-label={`Ver ${product.name}`}>
              <ProductPicture product={product} sizes="112px" variant="thumb" />
            </Link>
            <div className="min-w-0">
              <Link href={`/catalogo/${product.id}`} className="font-display text-xl leading-tight hover:underline">{product.name}</Link>
              <p className="mt-1 text-sm text-chocolate/65">{formatBRL(product.priceCents)} cada</p>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <QuantityStepper compact name={product.name} value={qty} onChange={(next) => setQuantity(product.id, next)} />
                <button type="button" onClick={() => removeFromCart(product.id)} className="text-xs uppercase tracking-[0.16em] text-chocolate/70 underline underline-offset-4 hover:text-chocolate">
                  Remover
                </button>
              </div>
            </div>
            <p className="col-span-2 text-right font-display text-xl tabular-nums sm:col-span-1" data-line-total>{formatBRL(totalCents)}</p>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-[2px] border border-chocolate/15 bg-cream p-6 lg:sticky lg:top-28 lg:col-span-4">
        <h2 className="font-display text-2xl font-light">Resumo</h2>
        <dl className="mt-4 grid gap-2 text-sm">
          <div className="flex justify-between"><dt className="text-chocolate/70">Itens</dt><dd className="tabular-nums" data-order-count>{count}</dd></div>
          <div className="flex justify-between border-t border-chocolate/12 pt-3 text-base"><dt>Subtotal</dt><dd className="font-display text-2xl tabular-nums" data-order-subtotal>{formatBRL(subtotalCents)}</dd></div>
        </dl>
        <p className="mt-4 rounded-[2px] bg-butter px-3 py-2 text-xs leading-relaxed text-chocolate/75">
          <strong className="font-medium">DEMONSTRAÇÃO.</strong> Marca fictícia, preços ilustrativos. Não há pagamento, não pedimos dados de cartão nem enviamos informações a ninguém.
        </p>
        <button type="button" onClick={() => setDone(true)} className="mt-5 w-full rounded-full bg-chocolate px-6 py-3.5 text-xs uppercase tracking-[0.2em] text-cream transition-colors hover:bg-brick">
          Concluir demonstração
        </button>
        <div className="mt-4 flex items-center justify-between text-xs">
          <Link href="/catalogo" className="uppercase tracking-[0.16em] underline underline-offset-4">Continuar escolhendo</Link>
          <button type="button" onClick={clearCart} className="uppercase tracking-[0.16em] text-chocolate/70 underline underline-offset-4 hover:text-chocolate">Esvaziar</button>
        </div>
      </aside>
    </div>
  );
}
