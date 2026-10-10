export type NavId = "inicio" | "produtos" | "historia" | "atelier" | "galerie" | "visite";

export interface NavItem {
  id: NavId;
  label: string;
  /** Legenda curta em francês, mostrada no menu de tela cheia. */
  french: string;
  /** Elemento que marca o início da seção (`data-nav`). */
  selector: string;
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
  { id: "historia", label: "Nossa História", french: "notre histoire", selector: "[data-nav='historia']", lead: 0.5 },
  { id: "atelier", label: "Nosso Atelier", french: "notre atelier", selector: "[data-nav='atelier']", lead: 0.1 },
  { id: "galerie", label: "Galerie", french: "la galerie", selector: "[data-nav='galerie']", lead: 0.5 },
  { id: "visite", label: "Visite-nos", french: "venez nous voir", selector: "[data-nav='visite']", lazy: "return", land: 4.9, lead: 0 },
];

export const isNavId = (value: string): value is NavId => NAV.some((item) => item.id === value);
