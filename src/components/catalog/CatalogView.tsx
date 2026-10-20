"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CATEGORIES,
  PRODUCTS,
  SORT_LABEL,
  isCategoryId,
  isSortKey,
  queryCatalog,
  type CategoryId,
  type SortKey,
} from "@/config/catalog";
import { ProductCard } from "./ProductCard";

interface Filters {
  category: CategoryId | null;
  text: string;
  sort: SortKey;
  featuredOnly: boolean;
}

function fromParams(params: URLSearchParams): Filters {
  const category = params.get("categoria");
  const sort = params.get("ordem");
  return {
    category: isCategoryId(category) ? category : null,
    text: (params.get("busca") ?? "").slice(0, 80),
    sort: isSortKey(sort) ? sort : "destaques",
    featuredOnly: params.get("destaques") === "1",
  };
}

function toQueryString({ category, text, sort, featuredOnly }: Filters) {
  const next = new URLSearchParams();
  if (category) next.set("categoria", category);
  if (text.trim()) next.set("busca", text.trim());
  if (sort !== "destaques") next.set("ordem", sort);
  if (featuredOnly) next.set("destaques", "1");
  return next.toString();
}

const chip = (active: boolean) =>
  `shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-[0.7rem] uppercase tracking-[0.16em] transition-colors motion-reduce:transition-none ${
    active ? "border-chocolate bg-chocolate text-cream" : "border-chocolate/30 text-chocolate hover:border-chocolate"
  }`;

/** Catálogo: busca, categorias, destaques e ordenação. O estado vive no endereço (`?categoria=paes&ordem=preco-asc`). */
export function CatalogView() {
  const params = useSearchParams();
  const [filters, setFilters] = useState<Filters>(() => fromParams(params));
  // Endereços que a própria tela escreveu: o `useSearchParams` pode chegar atrasado e não deve desfazer o que foi digitado.
  const written = useRef(new Set<string>([toQueryString(fromParams(params))]));

  const paramsString = params.toString();
  useEffect(() => {
    if (written.current.has(paramsString)) return;
    // Navegação externa (menu, botão voltar): a tela passa a refletir o novo endereço.
    setFilters(fromParams(new URLSearchParams(paramsString)));
  }, [paramsString]);

  useEffect(() => {
    const qs = toQueryString(filters);
    written.current.add(qs);
    if (qs === window.location.search.replace(/^\?/, "")) return;
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  }, [filters]);

  const update = (patch: Partial<Filters>) => setFilters((current) => ({ ...current, ...patch }));
  const results = useMemo(() => queryCatalog(filters), [filters]);
  const filtered = filters.category !== null || filters.text.trim() !== "" || filters.featuredOnly;
  const clear = () => update({ category: null, text: "", featuredOnly: false });

  return (
    <>
      <div className="sticky top-[4.25rem] z-20 border-y border-chocolate/10 bg-butter/95 backdrop-blur-md lg:top-[4.75rem]">
        <div className="mx-auto max-w-[96rem] px-5 py-3 sm:px-9 lg:px-[4vw]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div role="group" aria-label="Categorias" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:-mx-9 sm:px-9 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
              <button type="button" data-category="todos" aria-pressed={filters.category === null} onClick={() => update({ category: null })} className={chip(filters.category === null)}>
                Todos <span className="opacity-60">{PRODUCTS.length}</span>
              </button>
              {CATEGORIES.map((category) => (
                <button key={category.id} type="button" data-category={category.id} aria-pressed={filters.category === category.id} onClick={() => update({ category: category.id })} className={chip(filters.category === category.id)}>
                  {category.name} <span className="opacity-60">{PRODUCTS.filter((product) => product.category === category.id).length}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="relative block w-full sm:w-72 lg:w-64">
                <span className="sr-only">Buscar no cardápio</span>
                <svg viewBox="0 0 20 20" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-chocolate/55" aria-hidden>
                  <circle cx="8.5" cy="8.5" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M12.5 12.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  type="search"
                  name="busca"
                  value={filters.text}
                  onChange={(event) => update({ text: event.target.value.slice(0, 80) })}
                  placeholder="Buscar: croissant, tarte, café…"
                  autoComplete="off"
                  className="h-11 w-full rounded-full border border-chocolate/30 bg-cream pl-10 pr-4 text-sm placeholder:text-chocolate/45"
                />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <span className="sr-only sm:not-sr-only text-chocolate/65">Ordenar</span>
                <select name="ordem" value={filters.sort} onChange={(event) => update({ sort: event.target.value as SortKey })} className="h-11 rounded-full border border-chocolate/30 bg-cream px-4 text-sm">
                  {(Object.keys(SORT_LABEL) as SortKey[]).map((key) => (
                    <option key={key} value={key}>{SORT_LABEL[key]}</option>
                  ))}
                </select>
              </label>
              <button type="button" aria-pressed={filters.featuredOnly} onClick={() => update({ featuredOnly: !filters.featuredOnly })} className={chip(filters.featuredOnly)}>
                Só destaques
              </button>
            </div>
          </div>
        </div>
      </div>

      <section aria-label="Produtos" className="mx-auto max-w-[96rem] px-5 pb-28 pt-8 sm:px-9 lg:px-[4vw]">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <p aria-live="polite" data-results-count className="text-sm text-chocolate/70">
            {results.length} {results.length === 1 ? "produto" : "produtos"}
            {filters.category && ` em ${CATEGORIES.find((category) => category.id === filters.category)?.name}`}
          </p>
          {filtered && (
            <button type="button" onClick={clear} className="text-xs uppercase tracking-[0.16em] text-chocolate/75 underline underline-offset-4 hover:text-chocolate">
              Limpar filtros
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <div data-empty className="grid place-items-center gap-4 py-24 text-center">
            <p className="font-hand text-3xl text-crust-text" lang="fr">rien ici…</p>
            <p className="font-display text-3xl font-light">Nenhum produto encontrado</p>
            <p className="max-w-[40ch] text-sm text-chocolate/70">Tente outra palavra, escolha outra categoria ou volte a ver o cardápio completo.</p>
            <button type="button" onClick={clear} className="rounded-full bg-chocolate px-6 py-3 text-xs uppercase tracking-[0.18em] text-cream transition-colors hover:bg-brick">
              Ver todos os produtos
            </button>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((product, index) => (
              <li key={product.id}>
                <ProductCard product={product} priority={index < 4} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

/** Estado de carregamento (enquanto o endereço é lido): mesma grade, sem deslocamento de layout. */
export function CatalogSkeleton() {
  return (
    <div aria-hidden className="mx-auto max-w-[96rem] px-5 pb-28 pt-24 sm:px-9 lg:px-[4vw]">
      <ul className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <li key={index}>
            <div className="aspect-[4/5] animate-pulse rounded-[2px] bg-blush/50 motion-reduce:animate-none" />
            <div className="mt-3 h-3 w-1/3 rounded bg-blush/60" />
            <div className="mt-2 h-5 w-3/4 rounded bg-blush/60" />
          </li>
        ))}
      </ul>
    </div>
  );
}
