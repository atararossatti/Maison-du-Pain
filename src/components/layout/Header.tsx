"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useSound } from "@/components/animations/SoundProvider";
import { NAV, type NavId } from "@/config/nav";
import { setStaticMode, useStaticMode } from "@/hooks/motionPreference";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { activeNav, navigateTo } from "@/lib/navigate";
import { MegaMenu } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";

const MEGA_ID = "mega-produtos";

/** Item do menu em destaque conforme o scroll; recalcula quando a página muda de altura. */
function useActiveNav() {
  const [active, setActive] = useState<NavId>("inicio");
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setActive(activeNav());
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    ScrollTrigger.addEventListener("refresh", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      ScrollTrigger.removeEventListener("refresh", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);
  return active;
}

export function Header() {
  const barRef = useRef<HTMLSpanElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number>(0);
  const { enabled, toggle } = useSound();
  const staticMode = useStaticMode();
  const active = useActiveNav();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lightScene = useRef(false);
  const megaRef = useRef(false);

  // O painel do mega menu é claro: com ele aberto o cabeçalho usa sempre o tom escuro.
  const applyTone = useCallback(() => {
    headerRef.current?.setAttribute("data-tone", lightScene.current && !megaRef.current ? "light" : "dark");
  }, []);
  useEffect(() => {
    megaRef.current = megaOpen;
    applyTone();
  }, [megaOpen, applyTone]);

  useEffect(() => {
    const bar = barRef.current;
    const header = headerRef.current;
    if (!bar || !header) return;
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => gsap.set(bar, { scaleY: self.progress }),
    });
    const onScroll = () => header.setAttribute("data-scrolled", String(window.scrollY > 40));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Cenas escuras (`data-header-tone="light"`) pedem o cabeçalho claro enquanto ocupam o topo da tela.
    const visible = new Set<Element>();
    const tone = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }
        lightScene.current = visible.size > 0;
        applyTone();
      },
      // Faixa fina no topo da tela, onde o cabeçalho fica: independe de pin ou espaçadores do ScrollTrigger.
      { rootMargin: "-4% 0px -95% 0px" },
    );
    // Cenas montadas sob demanda (LazyScene) aparecem depois: observa o que for surgindo.
    const seen = new WeakSet<Element>();
    const attach = () => {
      document.querySelectorAll("[data-header-tone='light']").forEach((el) => {
        if (!seen.has(el)) {
          seen.add(el);
          tone.observe(el);
        }
      });
    };
    attach();
    const mounts = new MutationObserver(attach);
    mounts.observe(document.getElementById("conteudo") ?? document.body, { childList: true, subtree: true });
    return () => {
      trigger.kill();
      tone.disconnect();
      mounts.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [applyTone]);

  const openMega = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    setMegaOpen(true);
  }, []);
  const closeMega = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    setMegaOpen(false);
  }, []);
  const closeSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), 220);
  };

  // Esc fecha o mega menu devolvendo o foco ao botão; rolar a página também o fecha.
  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMegaOpen(false);
      headerRef.current?.querySelector<HTMLElement>("[data-mega-trigger]")?.focus();
    };
    const startY = window.scrollY;
    const onScroll = () => Math.abs(window.scrollY - startY) > 60 && setMegaOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, [megaOpen]);

  const onTriggerKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openMega();
      requestAnimationFrame(() => document.querySelector<HTMLElement>(`#${MEGA_ID} [data-category]`)?.focus());
    }
  };

  const go = (id: NavId) => (event: React.MouseEvent) => {
    event.preventDefault();
    closeMega();
    navigateTo(id);
  };

  return (
    <>
      <header
        ref={headerRef}
        data-tone="dark"
        data-scrolled="false"
        data-mega={megaOpen}
        className="site-header group fixed inset-x-0 top-0 z-40"
        onPointerLeave={(event) => event.pointerType === "mouse" && closeSoon()}
        onPointerEnter={() => window.clearTimeout(closeTimer.current)}
      >
        <div className="mx-auto flex h-[4.25rem] max-w-[100rem] items-center justify-between gap-6 px-5 sm:px-9 lg:h-[4.75rem]">
          <a
            href="#"
            onClick={go("inicio")}
            className="shrink-0 font-display text-lg tracking-tight text-chocolate transition-colors group-data-[tone=light]:text-cream sm:text-xl"
            aria-label="Maison du Pain — início"
          >
            Maison <span className="italic text-crust group-data-[tone=light]:text-gold">du</span> Pain
          </a>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-0 xl:gap-2">
              {NAV.map((item) => {
                const current = active === item.id;
                const base =
                  "nav-link relative inline-flex items-center gap-1.5 whitespace-nowrap px-2.5 py-2 text-[0.74rem] uppercase tracking-[0.14em] xl:px-3 xl:text-[0.78rem] xl:tracking-[0.17em] text-chocolate transition-colors group-data-[tone=light]:text-cream";
                return (
                  <li key={item.id}>
                    {item.id === "produtos" ? (
                      <button
                        type="button"
                        data-mega-trigger
                        data-current={current || megaOpen}
                        aria-expanded={megaOpen}
                        aria-controls={MEGA_ID}
                        aria-current={current ? "location" : undefined}
                        onClick={() => (megaOpen ? closeMega() : openMega())}
                        onPointerEnter={(event) => event.pointerType === "mouse" && openMega()}
                        onKeyDown={onTriggerKey}
                        className={base}
                      >
                        {item.label}
                        <svg viewBox="0 0 10 6" className={`h-1.5 w-2.5 transition-transform duration-300 ${megaOpen ? "rotate-180" : ""}`} aria-hidden>
                          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    ) : (
                      <a
                        href={item.id === "inicio" ? "#" : `#${item.id}`}
                        data-current={current}
                        aria-current={current ? "location" : undefined}
                        onClick={go(item.id)}
                        onPointerEnter={(event) => event.pointerType === "mouse" && closeSoon()}
                        className={base}
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <p className="whitespace-nowrap font-hand text-xl text-chocolate/80 transition-colors group-data-[tone=light]:text-cream/80 max-2xl:hidden" lang="fr">
              Le bonheur se savoure
            </p>
            <button
              type="button"
              onClick={() => setStaticMode(!staticMode)}
              aria-pressed={staticMode}
              title="Alterna entre a experiência animada e uma versão estática (recarrega a página)"
              className="whitespace-nowrap rounded-full border border-current px-3 py-1 text-[0.68rem] uppercase tracking-[0.2em] text-chocolate transition-colors group-data-[tone=light]:text-cream max-2xl:hidden"
            >
              Modo estático {staticMode ? "ligado" : "desligado"}
            </button>
            <button
              type="button"
              onClick={toggle}
              aria-pressed={enabled}
              className="whitespace-nowrap rounded-full border border-current px-3 py-1 text-[0.68rem] uppercase tracking-[0.2em] text-chocolate transition-colors group-data-[tone=light]:text-cream max-lg:hidden"
            >
              Som {enabled ? "ligado" : "desligado"}
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu"
              aria-haspopup="dialog"
              aria-expanded={mobileOpen}
              className="grid size-11 place-items-center rounded-full border border-current text-chocolate transition-colors group-data-[tone=light]:text-cream lg:hidden"
            >
              <svg viewBox="0 0 20 12" className="w-5" aria-hidden>
                <path d="M1 1.5h18M1 10.5h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="max-lg:hidden">
          <MegaMenu id={MEGA_ID} open={megaOpen} onClose={closeMega} />
        </div>
      </header>

      {megaOpen && <div aria-hidden onClick={closeMega} className="fixed inset-0 z-30 bg-ink/35 max-lg:hidden" />}
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        active={active}
        sound={{ enabled, toggle }}
        staticMode={{ enabled: staticMode, toggle: () => setStaticMode(!staticMode) }}
      />
      <div id="nav-veil" aria-hidden className="pointer-events-none fixed inset-0 z-[60] bg-butter opacity-0" />
      <div className="pointer-events-none fixed right-0 top-0 z-[41] h-full w-[3px] bg-chocolate/10" aria-hidden>
        <span ref={barRef} className="block h-full origin-top scale-y-0 bg-caramel" />
      </div>
    </>
  );
}
