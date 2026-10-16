"use client";

import { useEffect, useRef, useState } from "react";
import { useCartUi } from "./CartProvider";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  qty?: number;
  variant?: "card" | "primary";
  className?: string;
}

/** Botão "Adicionar ao carrinho" com confirmação visual no próprio botão (o aviso global vem do `CartProvider`). */
export function AddToCartButton({ productId, productName, qty = 1, variant = "card", className = "" }: AddToCartButtonProps) {
  const { add } = useCartUi();
  const [added, setAdded] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const style =
    variant === "primary"
      ? "w-full rounded-full bg-chocolate px-8 py-4 text-xs uppercase tracking-[0.22em] text-cream hover:bg-brick sm:w-auto"
      : "rounded-full border border-chocolate/40 px-4 py-2 text-[0.68rem] uppercase tracking-[0.16em] text-chocolate hover:bg-chocolate hover:text-cream";

  return (
    <button
      type="button"
      data-add-to-cart={productId}
      aria-label={`Adicionar ${productName} ao carrinho`}
      onClick={() => {
        add(productId, qty);
        setAdded(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setAdded(false), 1600);
      }}
      className={`transition-colors duration-300 motion-reduce:transition-none ${style} ${added ? "!bg-olive !text-cream !border-olive" : ""} ${className}`}
    >
      {added ? "Adicionado ✓" : variant === "primary" ? "Adicionar ao carrinho" : "Adicionar"}
    </button>
  );
}
