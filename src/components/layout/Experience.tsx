"use client";

import { useState } from "react";
import { ScrollProvider } from "@/components/animations/ScrollProvider";
import { SoundProvider } from "@/components/animations/SoundProvider";
import { Scene01Awakening } from "@/components/scenes/awakening/Scene01Awakening";
import { Scene02Bakery } from "@/components/scenes/bakery/Scene02Bakery";
import { Scene03Croissant } from "@/components/scenes/croissant/Scene03Croissant";
import { Scene06Return } from "@/components/scenes/finale/Scene06Return";
import { Scene04Flavors } from "@/components/scenes/flavors/Scene04Flavors";
import { Scene05Process } from "@/components/scenes/process/Scene05Process";
import { Cursor } from "@/components/ui/Cursor";
import { Loader } from "@/components/ui/Loader";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { Footer } from "./Footer";
import { Header } from "./Header";

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
          <Scene02Bakery />
          <Scene03Croissant />
          <Scene04Flavors />
          <Scene05Process />
          <Scene06Return />
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
