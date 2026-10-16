"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { canGoBack } from "@/lib/navigate";

/**
 * Botão "Voltar" sempre visível nas páginas internas. Volta pelo histórico quando o visitante veio de outra página do site
 * (a página inicial reaparece onde estava); se a página foi aberta direto, leva ao endereço de reserva.
 */
export function BackLink({ fallbackHref, children }: { fallbackHref: string; children: ReactNode }) {
  const router = useRouter();
  return (
    <Link
      href={fallbackHref}
      data-back-link
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        if (!canGoBack()) return;
        event.preventDefault();
        router.back();
      }}
      className="inline-flex items-center gap-2 rounded-full border border-chocolate/30 px-4 py-2 text-[0.68rem] uppercase tracking-[0.18em] text-chocolate transition-colors hover:bg-chocolate hover:text-cream motion-reduce:transition-none"
    >
      <svg viewBox="0 0 16 10" className="w-4" aria-hidden><path d="M15 5H1m4-4L1 5l4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      {children}
    </Link>
  );
}
