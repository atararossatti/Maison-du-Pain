import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";

export default function NotFound() {
  return (
    <SiteShell>
      <section className="mx-auto grid max-w-3xl place-items-center gap-5 px-6 py-32 text-center">
        <p className="font-hand text-3xl text-crust-text" lang="fr">oups…</p>
        <h1 className="font-display text-[clamp(2.6rem,7vw,5rem)] font-light leading-none">Página não encontrada</h1>
        <p className="max-w-[44ch] text-chocolate/75">Este endereço não existe ou o produto saiu do catálogo. Volte ao catálogo para continuar escolhendo.</p>
        <Link href="/catalogo" className="rounded-full bg-chocolate px-7 py-3.5 text-xs uppercase tracking-[0.2em] text-cream transition-colors hover:bg-brick">
          Ver o catálogo
        </Link>
      </section>
    </SiteShell>
  );
}
