import type { PhotoId } from "./photos";

/** Telas de scroll em que o Atelier fica fixo. */
export const ATELIER_SCREENS = 6;

export interface AtelierStep {
  photo: PhotoId;
  /** `window`: fotografia vertical numa janela ao lado do texto (fundo é a própria foto, borrada). `bleed`: ocupa a tela toda. */
  mode: "window" | "bleed";
  numeral: string;
  french: string;
  title: string;
  text: string;
}

export const ATELIER_STEPS: readonly AtelierStep[] = [
  { photo: "pains", mode: "window", numeral: "01", french: "la fournée", title: "A fornada", text: "Antes do sol o forno já está aceso. Cada pão sai quando a casca estala e o miolo respira." },
  { photo: "gateau-chocolat", mode: "window", numeral: "02", french: "le geste", title: "O gesto", text: "Calda, cobertura, acabamento: o último passo de cada doce é sempre feito à mão." },
  { photo: "gateau-moelleux", mode: "bleed", numeral: "03", french: "la mie", title: "O miolo", text: "Alveolado, úmido e macio sob uma crosta caramelizada que cede ao primeiro toque." },
  { photo: "sonho", mode: "bleed", numeral: "04", french: "le sucre", title: "O açúcar", text: "Uma nevasca de açúcar de confeiteiro encerra a fornada e abre a vitrine." },
];

/** Fases do percurso (frações do progresso). */
export const ATELIER_PHASE = { intro: 0.07, outro: 0.06 } as const;
