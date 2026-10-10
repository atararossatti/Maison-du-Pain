"use client";

import { useEffect, useRef, useState } from "react";
import { Photo } from "@/components/ui/Photo";
import { NAV, type NavId } from "@/config/nav";
import { CATEGORIES, PRODUCTS } from "@/config/products";
import { gsap } from "@/lib/gsap";
import { navigateTo, navigateToProduct } from "@/lib/navigate";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  active: NavId;
  sound: { enabled: boolean; toggle: () => void };
  staticMode: { enabled: boolean; toggle: () => void };
}

/** Menu de tela cheia para o celular: `<dialog>` modal (foco preso, Esc fecha) com entrada em círculo e itens escalonados. */
export function MobileMenu({ open, onClose, active, sound, staticMode }: MobileMenuProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [productsOpen, setProductsOpen] = useState(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      const tl = gsap.timeline();
      tl.fromTo(dialog, { clipPath: "circle(0% at calc(100% - 2.2rem) 2.2rem)" }, { clipPath: "circle(150% at calc(100% - 2.2rem) 2.2rem)", duration: 0.75, ease: "power3.inOut" });
      tl.fromTo(dialog.querySelectorAll("[data-mobile-in]"), { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: "power3.out", clearProps: "transform,opacity" }, 0.25);
      return () => {
        tl.kill();
      };
    }
    if (!open && dialog.open) {
      gsap.to(dialog, { clipPath: "circle(0% at calc(100% - 2.2rem) 2.2rem)", duration: 0.45, ease: "power3.in", onComplete: () => dialog.close() });
    }
  }, [open]);

  // Esc fecha pelo próprio <dialog>; mantém o estado do React coerente.
  const onCancel = (event: React.SyntheticEvent) => {
    event.preventDefault();
    onClose();
  };

  const leave = (action: () => void) => {
    onClose();
    window.setTimeout(action, 480);
  };

  return (
    <dialog
      ref={ref}
      aria-label="Menu principal"
      onCancel={onCancel}
      className="m-0 h-svh max-h-none w-screen max-w-none overflow-y-auto bg-ink p-0 text-cream backdrop:bg-transparent"
    >
      <div className="flex min-h-svh flex-col px-6 pb-8 pt-5">
        <div data-mobile-in className="flex items-center justify-between">
          <span className="font-display text-lg">Maison <span className="italic text-gold">du</span> Pain</span>
          <button type="button" onClick={onClose} aria-label="Fechar menu" className="grid size-11 place-items-center rounded-full border border-cream/40">
            <svg viewBox="0 0 20 20" className="size-5" aria-hidden><path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>

        <nav aria-label="Principal" className="mt-8 flex-1">
          <ul>
            {NAV.map((item, index) => {
              const isProducts = item.id === "produtos";
              return (
                <li key={item.id} data-mobile-in className="border-b border-cream/15">
                  {isProducts ? (
                    <button
                      type="button"
                      aria-expanded={productsOpen}
                      aria-controls="mobile-produtos"
                      onClick={() => setProductsOpen((value) => !value)}
                      className="flex w-full items-baseline gap-4 py-4 text-left"
                    >
                      <span className="w-6 text-xs tabular-nums text-cream/50">{String(index + 1).padStart(2, "0")}</span>
                      <span className="font-display text-[2.1rem] font-light leading-none" style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}>{item.label}</span>
                      <span aria-hidden className={`ml-auto text-xl transition-transform duration-300 ${productsOpen ? "rotate-45" : ""}`}>+</span>
                    </button>
                  ) : (
                    <a
                      href={item.id === "inicio" ? "#" : `#${item.id}`}
                      aria-current={active === item.id ? "location" : undefined}
                      onClick={(event) => {
                        event.preventDefault();
                        leave(() => navigateTo(item.id));
                      }}
                      className="flex items-baseline gap-4 py-4"
                    >
                      <span className="w-6 text-xs tabular-nums text-cream/50">{String(index + 1).padStart(2, "0")}</span>
                      <span className={`font-display text-[2.1rem] font-light leading-none ${active === item.id ? "text-gold" : ""}`} style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}>{item.label}</span>
                      <span className="ml-auto font-hand text-lg text-cream/60" lang="fr">{item.french}</span>
                    </a>
                  )}
                  {isProducts && (
                    <div id="mobile-produtos" hidden={!productsOpen} className="pb-5">
                      <ul className="grid grid-cols-2 gap-3">
                        {CATEGORIES.map((cat) => {
                          const first = PRODUCTS.find((product) => product.category === cat.id);
                          return (
                            <li key={cat.id}>
                              <a
                                href={first ? `#produto-${first.id}` : "#produtos"}
                                onClick={(event) => {
                                  event.preventDefault();
                                  leave(() => (first ? navigateToProduct(first.id) : navigateTo("produtos")));
                                }}
                                className="group relative block aspect-[4/5] overflow-hidden"
                              >
                                <Photo id={cat.cover} alt="" sizes="45vw" className="transition-transform duration-700 group-active:scale-105" />
                                <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                                <span className="absolute inset-x-3 bottom-3 font-display text-xl leading-tight">{cat.name}</span>
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                      <a
                        href="#produtos"
                        onClick={(event) => {
                          event.preventDefault();
                          leave(() => navigateTo("produtos"));
                        }}
                        className="mt-4 inline-block text-xs uppercase tracking-[0.2em] text-gold underline underline-offset-4"
                      >
                        Ver todos os produtos
                      </a>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div data-mobile-in className="mt-8 flex flex-wrap items-center gap-3">
          <p className="mr-auto font-hand text-2xl text-gold" lang="fr">Le bonheur se savoure.</p>
          <button type="button" onClick={sound.toggle} aria-pressed={sound.enabled} className="rounded-full border border-cream/50 px-4 py-2 text-[0.7rem] uppercase tracking-[0.2em]">
            Som {sound.enabled ? "ligado" : "desligado"}
          </button>
          <button type="button" onClick={staticMode.toggle} aria-pressed={staticMode.enabled} className="rounded-full border border-cream/50 px-4 py-2 text-[0.7rem] uppercase tracking-[0.2em]">
            Modo estático {staticMode.enabled ? "ligado" : "desligado"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
