"use client";

import { useState } from "react";
import { ScrollProvider } from "@/components/animations/ScrollProvider";
import { SoundProvider } from "@/components/animations/SoundProvider";
import dynamic from "next/dynamic";
import { Scene01Awakening } from "@/components/scenes/awakening/Scene01Awakening";
import { Cursor } from "@/components/ui/Cursor";
import { LazyScene } from "@/components/ui/LazyScene";
import { Loader } from "@/components/ui/Loader";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { Footer } from "./Footer";
import { Header } from "./Header";

// Cenas abaixo da dobra: chunk próprio, baixado só quando a cena se aproxima (ver LazyScene).
const Scene02Bakery = dynamic(() => import("@/components/scenes/bakery/Scene02Bakery").then((m) => m.Scene02Bakery), { ssr: false });
const Scene03Croissant = dynamic(() => import("@/components/scenes/croissant/Scene03Croissant").then((m) => m.Scene03Croissant), { ssr: false });
const Scene04Flavors = dynamic(() => import("@/components/scenes/flavors/Scene04Flavors").then((m) => m.Scene04Flavors), { ssr: false });
const Scene05Process = dynamic(() => import("@/components/scenes/process/Scene05Process").then((m) => m.Scene05Process), { ssr: false });
const Scene06Return = dynamic(() => import("@/components/scenes/finale/Scene06Return").then((m) => m.Scene06Return), { ssr: false });

export function Experience() {
  const tier = useDeviceTier();
  const [revealed, setRevealed] = useState(false);
  const [loaderMounted, setLoaderMounted] = useState(true);

  return (
    <SoundProvider>
    <div data-tier={tier}>
      <Cursor />
      <ScrollProvider locked={!revealed}>
        <a className="skip-link" href="#conteudo">Ir para o conteúdo</a>
        <Header />
        <main id="conteudo">
          <Scene01Awakening ready={revealed} />
          {/* Alturas = 1 tela + telas de pin de cada cena (a Cena 04 usa a altura natural medida). */}
          <LazyScene name="bakery" title="O interior da padaria" reserve="min-h-[700svh] motion-reduce:min-h-svh">
            <Scene02Bakery />
          </LazyScene>
          <LazyScene name="croissant" title="Uma obra de arte em cada camada" reserve="min-h-[700svh] motion-reduce:min-h-svh">
            <Scene03Croissant />
          </LazyScene>
          <LazyScene name="flavors" title="O universo dos sabores" reserve="min-h-[313svh] max-lg:min-h-[396svh]">
            <Scene04Flavors />
          </LazyScene>
          <LazyScene name="process" title="A arte do processo" reserve="min-h-[900svh] motion-reduce:min-h-svh">
            <Scene05Process />
          </LazyScene>
          <LazyScene name="return" title="Algumas histórias merecem ser saboreadas" reserve="min-h-[600svh] motion-reduce:min-h-svh">
            <Scene06Return />
          </LazyScene>
        </main>
        <Footer />
      </ScrollProvider>
      {loaderMounted && (
        <Loader onReveal={() => setRevealed(true)} onDone={() => setLoaderMounted(false)} />
      )}
    </div>
    </SoundProvider>
  );
}
