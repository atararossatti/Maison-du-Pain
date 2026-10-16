"use client";

import type { CartNotice } from "./CartProvider";

interface CartToastProps {
  notice: CartNotice | null;
  onOpen: () => void;
  onDismiss: () => void;
}

/** Confirmação discreta depois de adicionar um produto. A região `status` é anunciada por leitores de tela. */
export function CartToast({ notice, onOpen, onDismiss }: CartToastProps) {
  return (
    <div aria-live="polite" aria-atomic="true" className="pointer-events-none fixed inset-x-4 bottom-4 z-[55] flex justify-center sm:inset-x-auto sm:right-6 sm:bottom-6 sm:justify-end">
      {notice && (
        <div
          key={notice.key}
          data-cart-toast
          className="pointer-events-auto flex max-w-[26rem] items-center gap-3 rounded-full border border-chocolate/15 bg-chocolate py-2 pl-5 pr-2 text-sm text-cream shadow-[0_18px_40px_-18px_rgba(46,29,22,0.7)] motion-safe:animate-[toast-in_0.45s_cubic-bezier(0.22,1,0.36,1)]"
        >
          <span className="min-w-0 truncate">
            <span className="font-medium">{notice.qty > 1 ? `${notice.qty} × ` : ""}{notice.name}</span> no carrinho
          </span>
          <button type="button" onClick={onOpen} className="shrink-0 rounded-full bg-cream px-4 py-1.5 text-xs uppercase tracking-[0.16em] text-chocolate transition-colors hover:bg-gold">
            Ver carrinho
          </button>
          <button type="button" onClick={onDismiss} aria-label="Dispensar aviso" className="grid size-8 shrink-0 place-items-center rounded-full text-cream/70 transition-colors hover:text-cream">
            <svg viewBox="0 0 20 20" className="size-4" aria-hidden><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}
