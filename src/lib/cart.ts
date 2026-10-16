import { useMemo, useSyncExternalStore } from "react";
import { getProduct, type CatalogProduct } from "@/config/catalog";

/**
 * Carrinho de demonstração: guarda só `id do produto → quantidade` em `localStorage`.
 * O servidor sempre enxerga o carrinho vazio (`getServerSnapshot`); o navegador lê o armazenamento depois
 * da hidratação, então não há divergência entre o HTML do servidor e o do cliente.
 */

export const CART_KEY = "mdp-cart-v1";
export const MIN_QTY = 1;
export const MAX_QTY = 99;

export type CartLines = Readonly<Record<string, number>>;

const EMPTY: CartLines = Object.freeze({});

/** Quantidade válida: inteiro entre 1 e 99. Qualquer outra coisa (NaN, texto, negativo, decimal) vira o limite mais próximo. */
export function normalizeQty(value: unknown): number {
  const number = typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(number)) return MIN_QTY;
  return Math.min(MAX_QTY, Math.max(MIN_QTY, Math.trunc(number)));
}

/** Aceita só produtos que existem no catálogo e quantidades inteiras de 1 a 99 (o armazenamento pode ter sido editado ou corrompido). */
export function sanitize(raw: unknown): CartLines {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return EMPTY;
  const clean: Record<string, number> = {};
  for (const [id, qty] of Object.entries(raw)) {
    if (!getProduct(id) || typeof qty !== "number" || !Number.isInteger(qty) || qty < MIN_QTY) continue;
    clean[id] = Math.min(MAX_QTY, qty);
  }
  return Object.keys(clean).length ? clean : EMPTY;
}

let lines: CartLines = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function readStorage(): CartLines {
  try {
    return sanitize(JSON.parse(window.localStorage.getItem(CART_KEY) ?? "null"));
  } catch {
    return EMPTY;
  }
}

const emit = () => listeners.forEach((listener) => listener());

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  lines = readStorage();
  // Outra aba mudou o carrinho: acompanha.
  window.addEventListener("storage", (event) => {
    if (event.key !== CART_KEY && event.key !== null) return;
    lines = readStorage();
    emit();
  });
}

function commit(next: CartLines) {
  lines = Object.keys(next).length ? next : EMPTY;
  try {
    if (lines === EMPTY) window.localStorage.removeItem(CART_KEY);
    else window.localStorage.setItem(CART_KEY, JSON.stringify(lines));
  } catch {
    // Sem armazenamento (modo privado restrito): o carrinho vale até recarregar a página.
  }
  emit();
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
export function getSnapshot(): CartLines {
  ensureLoaded();
  return lines;
}
export const getServerSnapshot = (): CartLines => EMPTY;

export function addToCart(id: string, qty: number = 1) {
  if (!getProduct(id)) return;
  ensureLoaded();
  commit({ ...lines, [id]: normalizeQty((lines[id] ?? 0) + normalizeQty(qty)) });
}

export function setQuantity(id: string, qty: number) {
  if (!getProduct(id) || !(id in getSnapshot())) return;
  commit({ ...lines, [id]: normalizeQty(qty) });
}

export function removeFromCart(id: string) {
  const current = getSnapshot();
  if (!(id in current)) return;
  const rest: Record<string, number> = { ...current };
  delete rest[id];
  commit(rest);
}

export function clearCart() {
  ensureLoaded();
  commit(EMPTY);
}

export interface CartLine {
  product: CatalogProduct;
  qty: number;
  totalCents: number;
}

export interface CartState {
  lines: CartLine[];
  /** Quantidade total de unidades (soma das quantidades). */
  count: number;
  subtotalCents: number;
}

export function useCart(): CartState {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => {
    const items: CartLine[] = [];
    for (const [id, qty] of Object.entries(snapshot)) {
      const product = getProduct(id);
      if (product) items.push({ product, qty, totalCents: product.priceCents * qty });
    }
    return {
      lines: items,
      count: items.reduce((sum, line) => sum + line.qty, 0),
      subtotalCents: items.reduce((sum, line) => sum + line.totalCents, 0),
    };
  }, [snapshot]);
}
