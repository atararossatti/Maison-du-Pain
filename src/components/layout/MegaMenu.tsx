"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Photo } from "@/components/ui/Photo";
import { CATEGORIES, PRODUCTS, type CategoryId, type Product } from "@/config/products";
import { PHOTOS, type PhotoId } from "@/config/photos";
import { growPhoto } from "@/lib/growPhoto";
import { gsap } from "@/lib/gsap";
import { navigateToProduct } from "@/lib/navigate";

interface MegaMenuProps {
  id: string;
  open: boolean;
  onClose: () => void;
}

/** Fotografia mostrada para uma categoria ou produto (produtos sem foto própria usam a capa da categoria). */
function previewOf(category: CategoryId, product: Product | null): { photo: PhotoId; title: string; french: string; note?: string } {
  const cat = CATEGORIES.find((entry) => entry.id === category) ?? CATEGORIES[0]!;
  if (product?.photo) return { photo: product.photo, title: product.name, french: product.french };
  return { photo: cat.cover, title: product?.name ?? cat.name, french: product?.french ?? cat.french, note: product ? cat.coverNote ?? "Veja a ilustração na vitrine" : cat.coverNote };
}

export function MegaMenu({ id, open, onClose }: MegaMenuProps) {
  const [category, setCategory] = useState<CategoryId>("viennoiseries");
  const [hovered, setHovered] = useState<Product | null>(null);
  const [loaded, setLoaded] = useState<PhotoId[]>(["croissants"]);
  const panelRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const layers = useRef<Partial<Record<PhotoId, HTMLDivElement | null>>>({});
  const zTop = useRef(1);
  const shown = useRef<PhotoId | null>(null);
  const busy = useRef(false);

  const preview = useMemo(() => previewOf(category, hovered), [category, hovered]);
  const productsOf = (cat: CategoryId) => PRODUCTS.filter((product) => product.category === cat);

  // Carrega a foto sob demanda: a primeira vez que ela é pedida entra no DOM (com miniatura borrada).
  if (!loaded.includes(preview.photo)) setLoaded([...loaded, preview.photo]);

  // Troca de foto: a nova entra como uma cortina que sobe, com um zoom que assenta.
  useLayoutEffect(() => {
    const layer = layers.current[preview.photo];
    if (!layer) return;
    if (shown.current === null || !open) {
      shown.current = preview.photo;
      layer.style.zIndex = String(++zTop.current);
      gsap.set(layer, { clipPath: "inset(0% 0% 0% 0%)" });
      return;
    }
    if (shown.current === preview.photo) return;
    shown.current = preview.photo;
    layer.style.zIndex = String(++zTop.current);
    const inner = layer.querySelector("[data-menu-photo]");
    gsap.killTweensOf([layer, inner]);
    gsap.fromTo(layer, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.85, ease: "expo.out" });
    if (inner) gsap.fromTo(inner, { scale: 1.3 }, { scale: 1, duration: 1.4, ease: "power3.out" });
  }, [preview.photo, loaded, open]);

  // Entrada escalonada da lista cada vez que o menu abre.
  useEffect(() => {
    const panel = panelRef.current;
    if (!open || !panel) return;
    const items = panel.querySelectorAll("[data-menu-in]");
    const tween = gsap.fromTo(items, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.05, ease: "power3.out", clearProps: "transform,opacity" });
    return () => {
      tween.kill();
    };
  }, [open]);

  // Paralaxe leve da fotografia seguindo o ponteiro.
  useEffect(() => {
    const frame = frameRef.current;
    if (!open || !frame || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const x = gsap.quickTo(frame, "--mx", { duration: 0.9, ease: "power3.out" });
    const y = gsap.quickTo(frame, "--my", { duration: 0.9, ease: "power3.out" });
    const onMove = (event: PointerEvent) => {
      const rect = frame.getBoundingClientRect();
      x(((event.clientX - rect.left) / rect.width - 0.5) * -22);
      y(((event.clientY - rect.top) / rect.height - 0.5) * -16);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [open]);

  const select = async (product: Product) => {
    if (busy.current) return;
    busy.current = true;
    const frame = frameRef.current;
    const target = previewOf(product.category, product);
    onClose();
    if (frame) {
      const { grown, reveal } = growPhoto(frame.getBoundingClientRect(), target.photo);
      await grown;
      navigateToProduct(product.id, { instant: true });
      await new Promise((resolve) => window.setTimeout(resolve, 500));
      await reveal();
    } else navigateToProduct(product.id);
    busy.current = false;
  };

  const onCategoryKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = panelRef.current?.querySelectorAll<HTMLButtonElement>("[data-category]")[(index + step + CATEGORIES.length) % CATEGORIES.length];
    next?.focus();
  };

  return (
    <div
      id={id}
      ref={panelRef}
      role="region"
      aria-label="Nossos produtos"
      hidden={!open}
      className="absolute inset-x-0 top-full border-t border-chocolate/10 bg-butter text-chocolate shadow-[0_30px_60px_-30px_rgba(46,29,22,0.45)]"
    >
      <div className="mx-auto grid max-w-[88rem] grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 px-9 py-9 xl:gap-20 xl:px-14">
        <div className="flex flex-col justify-between">
          <div>
            <p data-menu-in className="font-hand text-2xl text-crust-text" lang="fr">nos créations</p>
            <ul className="mt-3">
              {CATEGORIES.map((cat, index) => {
                const active = cat.id === category;
                const items = productsOf(cat.id);
                return (
                  <li key={cat.id} data-menu-in className="border-b border-chocolate/12 last:border-b-0">
                    <button
                      type="button"
                      data-category
                      aria-expanded={active}
                      aria-controls={`${id}-items`}
                      onPointerEnter={() => {
                        setCategory(cat.id);
                        setHovered(null);
                      }}
                      onFocus={() => {
                        setCategory(cat.id);
                        setHovered(null);
                      }}
                      onKeyDown={(event) => onCategoryKey(event, index)}
                      onClick={() => items[0] && void select(items[0])}
                      className="group/cat flex w-full items-baseline gap-4 py-3 text-left"
                    >
                      <span className="w-6 font-sans text-xs tabular-nums text-chocolate/55">{String(index + 1).padStart(2, "0")}</span>
                      <span
                        className={`font-display text-[clamp(1.8rem,3vw,2.7rem)] font-light leading-none tracking-tight transition-all duration-500 ${active ? "translate-x-2 text-chocolate" : "text-chocolate/55 group-hover/cat:text-chocolate"}`}
                        style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}
                      >
                        {cat.name}
                      </span>
                      <span className={`ml-auto font-hand text-lg text-crust-text transition-opacity duration-500 ${active ? "opacity-100" : "opacity-0"}`} lang="fr">{cat.french}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <ul id={`${id}-items`} aria-label={`Criações em ${CATEGORIES.find((cat) => cat.id === category)?.name ?? ""}`} data-menu-in className="mt-5 flex min-h-[4.6rem] flex-wrap content-start gap-x-6 gap-y-2">
              {productsOf(category).map((product) => (
                <li key={product.id}>
                  <a
                    href={`#produto-${product.id}`}
                    onPointerEnter={() => setHovered(product)}
                    onPointerLeave={() => setHovered(null)}
                    onFocus={() => setHovered(product)}
                    onBlur={() => setHovered(null)}
                    onClick={(event) => {
                      event.preventDefault();
                      void select(product);
                    }}
                    className="relative text-[0.95rem] text-chocolate/85 transition-colors hover:text-chocolate after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-caramel after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:after:scale-x-100"
                  >
                    {product.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p data-menu-in className="mt-6 max-w-[34ch] text-xs leading-relaxed text-chocolate/60">
            Escolha uma criação: a fotografia cresce e leva você até a vitrine. Produtos fictícios, sem preços ou pedidos.
          </p>
        </div>

        <div data-menu-in ref={frameRef} className="relative h-[min(34rem,64svh)] overflow-hidden rounded-[2px] bg-ink" aria-hidden style={{ ["--mx" as string]: 0, ["--my" as string]: 0 }}>
          {loaded.map((photoId) => (
            <div key={photoId} ref={(el) => { layers.current[photoId] = el; }} className="absolute inset-0" style={{ background: PHOTOS[photoId].color }}>
              <div data-menu-photo className="absolute -inset-5" style={{ transform: "translate(calc(var(--mx, 0) * 1px), calc(var(--my, 0) * 1px))" }}>
                <Photo id={photoId} alt="" sizes="(min-width: 1280px) 780px, 55vw" />
              </div>
            </div>
          ))}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[100] bg-gradient-to-t from-ink/80 via-ink/35 to-transparent p-7 pt-24 text-cream">
            <p className="font-hand text-2xl text-gold" lang="fr">{preview.french}</p>
            <p className="font-display text-3xl font-light leading-tight" style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}>{preview.title}</p>
            {preview.note && <p className="mt-1 text-xs uppercase tracking-[0.2em] text-cream/75">{preview.note}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
