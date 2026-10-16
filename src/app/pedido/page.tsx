import type { Metadata } from "next";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { BackLink } from "@/components/layout/BackLink";
import { SiteShell } from "@/components/layout/SiteShell";

export const metadata: Metadata = {
  title: "Resumo do pedido (demonstração) — Maison du Pain",
  description: "Resumo de demonstração do carrinho. Nenhum pagamento é feito e nada é enviado.",
  robots: { index: false },
};

export default function OrderPage() {
  return (
    <SiteShell>
      <header className="mx-auto max-w-[80rem] px-5 pb-8 pt-12 sm:px-9 lg:px-[4vw] lg:pt-20">
        <BackLink fallbackHref="/catalogo">Voltar</BackLink>
        <p className="mt-8 font-hand text-3xl text-crust-text" lang="fr">votre commande</p>
        <h1 className="font-display text-[clamp(2.6rem,7vw,5.5rem)] font-light leading-[0.98]" style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}>
          Resumo do pedido
        </h1>
        <p className="mt-3 inline-block rounded-full border border-chocolate/30 px-3 py-1 text-[0.68rem] uppercase tracking-[0.2em]">Demonstração</p>
      </header>
      <OrderSummary />
    </SiteShell>
  );
}
