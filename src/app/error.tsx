"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-svh place-items-center bg-butter px-6 text-center text-chocolate">
      <div className="grid gap-5">
        <p className="font-hand text-3xl text-crust-text" lang="fr">un contretemps</p>
        <h1 className="font-display text-4xl font-light">Algo saiu do forno errado</h1>
        <p className="max-w-[40ch] text-sm text-chocolate/75">Não foi possível carregar esta página. Seu carrinho continua guardado neste navegador.</p>
        <div className="flex justify-center gap-3">
          <button type="button" onClick={reset} className="rounded-full bg-chocolate px-6 py-3 text-xs uppercase tracking-[0.18em] text-cream">Tentar de novo</button>
          <Link href="/" className="rounded-full border border-chocolate/40 px-6 py-3 text-xs uppercase tracking-[0.18em]">Início</Link>
        </div>
      </div>
    </main>
  );
}
