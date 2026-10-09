"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ScrollLock } from "@/components/animations/ScrollLock";
import { SoundProvider } from "@/components/animations/SoundProvider";
import { Scene01Awakening } from "@/components/scenes/awakening/Scene01Awakening";
import { LazyScene } from "@/components/ui/LazyScene";
import { Loader } from "@/components/ui/Loader";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { useStaticMode } from "@/hooks/motionPreference";
import { Footer } from "./Footer";
import { Header } from "./Header";

// Cenas abaixo da dobra: chunk próprio, montado só quando a cena se aproxima (ver LazyScene).
const loadBakery = () => import("@/components/scenes/bakery/Scene02Bakery").then((m) => m.Scene02Bakery);
const loadCroissant = () => import("@/components/scenes/croissant/Scene03Croissant").then((m) => m.Scene03Croissant);
const loadFlavors = () => import("@/components/scenes/flavors/Scene04Flavors").then((m) => m.Scene04Flavors);
const loadProcess = () => import("@/components/scenes/process/Scene05Process").then((m) => m.Scene05Process);
const loadReturn = () => import("@/components/scenes/finale/Scene06Return").then((m) => m.Scene06Return);

const Scene02Bakery = dynamic(loadBakery, { ssr: false });
const Scene03Croissant = dynamic(loadCroissant, { ssr: false });
const Scene04Flavors = dynamic(loadFlavors, { ssr: false });
const Scene05Process = dynamic(loadProcess, { ssr: false });
const Scene06Return = dynamic(loadReturn, { ssr: false });

export function Experience() {
  const tier = useDeviceTier();
  const staticMode = useStaticMode();
  const [revealed, setRevealed] = useState(false);
  const [loaderMounted, setLoaderMounted] = useState(true);

  useEffect(() => {
    document.documentElement.dataset.motion = staticMode ? "static" : "full";
  }, [staticMode]);

  // Depois da abertura, baixa o código das próximas cenas em silêncio: quando uma cena chega à tela,
  // o chunk já está no navegador e a montagem é imediata (sem quadros em branco com rolagem rápida).
  useEffect(() => {
    if (!revealed) return;
    const timer = window.setTimeout(() => {
      [loadBakery, loadCroissant, loadFlavors, loadProcess, loadReturn].forEach((load) => void load());
    }, 1_500);
    return () => window.clearTimeout(timer);
  }, [revealed]);

  return (
    <SoundProvider>
      <div data-tier={tier}>
        <ScrollLock locked={!revealed}>
          <a className="skip-link" href="#conteudo">Ir para o conteúdo</a>
          <Header />
          <main id="conteudo">
            <Scene01Awakening ready={revealed} />
            {/*
              Alturas reservadas = telas de scroll + 1 (palco sticky) + 1 se outra cena sobe por cima do último quadro
              e, nas cenas que se sobrepõem à anterior, menos 1 tela (margem negativa). A Cena 04 usa a altura natural medida.
            */}
            <LazyScene name="bakery" title="O interior da padaria" reserve="min-h-[800svh] -mt-[100svh]" reserveReduced="min-h-svh">
              <Scene02Bakery />
            </LazyScene>
            <LazyScene name="croissant" title="Uma obra de arte em cada camada" reserve="min-h-[800svh] -mt-[100svh]" reserveReduced="min-h-svh">
              <Scene03Croissant />
            </LazyScene>
            <LazyScene
              name="flavors"
              title="O universo dos sabores"
              reserve="min-h-[313svh] max-lg:min-h-[396svh] -mt-[100svh]"
              reserveReduced="min-h-[313svh] max-lg:min-h-[396svh]"
            >
              <Scene04Flavors />
            </LazyScene>
            <LazyScene name="process" title="A arte do processo" reserve="min-h-[1000svh]" reserveReduced="min-h-svh">
              <Scene05Process />
            </LazyScene>
            <LazyScene name="return" title="Algumas histórias merecem ser saboreadas" reserve="min-h-[600svh] -mt-[100svh]" reserveReduced="min-h-svh">
              <Scene06Return />
            </LazyScene>
          </main>
          <Footer />
        </ScrollLock>
        {loaderMounted && <Loader onReveal={() => setRevealed(true)} onDone={() => setLoaderMounted(false)} />}
      </div>
    </SoundProvider>
  );
}
