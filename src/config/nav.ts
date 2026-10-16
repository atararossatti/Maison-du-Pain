export type NavId = "inicio" | "produtos" | "catalogo" | "atelier" | "visite";

export interface NavItem {
  id: NavId;
  label: string;
  /** Legenda curta em francês, mostrada no menu de tela cheia. */
  french: string;
  /** Elemento que marca o início da seção (`data-nav`). Vazio nos itens que levam a outra página (`href`). */
  selector: string;
  /** Página própria (rota): o item leva a ela em vez de rolar até uma seção da página inicial. */
  href?: string;
  /** Placeholder da cena sob demanda, usado enquanto o alvo ainda não foi montado. */
  lazy?: string;
  /** Telas (svh) abaixo do topo do alvo onde o scroll pousa. */
  land?: number;
  /** Telas (svh) de antecedência: a seção já conta como ativa quando o alvo está a esta distância do topo. */
  lead: number;
}

export const NAV: readonly NavItem[] = [
  { id: "inicio", label: "Início", french: "bienvenue", selector: "[data-scene='awakening']", lead: 0 },
  { id: "produtos", label: "Nossos Produtos", french: "nos créations", selector: "[data-nav='produtos']", lazy: "flavors", lead: 0.85 },
  { id: "atelier", label: "Nosso Atelier", french: "notre atelier", selector: "[data-nav='atelier']", lead: 0.1 },
  { id: "visite", label: "Visite-nos", french: "venez nous voir", selector: "[data-nav='visite']", lazy: "return", land: 4.9, lead: 0 },
  { id: "catalogo", label: "Catálogo", french: "le catalogue", selector: "", href: "/catalogo", lead: 0 },
];

export const isNavId = (value: string): value is NavId => NAV.some((item) => item.id === value);
