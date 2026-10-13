import { NAV, isNavId, type NavId, type NavItem } from "@/config/nav";
import { gsap } from "@/lib/gsap";

/** Altura do cabeçalho fixo: seções comuns pousam logo abaixo dele. */
const HEADER_GAP = 96;
/** Distância (em telas) a partir da qual o salto passa por um véu em vez de rolar de verdade. */
const VEIL_DISTANCE = 2.5;

const find = (selector: string) => document.querySelector<HTMLElement>(selector);
const stageOf = (el: HTMLElement) => el.closest<HTMLElement>("[data-stage]");
const documentTop = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;

/** Posição absoluta (px) de um item do menu, ou `null` se nem a cena nem o seu placeholder existem. */
export function navTop(item: NavItem): { top: number; mounted: boolean } | null {
  if (item.id === "inicio") return { top: 0, mounted: true };
  const el = find(item.selector);
  if (el) {
    const stage = stageOf(el);
    return { top: stage ? documentTop(stage) : documentTop(el), mounted: true };
  }
  const placeholder = item.lazy ? find(`[data-lazy="${item.lazy}"]`) : null;
  if (!placeholder) return null;
  // Os produtos começam um pouco abaixo do topo da seção (ela sobe por baixo da cena anterior).
  const shift = item.id === "produtos" ? window.innerHeight + 128 : 0;
  return { top: documentTop(placeholder) + shift, mounted: false };
}

/** Onde o scroll deve pousar para mostrar o item (px). */
export function landingY(item: NavItem): number | null {
  const found = navTop(item);
  if (!found) return null;
  const el = find(item.selector);
  const gap = el && stageOf(el) ? 0 : item.id === "inicio" ? 0 : HEADER_GAP;
  return Math.max(0, Math.round(found.top - gap + (item.land ?? 0) * window.innerHeight));
}

/** Item ativo para a posição atual do scroll: a última seção cujo início já passou. */
export function activeNav(scrollY = window.scrollY): NavId {
  let active: NavId = "inicio";
  for (const item of NAV) {
    const found = navTop(item);
    if (found && found.top - item.lead * window.innerHeight <= scrollY + 1) active = item.id;
  }
  return active;
}

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function veil(): HTMLElement | null {
  return document.getElementById("nav-veil");
}

/** Depois de pousar, as cenas sob demanda se montam e o alvo pode mudar de lugar: corrige até estabilizar. */
function settle(item: NavItem, frames = 600) {
  let stable = 0;
  const step = () => {
    const wanted = landingY(item);
    const mounted = navTop(item)?.mounted ?? false;
    if (wanted !== null && mounted) {
      if (Math.abs(window.scrollY - wanted) > 3) {
        window.scrollTo({ top: wanted, behavior: "instant" });
        stable = 0;
      } else stable += 1;
      if (stable >= 20) return;
    }
    if (frames-- > 0) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export interface NavigateOptions {
  /** Pula sem animar (carregamento com `#hash`). */
  instant?: boolean;
  /** Atualiza o `#hash` da URL (padrão: sim). */
  updateHash?: boolean;
}

/** Leva o visitante a uma seção: rolagem suave se for perto, véu + salto se for longe. */
export function navigateTo(id: NavId, options: NavigateOptions = {}) {
  const item = NAV.find((entry) => entry.id === id);
  if (!item) return;
  const y = landingY(item);
  if (y === null) return;
  if (options.updateHash !== false) history.replaceState(null, "", id === "inicio" ? window.location.pathname : `#${id}`);

  const distance = Math.abs(y - window.scrollY) / window.innerHeight;
  const cover = veil();
  if (options.instant || prefersReducedMotion()) {
    window.scrollTo({ top: y, behavior: "instant" });
    settle(item);
    return;
  }
  if (distance < VEIL_DISTANCE || !cover) {
    window.scrollTo({ top: y, behavior: "smooth" });
    settle(item, 300);
    return;
  }
  gsap.killTweensOf(cover);
  gsap.to(cover, {
    opacity: 1,
    duration: 0.28,
    ease: "power2.in",
    onComplete: () => {
      window.scrollTo({ top: y, behavior: "instant" });
      settle(item);
      gsap.to(cover, { opacity: 0, duration: 0.7, delay: 0.25, ease: "power2.out" });
    },
  });
}

/** Rola até um produto específico (`#produto-<id>`), com o mesmo véu/rolagem de `navigateTo`. */
export function navigateToProduct(productId: string, options: NavigateOptions = {}) {
  const produtos = NAV.find((entry) => entry.id === "produtos");
  if (!produtos) return;
  const landOnProduct = () => {
    const el = document.getElementById(`produto-${productId}`)?.closest<HTMLElement>("article");
    return el ? Math.max(0, Math.round(documentTop(el) - HEADER_GAP - 40)) : null;
  };
  const first = landOnProduct() ?? landingY(produtos);
  if (first === null) return;
  history.replaceState(null, "", `#produto-${productId}`);
  const cover = veil();
  const go = () => {
    window.scrollTo({ top: first, behavior: "instant" });
    let frames = 600;
    let stable = 0;
    const step = () => {
      const wanted = landOnProduct();
      if (wanted !== null) {
        if (Math.abs(window.scrollY - wanted) > 3) {
          window.scrollTo({ top: wanted, behavior: "instant" });
          stable = 0;
        } else stable += 1;
        if (stable >= 20) return;
      }
      if (frames-- > 0) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const distance = Math.abs(first - window.scrollY) / window.innerHeight;
  if (options.instant || prefersReducedMotion() || !cover) return go();
  if (distance < VEIL_DISTANCE) {
    window.scrollTo({ top: first, behavior: "smooth" });
    return;
  }
  gsap.killTweensOf(cover);
  gsap.to(cover, { opacity: 1, duration: 0.28, ease: "power2.in", onComplete: () => { go(); gsap.to(cover, { opacity: 0, duration: 0.7, delay: 0.25, ease: "power2.out" }); } });
}

/** Resolve um `#hash` de URL para navegação (`#galerie`, `#produto-croissant`). */
export function navigateToHash(hash: string, options: NavigateOptions = {}) {
  const value = hash.replace(/^#/, "");
  if (isNavId(value)) navigateTo(value, options);
  else if (value.startsWith("produto-")) navigateToProduct(value.slice("produto-".length), options);
}
