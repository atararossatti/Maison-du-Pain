"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ProductPicture } from "@/components/catalog/ProductPicture";
import { formatBRL } from "@/config/catalog";
import { clearCart, removeFromCart, setQuantity, useCart } from "@/lib/cart";
import { useCartUi } from "./CartProvider";
import { QuantityStepper } from "./QuantityStepper";

/** Carrinho lateral: `<dialog>` modal (foco preso, Esc fecha, clique no fundo fecha). */
export function CartDrawer() {
  const { open, closeCart } = useCartUi();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      data-cart-drawer
      aria-labelledby="cart-title"
      onClose={closeCart}
      onClick={(event) => event.target === event.currentTarget && closeCart()}
      className="cart-drawer m-0 ml-auto h-svh max-h-none w-[min(100vw,27rem)] max-w-none overflow-hidden bg-cream p-0 text-chocolate shadow-2xl"
    >
      {open && <DrawerBody />}
    </dialog>
  );
}

function DrawerBody() {
  const { closeCart } = useCartUi();
  const { lines, count, subtotalCents } = useCart();
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <div className="flex h-full flex-col">
          <header className="flex items-start justify-between gap-4 border-b border-chocolate/12 px-6 pb-4 pt-6">
            <div>
              <p className="font-hand text-2xl leading-none text-crust-text" lang="fr">votre panier</p>
              <h2 id="cart-title" className="font-display text-3xl font-light">Seu carrinho</h2>
              <p className="mt-1 text-xs text-chocolate/65" data-cart-total-items>{count === 0 ? "Nenhum item" : `${count} ${count === 1 ? "item" : "itens"}`}</p>
            </div>
            <button type="button" onClick={closeCart} aria-label="Fechar carrinho" className="grid size-11 place-items-center rounded-full border border-chocolate/30 transition-colors hover:bg-chocolate hover:text-cream">
              <svg viewBox="0 0 20 20" className="size-5" aria-hidden><path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          </header>

          {lines.length === 0 ? (
            <div className="grid flex-1 place-content-center gap-4 px-8 text-center">
              <p className="font-display text-2xl font-light">Seu carrinho está vazio</p>
              <p className="text-sm text-chocolate/70">Escolha croissants, pães, doces e cafés no cardápio. Os itens ficam guardados neste navegador.</p>
              <Link href="/catalogo" onClick={closeCart} className="mx-auto rounded-full bg-chocolate px-6 py-3 text-xs uppercase tracking-[0.18em] text-cream transition-colors hover:bg-brick">
                Explorar o cardápio
              </Link>
            </div>
          ) : (
            <>
              <ul className="flex-1 divide-y divide-chocolate/10 overflow-y-auto px-6" aria-label="Itens do carrinho">
                {lines.map(({ product, qty, totalCents }) => (
                  <li key={product.id} data-cart-line={product.id} className="grid grid-cols-[4.5rem_1fr] gap-4 py-5">
                    <Link href={`/catalogo/${product.id}`} onClick={closeCart} className="relative block aspect-[4/5] overflow-hidden rounded-[2px] bg-butter" aria-label={`Ver ${product.name}`}>
                      <ProductPicture product={product} sizes="72px" variant="thumb" />
                    </Link>
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/catalogo/${product.id}`} onClick={closeCart} className="font-display text-lg leading-tight hover:underline">{product.name}</Link>
                        <button type="button" onClick={() => removeFromCart(product.id)} aria-label={`Remover ${product.name} do carrinho`} className="-mr-1 grid size-8 shrink-0 place-items-center rounded-full text-chocolate/60 transition-colors hover:bg-chocolate/10 hover:text-chocolate">
                          <svg viewBox="0 0 20 20" className="size-4" aria-hidden><path d="M5 6h10M8 6V4.5h4V6m-6 0l.6 9h6.8l.6-9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                      </div>
                      <p className="mt-0.5 text-xs text-chocolate/65">{formatBRL(product.priceCents)} cada</p>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <QuantityStepper compact name={product.name} value={qty} onChange={(next) => setQuantity(product.id, next)} />
                        <p className="text-sm font-medium tabular-nums" data-line-total>{formatBRL(totalCents)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <footer className="border-t border-chocolate/12 bg-butter/60 px-6 pb-6 pt-5">
                <div className="flex items-baseline justify-between">
                  <p className="text-sm uppercase tracking-[0.16em] text-chocolate/70">Subtotal</p>
                  <p className="font-display text-2xl tabular-nums" data-cart-subtotal>{formatBRL(subtotalCents)}</p>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-chocolate/65">Demonstração: preços ilustrativos de uma marca fictícia. Nenhum pagamento é feito e nada é enviado.</p>
                <Link href="/pedido" onClick={closeCart} className="mt-4 block rounded-full bg-chocolate px-6 py-3.5 text-center text-xs uppercase tracking-[0.2em] text-cream transition-colors hover:bg-brick">
                  Ver resumo do pedido
                </Link>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <button type="button" onClick={closeCart} className="text-xs uppercase tracking-[0.16em] text-chocolate/80 underline underline-offset-4 hover:text-chocolate">
                    Continuar navegando
                  </button>
                  {confirmClear ? (
                    <span className="flex items-center gap-2 text-xs">
                      <button type="button" onClick={() => { clearCart(); setConfirmClear(false); }} className="rounded-full bg-brick px-3 py-1.5 uppercase tracking-[0.14em] text-cream">Confirmar</button>
                      <button type="button" onClick={() => setConfirmClear(false)} className="uppercase tracking-[0.14em] text-chocolate/70 underline underline-offset-4">Cancelar</button>
                    </span>
                  ) : (
                    <button type="button" onClick={() => setConfirmClear(true)} className="text-xs uppercase tracking-[0.16em] text-chocolate/70 underline underline-offset-4 hover:text-chocolate">
                      Esvaziar carrinho
                    </button>
                  )}
                </div>
              </footer>
            </>
          )}
    </div>
  );
}
