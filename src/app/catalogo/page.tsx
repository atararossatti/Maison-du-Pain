import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogSkeleton, CatalogView } from "@/components/catalog/CatalogView";
import { BackLink } from "@/components/layout/BackLink";
import { SiteShell } from "@/components/layout/SiteShell";
import { PRODUCTS } from "@/config/catalog";

export const metadata: Metadata = {
  title: "Catálogo — Maison du Pain",
  description: "Croissants, pães artesanais, pâtisserie, doces, salgados e cafés. Catálogo demonstrativo da Maison du Pain, marca fictícia.",
};

export default function CatalogPage() {
  return (
    <SiteShell>
      <header className="mx-auto max-w-[96rem] px-5 pb-10 pt-12 sm:px-9 lg:px-[4vw] lg:pb-14 lg:pt-20">
        <BackLink fallbackHref="/">Voltar</BackLink>
        <p className="mt-8 font-hand text-3xl text-crust-text" lang="fr">le catalogue</p>
        <h1 className="mt-1 font-display text-[clamp(3rem,8vw,7rem)] font-light leading-[0.95] tracking-tight" style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}>
          Catálogo
        </h1>
        <p className="mt-5 max-w-[56ch] text-chocolate/75">
          {PRODUCTS.length} criações da padaria, da confeitaria e do balcão. Busque, filtre por categoria e monte o seu carrinho.
        </p>
        <p className="mt-3 max-w-[56ch] text-xs text-chocolate/60">Catálogo de demonstração de uma marca fictícia: produtos e preços são ilustrativos e não há compra real.</p>
      </header>
      <Suspense fallback={<CatalogSkeleton />}>
        <CatalogView />
      </Suspense>
    </SiteShell>
  );
}
