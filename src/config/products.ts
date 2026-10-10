import type { PhotoId } from "./photos";

export type ProductId =
  | "croissant" | "pain-au-chocolat" | "baguette" | "levain" | "cinnamon-roll" | "cafe"
  | "sonho" | "gateau-chocolat" | "gateau-moelleux" | "muffins" | "biscuits" | "burger-maison";

export type CategoryId = "viennoiseries" | "pains" | "patisseries" | "cafes";

export interface Category {
  id: CategoryId;
  name: string;
  french: string;
  blurb: string;
  /** Fotografia que representa a categoria no menu (quando o produto escolhido não tem foto própria). */
  cover: PhotoId;
  /** Aviso mostrado sobre a capa quando ela não retrata a categoria literalmente. */
  coverNote?: string;
}

export const CATEGORIES: readonly Category[] = [
  { id: "viennoiseries", name: "Viennoiseries", french: "le petit-déjeuner des rêves", blurb: "Massas folhadas e fermentadas, douradas na hora.", cover: "croissants" },
  { id: "pains", name: "Pains", french: "la mie et la croûte", blurb: "Casca estalada, miolo macio e fermentação paciente.", cover: "pains" },
  { id: "patisseries", name: "Pâtisseries", french: "douceurs de la maison", blurb: "Bolos, muffins e biscoitos feitos aos poucos.", cover: "gateau-chocolat" },
  { id: "cafes", name: "Cafés", french: "un café, s'il vous plaît", blurb: "Grãos selecionados para acompanhar cada fornada.", cover: "gateau-chocolat", coverNote: "Para acompanhar o café" },
];

