"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { getProduct } from "@/config/catalog";
import { addToCart } from "@/lib/cart";
import { CartDrawer } from "./CartDrawer";
import { CartToast } from "./CartToast";

interface CartUi {
  open: boolean;
  openCart: () => void;
  closeCart: () => void;
  /** Adiciona ao carrinho e mostra a confirmação visual. */
  add: (id: string, qty?: number) => void;
}

const CartUiContext = createContext<CartUi>({ open: false, openCart: () => {}, closeCart: () => {}, add: () => {} });
export const useCartUi = () => useContext(CartUiContext);

export interface CartNotice {
  key: number;
  name: string;
  qty: number;
}

/** Estado de interface do carrinho (gaveta aberta, aviso de "adicionado"). Os itens ficam em `lib/cart.ts`. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState<CartNotice | null>(null);
  const counter = useRef(0);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const openCart = useCallback(() => {
    window.clearTimeout(timer.current);
    setNotice(null);
    setOpen(true);
  }, []);
  const closeCart = useCallback(() => setOpen(false), []);

  const add = useCallback((id: string, qty = 1) => {
    const product = getProduct(id);
    if (!product) return;
    addToCart(id, qty);
    counter.current += 1;
    setNotice({ key: counter.current, name: product.name, qty });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setNotice(null), 4500);
  }, []);

  const value = useMemo(() => ({ open, openCart, closeCart, add }), [open, openCart, closeCart, add]);

  return (
    <CartUiContext.Provider value={value}>
      {children}
      <CartToast notice={open ? null : notice} onOpen={openCart} onDismiss={() => setNotice(null)} />
      <CartDrawer />
    </CartUiContext.Provider>
  );
}
