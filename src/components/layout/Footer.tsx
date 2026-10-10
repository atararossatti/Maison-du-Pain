"use client";

import { NAV } from "@/config/nav";
import { setStaticMode, useStaticMode } from "@/hooks/motionPreference";
import { navigateTo } from "@/lib/navigate";

export function Footer() {
  const staticMode = useStaticMode();
  return (
    <footer className="bg-chocolate px-6 py-12 text-center text-sm text-cream/70">
      <p className="font-display text-xl text-cream">Maison du Pain</p>
      <p className="mt-1 font-hand text-2xl text-gold" lang="fr">Le bonheur se savoure.</p>
      <nav aria-label="Rodapé" className="mt-6">
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[0.75rem] uppercase tracking-[0.18em]">
          {NAV.map((item) => (
            <li key={item.id}>
              <a
                href={item.id === "inicio" ? "#" : `#${item.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  navigateTo(item.id);
                }}
                className="text-cream/80 underline-offset-4 transition-colors hover:text-gold hover:underline"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <button
        type="button"
        onClick={() => setStaticMode(!staticMode)}
        aria-pressed={staticMode}
        title="Alterna entre a experiência animada e uma versão estática (recarrega a página)"
        className="mt-6 rounded-full border border-cream/40 px-4 py-1.5 text-[0.7rem] uppercase tracking-[0.2em] text-cream/80 transition-colors hover:border-gold hover:text-gold"
      >
        Modo estático {staticMode ? "ligado" : "desligado"}
      </button>
      <p className="mt-8">Projeto fictício de creative development. Marca, ilustrações e código são originais; as fotografias são da pasta de imagens fornecida pelo autor do projeto.</p>
      <p className="mt-1">Tipografia: Fraunces, Instrument Sans e Caveat (SIL Open Font License).</p>
    </footer>
  );
}