export interface Product {
  id: ProductId;
  category: CategoryId;
  /** Fotografia real do produto; sem ela a seção usa a ilustração própria. */
  photo?: PhotoId;
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
    category: "viennoiseries",
    photo: "croissants",
    name: "Croissant artesanal",
    french: "mille feuilles de bonheur",
    description: "Manteiga, paciência e dezenas de camadas que estalam à primeira mordida.",
    interaction: "Mova o ponteiro sobre o croissant para afastar as camadas",
    rest: 0.15,
    details: { sabor: "Manteiga tostada e leve toque de mel", textura: "Crocante por fora, favo aerado por dentro", harmoniza: "Café com leite ou geleia de damasco" },
  },
  {
    id: "pain-au-chocolat",
    category: "viennoiseries",
    name: "Pain au chocolat",
    french: "un peu de douceur",
    description: "Duas barras de chocolate amargo enroladas em massa folhada ainda morna.",
    interaction: "Mova o ponteiro para deslizar as barras de chocolate",
    rest: 0.2,
    details: { sabor: "Chocolate amargo 55% e manteiga", textura: "Folhas finas que cedem ao chocolate macio", harmoniza: "Chá preto ou leite quente" },
  },
  {
    id: "baguette",
    category: "pains",
    photo: "pains",
    name: "Baguete francesa",
    french: "la tradition",
    description: "Casca fina e dourada, miolo alveolado e farinha de trigo de moagem lenta.",
    interaction: "Mova o ponteiro ao longo da baguete para revelar o miolo",
    rest: 0.3,
    details: { sabor: "Trigo, levíssima acidez natural", textura: "Casca quebradiça, miolo úmido e macio", harmoniza: "Queijo brie, manteiga com sal" },
  },
  {
    id: "levain",
    category: "pains",
    name: "Pão de fermentação natural",
    french: "le temps fait le pain",
    description: "Fermentado por dias, com casca escura, crocante e cheia de personalidade.",
    interaction: "Mova o ponteiro para girar o pão e ver os detalhes da casca",
    rest: 0.1,
    details: { sabor: "Acidez suave e notas de nozes", textura: "Casca espessa, miolo denso e brilhante", harmoniza: "Azeite, tomate maduro, sopas" },
  },
  {
    id: "cinnamon-roll",
    category: "viennoiseries",
    name: "Cinnamon roll",
    french: "tourbillon de canelle",
    description: "Espiral de massa macia, canela e cobertura cremosa que escorre devagar.",
    interaction: "Mova o ponteiro para girar o rolinho e espalhar a cobertura",
    rest: 0.25,
    details: { sabor: "Canela, açúcar mascavo e baunilha", textura: "Massa fofa em camadas espiraladas", harmoniza: "Café coado ou chocolate quente" },
  },
  {
    id: "cafe",
    category: "cafes",
    name: "Café especial",
    french: "un café, s'il vous plaît",
    description: "Grãos selecionados, torra média e uma xícara que perfuma o salão inteiro.",
    interaction: "Mova o ponteiro para soprar o vapor da xícara",
    rest: 0.5,
    details: { sabor: "Caramelo, cacau e frutas amarelas", textura: "Corpo médio, final longo e adocicado", harmoniza: "Qualquer pão da casa" },
  },
  {
    id: "sonho",
    category: "viennoiseries",
    photo: "sonho",
    name: "Sonho de creme",
    french: "un nuage de sucre",
    description: "Massa fofa e dourada, recheio de creme baunilha e uma nevasca de açúcar de confeiteiro.",
    interaction: "Mova o ponteiro para explorar a fotografia do sonho",
    rest: 0.5,
    details: { sabor: "Baunilha, creme e açúcar", textura: "Massa aérea, recheio sedoso", harmoniza: "Café coado ou leite morno" },
  },
  {
    id: "gateau-chocolat",
    category: "patisseries",
    photo: "gateau-chocolat",
    name: "Gâteau au chocolat",
    french: "le geste du chocolat",
    description: "Bolo úmido de chocolate, finalizado à mesa com um fio de calda ainda morna.",
    interaction: "Mova o ponteiro para explorar a fotografia do bolo",
    rest: 0.5,
    details: { sabor: "Cacau intenso e toque de caramelo", textura: "Miolo denso e úmido, calda sedosa", harmoniza: "Espresso ou chá preto" },
  },
  {
    id: "gateau-moelleux",
    category: "patisseries",
    photo: "gateau-moelleux",
    name: "Gâteau moelleux",
    french: "la mie tendre",
    description: "Miolo claro e macio sob uma crosta caramelizada que estala de leve.",
    interaction: "Mova o ponteiro para explorar a fotografia do bolo",
    rest: 0.5,
    details: { sabor: "Manteiga, baunilha e açúcar tostado", textura: "Crosta fina, miolo alveolado e úmido", harmoniza: "Frutas frescas e café com leite" },
  },
  {
    id: "muffins",
    category: "patisseries",
    photo: "muffins",
    name: "Muffins de frutas e nozes",
    french: "les muffins du soir",
    description: "Massa amanteigada com frutas vermelhas e uma cobertura crocante de nozes.",
    interaction: "Mova o ponteiro para explorar a fotografia dos muffins",
    rest: 0.5,
    details: { sabor: "Frutas vermelhas, nozes e baunilha", textura: "Topo crocante, miolo macio", harmoniza: "Chá preto ou café coado" },
  },
  {
    id: "biscuits",
    category: "patisseries",
    photo: "biscuits",
    name: "Biscoitos da casa",
    french: "les bocaux de la maison",
    description: "Aveia, manteiga e recheios cremosos, guardados em potes de vidro para levar à mesa.",
    interaction: "Mova o ponteiro para explorar a fotografia dos biscoitos",
    rest: 0.5,
    details: { sabor: "Aveia tostada, manteiga e doce de leite", textura: "Crocantes por fora, macios no recheio", harmoniza: "Leite quente ou café" },
  },
  {
    id: "burger-maison",
    category: "pains",
    photo: "burger-maison",
    name: "Burger da casa",
    french: "le pain fait la différence",
    description: "Pão macio de fermentação própria, cebola crocante e queijo derretido sobre o hambúrguer.",
    interaction: "Mova o ponteiro para explorar a fotografia do burger",
    rest: 0.5,
    details: { sabor: "Carne grelhada, queijo e cebola dourada", textura: "Pão fofo, recheio suculento e crocante", harmoniza: "Limonada ou cerveja artesanal" },
  },
];
