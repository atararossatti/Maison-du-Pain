"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLayoutEffect, type ReactNode } from "react";
import { SoundProvider } from "@/components/animations/SoundProvider";
import { Footer } from "./Footer";
import { INTRO_SEEN_KEY, notePageView, registerRouter } from "@/lib/navigate";
import { Header } from "./Header";

/** Moldura das páginas internas (catálogo, produto, pedido): mesmo cabeçalho, menus e rodapé da página inicial. */
export function SiteShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  useLayoutEffect(() => {
    notePageView();
  }, [pathname]);
  useLayoutEffect(() => {
    registerRouter((href) => router.push(href));
    return () => registerRouter(null);
  }, [router]);
  useLayoutEffect(() => {
    try {
      window.sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {
      // Sem armazenamento: a abertura toca de novo ao voltar, sem outro prejuízo.
    }
  }, []);
  return (
    <SoundProvider>
      <a className="skip-link" href="#conteudo">Ir para o conteúdo</a>
      <Header />
      <main id="conteudo" className="min-h-svh pt-[4.25rem] lg:pt-[4.75rem]">{children}</main>
      <Footer />
    </SoundProvider>
  );
}
