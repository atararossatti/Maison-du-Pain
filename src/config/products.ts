export type ProductId = "croissant" | "pain-au-chocolat" | "baguette" | "levain" | "cinnamon-roll" | "cafe";

export interface Product {
  id: ProductId;
  name: string;
  /** Legenda manuscrita em francês, usada como detalhe artístico. */
  french: string;
  description: string;
  /** Como interagir; também é o nome acessível do controle. */
  interaction: string;
  /** Valor de repouso (0–1) da interação, quando o ponteiro sai ou antes do primeiro toque. */
  rest: number;
  /** Texto ilustrativo do painel de detalhes. Todos os dados são fictícios. */
  details: { sabor: string; textura: string; harmoniza: string };
}

export const PRODUCTS: readonly Product[] = [
  {
    id: "croissant",
    name: "Croissant artesanal",
    french: "mille feuilles de bonheur",
    description: "Manteiga, paciência e dezenas de camadas que estalam à primeira mordida.",
    interaction: "Mova o ponteiro sobre o croissant para afastar as camadas",
    rest: 0.15,
    details: { sabor: "Manteiga tostada e leve toque de mel", textura: "Crocante por fora, favo aerado por dentro", harmoniza: "Café com leite ou geleia de damasco" },
  },
  {
    id: "pain-au-chocolat",
    name: "Pain au chocolat",
    french: "un peu de douceur",
    description: "Duas barras de chocolate amargo enroladas em massa folhada ainda morna.",
    interaction: "Mova o ponteiro para deslizar as barras de chocolate",
    rest: 0.2,
    details: { sabor: "Chocolate amargo 55% e manteiga", textura: "Folhas finas que cedem ao chocolate macio", harmoniza: "Chá preto ou leite quente" },
  },
  {
    id: "baguette",
    name: "Baguete francesa",
    french: "la tradition",
    description: "Casca fina e dourada, miolo alveolado e farinha de trigo de moagem lenta.",
    interaction: "Mova o ponteiro ao longo da baguete para revelar o miolo",
    rest: 0.3,
    details: { sabor: "Trigo, levíssima acidez natural", textura: "Casca quebradiça, miolo úmido e macio", harmoniza: "Queijo brie, manteiga com sal" },
  },
  {
    id: "levain",
    name: "Pão de fermentação natural",
    french: "le temps fait le pain",
    description: "Fermentado por dias, com casca escura, crocante e cheia de personalidade.",
    interaction: "Mova o ponteiro para girar o pão e ver os detalhes da casca",
    rest: 0.1,
    details: { sabor: "Acidez suave e notas de nozes", textura: "Casca espessa, miolo denso e brilhante", harmoniza: "Azeite, tomate maduro, sopas" },
  },
  {
    id: "cinnamon-roll",
    name: "Cinnamon roll",
    french: "tourbillon de canelle",
    description: "Espiral de massa macia, canela e cobertura cremosa que escorre devagar.",
    interaction: "Mova o ponteiro para girar o rolinho e espalhar a cobertura",
    rest: 0.25,
    details: { sabor: "Canela, açúcar mascavo e baunilha", textura: "Massa fofa em camadas espiraladas", harmoniza: "Café coado ou chocolate quente" },
  },
  {
    id: "cafe",
    name: "Café especial",
    french: "un café, s'il vous plaît",
    description: "Grãos selecionados, torra média e uma xícara que perfuma o salão inteiro.",
    interaction: "Mova o ponteiro para soprar o vapor da xícara",
    rest: 0.5,
    details: { sabor: "Caramelo, cacau e frutas amarelas", textura: "Corpo médio, final longo e adocicado", harmoniza: "Qualquer pão da casa" },
  },
];