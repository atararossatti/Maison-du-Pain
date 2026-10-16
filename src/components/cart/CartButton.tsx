"use client";

import { useCart } from "@/lib/cart";
import { useCartUi } from "./CartProvider";

/** Botão do cabeçalho: abre o carrinho e mostra o contador de itens. */
export function CartButton() {
  const { count } = useCart();
  const { open, openCart } = useCartUi();
  return (
    <button
      type="button"
      data-cart-button
      onClick={openCart}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-label={count > 0 ? `Abrir carrinho, ${count} ${count === 1 ? "item" : "itens"}` : "Abrir carrinho, vazio"}
      className="relative inline-flex h-11 items-center gap-2 rounded-full border border-current px-3 text-chocolate transition-colors group-data-[tone=light]:text-cream sm:px-4"
    >
      <svg viewBox="0 0 20 20" className="size-5" aria-hidden>
        <path d="M4.5 7h11l-.9 9h-9.2L4.5 7zM7.5 7V5.8a2.5 2.5 0 015 0V7" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-[0.68rem] uppercase tracking-[0.2em] max-sm:hidden">Carrinho</span>
      <span
        key={count}
        data-cart-count
        aria-hidden
        className={`grid min-w-[1.35rem] place-items-center rounded-full bg-caramel px-1.5 py-0.5 text-[0.68rem] font-medium leading-none tabular-nums text-ink motion-safe:animate-[badge-pop_0.4s_ease-out] ${count === 0 ? "hidden" : ""}`}
      >
        {count}
      </span>
    </button>
  );
}
