"use client";

import { useState } from "react";
import { ScrollProvider } from "@/components/animations/ScrollProvider";
import { Scene01Awakening } from "@/components/scenes/awakening/Scene01Awakening";
import { NextChapter } from "@/components/scenes/NextChapter";
import { Loader } from "@/components/ui/Loader";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { Header } from "./Header";

export function Experience() {
  const tier = useDeviceTier();
  const [revealed, setRevealed] = useState(false);
  const [loaderMounted, setLoaderMounted] = useState(true);

  return (
    <div data-tier={tier}>
      <ScrollProvider locked={!revealed}>
        <a className="skip-link" href="#conteudo">Ir para o conteúdo</a>
        <Header />
        <main id="conteudo">
          <Scene01Awakening ready={revealed} />
          <NextChapter />
        </main>
      </ScrollProvider>
      {loaderMounted && (
        <Loader onReveal={() => setRevealed(true)} onDone={() => setLoaderMounted(false)} />
      )}
    </div>
  );
}