"use client";

import { useRef, type ReactNode } from "react";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { SplitWords } from "@/components/ui/SplitWords";
import { PHOTOS, type PhotoId } from "@/config/photos";
import { useEditorialMotion } from "@/hooks/useEditorialMotion";
import { useReducedMotion } from "@/hooks/useMediaQuery";

function Chapter({ numeral, french, title, children }: { numeral: string; french: string; title: string; children: ReactNode }) {
  return (
    <div className="relative">
      <span aria-hidden className="pointer-events-none absolute -left-2 -top-14 font-display text-[clamp(6rem,13vw,12rem)] italic leading-none text-transparent [-webkit-text-stroke:1.5px_var(--color-caramel)] opacity-50 lg:-top-24">
        {numeral}
      </span>
      <p data-rise className="relative font-hand text-2xl text-crust-text" lang="fr">{french}</p>
      <h3 data-rise className="relative mt-1 font-display text-[clamp(1.9rem,3.6vw,3.2rem)] font-light leading-[1.05]" style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}>
        {title}
      </h3>
      <div data-rise className="relative mt-5 max-w-[44ch] space-y-4 text-chocolate/80">{children}</div>
    </div>
  );
}

function Caption({ id, className = "" }: { id: PhotoId; className?: string }) {
  return <p className={`mt-3 font-hand text-xl text-crust-text ${className}`} lang="fr">{PHOTOS[id].caption}</p>;
}

const PRINCIPLES = [
  { fr: "la patience", title: "Paciência", text: "A massa descansa o tempo que precisar. Nada nesta casa é apressado, nem o forno." },
  { fr: "le beurre", title: "Manteiga", text: "Camadas finas, manteiga de verdade e o ponto exato em que a folha estala." },
  { fr: "le partage", title: "Partilha", text: "O pão é feito para ir ao centro da mesa e chegar a todos ao mesmo tempo." },
];

/** Nossa História: narrativa editorial (fictícia) com fotografias, máscaras de revelação e paralaxe ligadas ao scroll. */
export function Historia() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useEditorialMotion(rootRef, !reduced);

  return (
    <section
      ref={rootRef}
      id="historia"
      data-nav="historia"
      aria-labelledby="historia-titulo"
      className="relative overflow-hidden bg-butter px-6 pb-36 pt-28 sm:px-12 lg:px-[6vw] lg:pt-36"
    >
      <div aria-hidden className="pointer-events-none absolute -left-52 top-[28rem] size-[36rem] rounded-full bg-rose/15" />
      <div aria-hidden className="pointer-events-none absolute -right-40 bottom-[26rem] size-[30rem] rounded-full bg-gold/15" />

      <header className="relative grid gap-8 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-9">
          <p className="font-hand text-3xl text-crust-text" lang="fr" data-rise>Notre histoire</p>
          <h2
            id="historia-titulo"
            data-words
            className="mt-3 font-display text-[clamp(2.8rem,8vw,7.4rem)] font-light leading-[0.96] tracking-tight"
            style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}
          >
            <SplitWords text="Uma padaria feita de paciência" />
          </h2>
        </div>
        <p data-rise className="self-end text-sm leading-relaxed text-chocolate/70 lg:col-span-3 lg:pb-3">
          <span className="mb-2 inline-block rounded-full border border-chocolate/30 px-3 py-1 text-[0.68rem] uppercase tracking-[0.2em]">Narrativa fictícia</span>
          <br />
          Projeto conceitual: personagens, lugares e datas abaixo são imaginários.
        </p>
      </header>

      <div className="relative mt-24 grid items-start gap-y-20 lg:mt-36 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-5">
          <PhotoFrame id="croissants" reveal="up" sizes="(min-width: 1024px) 40vw, 90vw" />
          <Caption id="croissants" />
        </div>
        <div className="lg:col-span-5 lg:col-start-8 lg:mt-24">
          <Chapter numeral="I" french="la première fournée" title="A madrugada em que o forno acendeu antes do sol">
            <p>
              Dizem que tudo começou numa madrugada de inverno, quando Hélène, uma padeira imaginária, acendeu o forno de pedra antes do sol
              e esqueceu o relógio. A primeira fornada saiu mais dourada do que qualquer outra e o cheiro atravessou a rua inteira.
            </p>
            <p>Dessa pressa de acertar nasceu a regra da casa: o pão sai quando está pronto, não quando o relógio manda.</p>
          </Chapter>
        </div>
      </div>

      <div className="relative mt-28 grid items-start gap-y-20 lg:mt-48 lg:grid-cols-12 lg:gap-x-8">
        <div className="order-2 lg:order-1 lg:col-span-5 lg:col-start-2 lg:mt-16">
          <Chapter numeral="II" french="le comptoir" title="Um balcão para olhar, escolher e demorar">
            <p>
              Louis, o confeiteiro desta história, montou o balcão como quem arruma uma vitrine de joalheria: rolinhos de canela, tortas e doces
              sob luz baixa, para que cada um fosse visto antes de ser comido.
            </p>
            <p>Ninguém tinha pressa de sair. A fila virou conversa, e a conversa virou hábito de domingo.</p>
          </Chapter>
        </div>
        <div className="order-1 lg:order-2 lg:col-span-4 lg:col-start-8">
          <PhotoFrame id="vitrine" reveal="left" sizes="(min-width: 1024px) 34vw, 80vw" className="ml-auto max-lg:w-[82%]" />
          <Caption id="vitrine" className="text-right" />
        </div>
      </div>

      <div className="relative mt-28 lg:mt-48">
        <p data-words className="mx-auto max-w-[18ch] text-center font-display text-[clamp(2.4rem,6.4vw,5.6rem)] font-light italic leading-[1.02]" style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}>
          <SplitWords text="Le bonheur se savoure." />
        </p>
      </div>

      <div className="relative mt-24 grid items-start gap-y-16 lg:mt-36 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-3 lg:col-start-2">
          <PhotoFrame id="biscuits" reveal="down" sizes="(min-width: 1024px) 26vw, 70vw" className="max-lg:w-[70%]" />
          <Caption id="biscuits" />
        </div>
        <div className="lg:col-span-5 lg:col-start-7 lg:mt-20">
          <Chapter numeral="III" french="les bocaux" title="Receitas guardadas em potes de vidro">
            <p>
              Aveia, manteiga e doce de leite viraram os biscoitos que ficam à vista, em potes e latas, prontos para ir para casa. Hoje a Maison du
              Pain é feita de gestos assim: pequenos, repetidos e bem-feitos.
            </p>
          </Chapter>
        </div>
      </div>

      <ul className="relative mt-28 grid gap-x-10 gap-y-12 border-t border-chocolate/20 pt-12 lg:mt-44 lg:grid-cols-3">
        {PRINCIPLES.map((item, index) => (
          <li key={item.title} data-rise>
            <span className="text-xs tabular-nums tracking-[0.2em] text-chocolate/55">{String(index + 1).padStart(2, "0")}</span>
            <p className="mt-2 font-hand text-2xl text-crust-text" lang="fr">{item.fr}</p>
            <h3 className="font-display text-3xl font-light">{item.title}</h3>
            <p className="mt-3 max-w-[34ch] text-sm text-chocolate/75">{item.text}</p>
          </li>
        ))}
      </ul>

      <p className="relative mt-20 text-xs text-chocolate/60">
        Maison du Pain é uma marca fictícia criada para um projeto conceitual de desenvolvimento criativo. A história acima é inventada.
      </p>
    </section>
  );
}
