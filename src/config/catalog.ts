import { PHOTOS, type PhotoId } from "./photos";
import { IMAGES, type ProductImage } from "./catalog-images";

/**
 * Catálogo DEMONSTRATIVO da Maison du Pain (marca fictícia): produtos, textos e preços são ilustrativos.
 * Não há informação nutricional, de alergênicos ou certificações: nada disso é afirmado aqui.
 * Os dados ficam só neste arquivo; as fotografias vêm de `catalog-images.ts`.
 */

export type CategoryId = "viennoiseries" | "paes" | "patisserie" | "doces" | "salgados" | "cafeteria";

export interface CatalogCategory {
  id: CategoryId;
  name: string;
  french: string;
  blurb: string;
  /** Fotografia que representa a categoria no menu (`photos.ts`). */
  cover: PhotoId;
  /** Produto cuja fotografia serve de capa no lugar de `cover` (quando existe uma foto que mostra a categoria de fato). */
  coverProduct?: string;
  /** Aviso mostrado sobre a capa quando ela não retrata a categoria literalmente. */
  coverNote?: string;
}

const ALL_CATEGORIES: readonly CatalogCategory[] = [
  { id: "viennoiseries", name: "Viennoiseries", french: "le petit-déjeuner des rêves", blurb: "Massas folhadas e fermentadas, douradas na hora.", cover: "croissants" },
  { id: "paes", name: "Pães artesanais", french: "la mie et la croûte", blurb: "Casca estalada, miolo macio e fermentação paciente.", cover: "pains" },
  { id: "patisserie", name: "Pâtisserie", french: "douceurs de la maison", blurb: "Tortas, bolos e entremets montados à mão.", cover: "gateau-chocolat" },
  { id: "doces", name: "Doces e biscoitos", french: "les petits plaisirs", blurb: "Macarons, madeleines e biscoitos para levar para casa.", cover: "biscuits" },
  { id: "salgados", name: "Sanduíches e salgados", french: "à table", blurb: "Croques, quiches e sanduíches para a hora do almoço.", cover: "burger-maison" },
  { id: "cafeteria", name: "Cafeteria", french: "un café, s'il vous plaît", blurb: "Cafés, chocolate quente e chás para acompanhar.", cover: "muffins", coverProduct: "cappuccino" },
];

export type ProductTag = "Clássico" | "Assinatura da casa" | "Novidade" | "Servido quente";
export type Availability = "disponivel" | "sob-encomenda";

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  disponivel: "Disponível (demonstração)",
  "sob-encomenda": "Sob encomenda (demonstração)",
};

export interface CatalogProduct {
  /** Identificador único e estável; também é o endereço da página (`/catalogo/[id]`). */
  id: string;
  name: string;
  category: CategoryId;
  /** Legenda manuscrita em francês (detalhe artístico). */
  french: string;
  short: string;
  description: string;
  /** Preço demonstrativo, em centavos de BRL (evita erros de ponto flutuante). */
  priceCents: number;
  featured?: boolean;
  tags?: readonly ProductTag[];
  availability: Availability;
  /** Só para pratos cuja composição é a própria definição do prato; sempre rotulada como ilustrativa. */
  ingredients?: readonly string[];
  /** Fotografias do produto (pasta `imagens/`); vazio só enquanto nenhuma foto existe. */
  images: readonly ProductImage[];
}

type Draft = Omit<CatalogProduct, "images" | "availability"> & { availability?: Availability };

const reais = (value: number) => Math.round(value * 100);

const DRAFTS: readonly Draft[] = [
  // ——— Viennoiseries
  { id: "croissant-tradicional", name: "Croissant tradicional", category: "viennoiseries", french: "le grand classique", short: "Folhado dourado, casca que estala e miolo em camadas.", description: "O clássico da casa: massa folhada laminada com manteiga, assada até a crosta dourar. Perfeito sozinho ou com café.", priceCents: reais(14), featured: true, tags: ["Clássico"] },
  { id: "croissant-de-amendoas", name: "Croissant de amêndoas", category: "viennoiseries", french: "aux amandes", short: "Folhado coberto de lâminas de amêndoa e açúcar.", description: "Croissant generoso, finalizado com lâminas de amêndoa tostadas e um toque de açúcar que caramelizou no forno.", priceCents: reais(18), featured: true, tags: ["Assinatura da casa"] },
  { id: "pain-au-chocolat", name: "Pain au chocolat", category: "viennoiseries", french: "un peu de douceur", short: "Duas barras de chocolate amargo em massa folhada morna.", description: "Massa folhada enrolada sobre barras de chocolate amargo, que derretem ao primeiro corte.", priceCents: reais(16), featured: true, tags: ["Clássico"] },
  { id: "brioche", name: "Brioche", category: "viennoiseries", french: "tendre et doré", short: "Massa macia, amanteigada e levemente adocicada.", description: "Miolo fofo e casca brilhante. Ótimo no café da manhã, com geleia ou simplesmente morno.", priceCents: reais(13) },
  { id: "pain-aux-raisins", name: "Pain aux raisins", category: "viennoiseries", french: "en spirale", short: "Espiral de massa folhada com creme e uvas-passas.", description: "Espiral folhada, recheada com creme e uvas-passas e finalizada com uma camada brilhante.", priceCents: reais(15) },
  { id: "cinnamon-roll", name: "Cinnamon roll", category: "viennoiseries", french: "tourbillon de canelle", short: "Espiral de massa macia, canela e cobertura cremosa.", description: "Rolinho macio com canela em todas as voltas e cobertura cremosa que escorre devagar.", priceCents: reais(17), tags: ["Servido quente"] },
  { id: "croissant-recheado", name: "Croissant recheado", category: "viennoiseries", french: "gourmand", short: "Croissant aberto e recheado com creme.", description: "O croissant tradicional cortado ao meio e recheado com creme na hora de servir.", priceCents: reais(19), tags: ["Novidade"] },
  { id: "sonho", name: "Sonho", category: "viennoiseries", french: "un nuage de sucre", short: "Massa macia recheada de creme e coberta de açúcar.", description: "Sonho fofo, recheado com creme e finalizado com uma nevasca de açúcar de confeiteiro.", priceCents: reais(12), tags: ["Clássico"] },
  { id: "chausson-aux-pommes", name: "Chausson aux pommes", category: "viennoiseries", french: "feuilleté aux pommes", short: "Folhado em meia-lua com recheio de maçã.", description: "Meia-lua de massa folhada recheada com maçã cozida, dourada e crocante por fora.", priceCents: reais(16) },

  // ——— Pães artesanais
  { id: "baguette-traditionnelle", name: "Baguette traditionnelle", category: "paes", french: "la baguette", short: "Casca estalada e miolo alveolado.", description: "A baguete de todos os dias: casca fina e crocante, miolo macio e cheiro de forno.", priceCents: reais(12), featured: true, tags: ["Clássico"] },
  { id: "pain-de-campagne", name: "Pain de campagne", category: "paes", french: "le pain de la campagne", short: "Pão rústico de casca grossa e miolo denso.", description: "Pão do campo, de casca escura e miolo úmido. Combina com queijos, patês e uma boa manteiga.", priceCents: reais(28) },
  { id: "pain-au-levain", name: "Pain au levain", category: "paes", french: "le temps fait le pain", short: "Pão de fermentação natural, casca escura e crocante.", description: "Fermentado por muitas horas, com casca crocante, miolo aberto e um leve toque ácido.", priceCents: reais(32), featured: true, tags: ["Assinatura da casa"] },
  { id: "pao-integral", name: "Pão integral", category: "paes", french: "complet", short: "Miolo macio e casca rústica, feito com farinha integral.", description: "Pão de sabor marcante e textura macia, ótimo para sanduíches e torradas.", priceCents: reais(24) },
  { id: "focaccia", name: "Focaccia", category: "paes", french: "à l'huile d'olive", short: "Pão achatado, macio e regado com azeite.", description: "Massa alta e macia, com a superfície dourada e brilhante de azeite e ervas.", priceCents: reais(22) },
  { id: "pao-de-nozes", name: "Pão de nozes", category: "paes", french: "aux noix", short: "Miolo macio com pedaços crocantes de nozes.", description: "Pão rústico com nozes no miolo, ótimo com queijos e geleias.", priceCents: reais(30) },
  { id: "pao-de-centeio", name: "Pão de centeio", category: "paes", french: "au seigle", short: "Miolo denso e sabor marcante, de casca escura.", description: "Pão de centeio de miolo firme e casca escura, para fatias finas com manteiga e frios.", priceCents: reais(26) },
  { id: "fougasse", name: "Fougasse", category: "paes", french: "en feuille", short: "Pão provençal recortado, crocante e aromático.", description: "Pão em formato de folha, com cortes que deixam a casca ainda mais crocante.", priceCents: reais(20), tags: ["Novidade"] },

  // ——— Pâtisserie
  { id: "eclair-de-chocolate", name: "Éclair de chocolate", category: "patisserie", french: "l'éclair au chocolat", short: "Massa choux recheada de creme e coberta de chocolate.", description: "Massa choux leve e crocante, recheada com creme e coberta com chocolate brilhante.", priceCents: reais(19), featured: true, tags: ["Clássico"] },
  { id: "mille-feuille", name: "Mille-feuille", category: "patisserie", french: "mille feuilles", short: "Camadas de massa folhada crocante e creme.", description: "Camadas finas e crocantes de massa folhada intercaladas com creme, com cobertura de açúcar.", priceCents: reais(24) },
  { id: "tarte-au-citron", name: "Tarte au citron", category: "patisserie", french: "acidulée", short: "Massa amanteigada com creme de limão.", description: "Base crocante e amanteigada com creme de limão cítrico e uma cobertura leve.", priceCents: reais(22) },
  { id: "tarte-aux-fraises", name: "Tarte aux fraises", category: "patisserie", french: "fraîche du jour", short: "Massa crocante, creme e morangos frescos.", description: "Torta de massa crocante com creme e morangos frescos, finalizada com brilho de geleia.", priceCents: reais(26), featured: true, tags: ["Assinatura da casa"] },
  { id: "paris-brest", name: "Paris-Brest", category: "patisserie", french: "en couronne", short: "Coroa de massa choux com creme de avelã.", description: "Coroa de massa choux com amêndoas laminadas e recheio cremoso com sabor de avelã.", priceCents: reais(25) },
  { id: "opera-cake", name: "Opera cake", category: "patisserie", french: "l'opéra", short: "Camadas de biscuit, café e ganache de chocolate.", description: "Camadas finas de biscuit embebido em café, creme e ganache, com brilho de chocolate.", priceCents: reais(27) },
  { id: "cheesecake", name: "Cheesecake", category: "patisserie", french: "onctueux", short: "Creme de queijo sobre base crocante.", description: "Fatia cremosa sobre base crocante de biscoito, com calda de frutas vermelhas.", priceCents: reais(23) },
  { id: "entremets", name: "Entremets", category: "patisserie", french: "en couches", short: "Sobremesa de camadas, mousse e cobertura espelhada.", description: "Camadas de mousse, biscuit e recheio, com acabamento liso e brilhante.", priceCents: reais(29), tags: ["Novidade"] },
  { id: "tarte-tatin", name: "Tarte Tatin", category: "patisserie", french: "renversée", short: "Torta de maçãs caramelizadas virada ao contrário.", description: "Maçãs caramelizadas sobre massa folhada, servida virada e ainda morna.", priceCents: reais(24), tags: ["Servido quente"] },
  { id: "gateau-au-chocolat", name: "Gâteau au chocolat", category: "patisserie", french: "le geste du chocolat", short: "Fatia de bolo de chocolate com calda brilhante.", description: "Bolo de chocolate úmido, servido em fatia e finalizado com calda de chocolate.", priceCents: reais(21), featured: true },
  { id: "gateau-moelleux", name: "Gâteau moelleux", category: "patisserie", french: "la mie tendre", short: "Bolo fofo de miolo alveolado e crosta caramelizada.", description: "Bolo macio e úmido, de crosta levemente caramelizada, para o café da tarde.", priceCents: reais(18) },

  // ——— Doces e biscoitos
  { id: "macarons", name: "Macarons (caixa com 6)", category: "doces", french: "la boîte", short: "Casquinhas delicadas com recheio cremoso.", description: "Seis macarons de sabores sortidos, com casquinha lisa e recheio cremoso.", priceCents: reais(36), featured: true, tags: ["Assinatura da casa"] },
  { id: "madeleines", name: "Madeleines", category: "doces", french: "en coquille", short: "Bolinhos em formato de concha, macios e amanteigados.", description: "Bolinhos tradicionais em forma de concha, macios por dentro e dourados por fora.", priceCents: reais(18) },
  { id: "financiers", name: "Financiers", category: "doces", french: "aux amandes", short: "Bolinhos de amêndoa, úmidos e amanteigados.", description: "Pequenos bolos retangulares de amêndoa, com bordas douradas e miolo macio.", priceCents: reais(20) },
  { id: "cookies", name: "Cookies", category: "doces", french: "croquants dehors", short: "Crocantes por fora, macios por dentro.", description: "Cookies grandes, crocantes nas bordas e macios no centro.", priceCents: reais(12) },
  { id: "brownies", name: "Brownies", category: "doces", french: "fondant", short: "Chocolate intenso, úmido e denso.", description: "Quadrado de chocolate denso e úmido, com a casquinha fina característica.", priceCents: reais(15) },
  { id: "palmiers", name: "Palmiers", category: "doces", french: "feuilletés", short: "Folhados açucarados em formato de coração.", description: "Massa folhada açucarada e caramelizada, crocante e leve.", priceCents: reais(14) },
  { id: "biscoitos-amanteigados", name: "Biscoitos amanteigados", category: "doces", french: "les bocaux de la maison", short: "Biscoitos de manteiga e aveia para levar em potes.", description: "Biscoitos amanteigados e de aveia, para levar para casa ou servir com o café.", priceCents: reais(16) },
  { id: "canele", name: "Canelé", category: "doces", french: "de Bordeaux", short: "Casca caramelizada e centro macio e cremoso.", description: "Pequeno bolo canelado com casca escura e crocante e interior macio.", priceCents: reais(14), tags: ["Novidade"] },
  { id: "muffins", name: "Muffins", category: "doces", french: "les muffins du soir", short: "Muffins dourados com frutas vermelhas e nozes.", description: "Muffins altos e macios, com frutas vermelhas e nozes por cima.", priceCents: reais(13) },

  // ——— Sanduíches e salgados
  { id: "croque-monsieur", name: "Croque monsieur", category: "salgados", french: "gratiné", short: "Sanduíche quente de presunto e queijo gratinado.", description: "Sanduíche clássico, grelhado e gratinado, servido quente.", priceCents: reais(29), tags: ["Clássico", "Servido quente"], ingredients: ["Pão de forma", "Presunto", "Queijo", "Molho bechamel"] },
  { id: "croque-madame", name: "Croque madame", category: "salgados", french: "avec un œuf", short: "Croque monsieur coroado com um ovo.", description: "A versão do croque monsieur com um ovo por cima.", priceCents: reais(32), tags: ["Servido quente"], ingredients: ["Pão de forma", "Presunto", "Queijo", "Molho bechamel", "Ovo"] },
  { id: "quiche-lorraine", name: "Quiche Lorraine", category: "salgados", french: "de Lorraine", short: "Torta de massa quebradiça, bacon e creme de ovos.", description: "Fatia de quiche com massa quebradiça e recheio cremoso.", priceCents: reais(26), tags: ["Clássico"], ingredients: ["Massa quebradiça", "Bacon", "Ovos", "Creme de leite"] },
  { id: "sanduiche-de-baguete", name: "Sanduíche de baguete", category: "salgados", french: "jambon-beurre", short: "Baguete crocante com recheio simples e bem feito.", description: "Baguete fresca, cortada ao meio e recheada na hora.", priceCents: reais(27) },
  { id: "sanduiche-de-croissant", name: "Sanduíche de croissant", category: "salgados", french: "salé", short: "Croissant folhado em versão salgada.", description: "Croissant aberto e recheado, com a casca folhada e o recheio saboroso.", priceCents: reais(25) },
  { id: "torta-salgada", name: "Torta salgada", category: "salgados", french: "du jour", short: "Fatia de torta salgada de massa crocante.", description: "Torta de massa crocante com recheio do dia, servida em fatia.", priceCents: reais(24) },
  { id: "burger-artesanal", name: "Burger artesanal", category: "salgados", french: "le burger de la maison", short: "Hambúrguer em pão macio, com queijo derretido.", description: "Hambúrguer suculento em pão macio, com queijo derretido e cebola crocante.", priceCents: reais(42), featured: true, tags: ["Assinatura da casa", "Servido quente"] },

  // ——— Cafeteria
  { id: "espresso", name: "Espresso", category: "cafeteria", french: "serré", short: "Café curto, intenso e aromático.", description: "Dose curta de café encorpado, com creme dourado por cima.", priceCents: reais(8), tags: ["Servido quente"] },
  { id: "cappuccino", name: "Cappuccino", category: "cafeteria", french: "crémeux", short: "Espresso com leite vaporizado e espuma cremosa.", description: "Espresso, leite vaporizado e uma espuma cremosa por cima.", priceCents: reais(14), tags: ["Servido quente"] },
  { id: "latte", name: "Latte", category: "cafeteria", french: "doux", short: "Espresso com bastante leite vaporizado.", description: "Café suave, com mais leite e textura aveludada.", priceCents: reais(15), tags: ["Servido quente"] },
  { id: "mocha", name: "Mocha", category: "cafeteria", french: "au chocolat", short: "Café, chocolate e leite vaporizado.", description: "Espresso com chocolate e leite vaporizado, para quem gosta de café doce.", priceCents: reais(17), tags: ["Servido quente"] },
  { id: "chocolat-chaud", name: "Chocolate quente", category: "cafeteria", french: "chocolat chaud", short: "Chocolate cremoso e bem quente.", description: "Chocolate derretido com leite, cremoso e servido bem quente.", priceCents: reais(16), tags: ["Servido quente"] },
  { id: "cha", name: "Chá", category: "cafeteria", french: "l'heure du thé", short: "Seleção de chás servidos em bule.", description: "Chá servido quente em bule, para acompanhar os doces.", priceCents: reais(12), tags: ["Servido quente"] },
];

/** Todos os produtos cadastrados, com ou sem fotografia (o produto sem foto fica fora do catálogo). */
export const ALL_PRODUCTS: readonly CatalogProduct[] = DRAFTS.map((draft) => ({
  ...draft,
  availability: draft.availability ?? "disponivel",
  images: (IMAGES[draft.id] ?? []).map((image) => ({ ...image, alt: image.alt || draft.name })),
}));

/**
 * Regra do projeto: nenhum produto aparece no site sem imagem (fotografia do autor do projeto; ver `docs/IMAGE_CREDITS.md`). Nunca se mostra a imagem de outro alimento nem um quadro vazio.
 */
export const REQUIRE_IMAGE = true;
export const PRODUCTS: readonly CatalogProduct[] = ALL_PRODUCTS.filter((product) => !REQUIRE_IMAGE || product.images.length > 0);

/** Categorias que têm ao menos um produto à mostra (categoria vazia não aparece em filtros nem menus). */
export const CATEGORIES: readonly CatalogCategory[] = ALL_CATEGORIES.filter((category) => PRODUCTS.some((product) => product.category === category.id));

const BY_ID = new Map(PRODUCTS.map((product) => [product.id, product]));

/** Capa da categoria nos menus: a foto do produto escolhido em `coverProduct` ou, sem ela, a fotografia `cover`. */
export function coverOf(category: CatalogCategory): { src: string; color: string; blur?: string } {
  const own = category.coverProduct ? getProduct(category.coverProduct)?.images[0] : undefined;
  if (own) return { src: own.src, color: own.color ?? "#d8ad65", blur: own.blur };
  const photo = PHOTOS[category.cover];
  return { src: photo.src, color: photo.color, blur: photo.blur };
}

export const getProduct = (id: string): CatalogProduct | undefined => BY_ID.get(id);
export const getCategory = (id: string): CatalogCategory | undefined => CATEGORIES.find((category) => category.id === id);
export const isCategoryId = (value: string | null | undefined): value is CategoryId => CATEGORIES.some((category) => category.id === value);
export const productsOf = (category: CategoryId) => PRODUCTS.filter((product) => product.category === category);
export const FEATURED = PRODUCTS.filter((product) => product.featured);

/** Mesma categoria primeiro, depois os destaques: nunca repete o próprio produto. */
export function relatedTo(product: CatalogProduct, count = 4): CatalogProduct[] {
  const same = PRODUCTS.filter((other) => other.id !== product.id && other.category === product.category);
  const rest = FEATURED.filter((other) => other.id !== product.id && other.category !== product.category);
  return [...same, ...rest].slice(0, count);
}

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const formatBRL = (cents: number) => BRL.format(cents / 100);

/** Minúsculas e sem acentos: "eclair" encontra "Éclair". */
export const normalize = (text: string) => text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();

export type SortKey = "destaques" | "preco-asc" | "preco-desc" | "nome-asc" | "nome-desc";
export const SORT_LABEL: Record<SortKey, string> = {
  destaques: "Em destaque",
  "preco-asc": "Menor preço",
  "preco-desc": "Maior preço",
  "nome-asc": "Nome (A–Z)",
  "nome-desc": "Nome (Z–A)",
};
export const isSortKey = (value: string | null | undefined): value is SortKey => value != null && value in SORT_LABEL;

export interface CatalogQuery {
  category: CategoryId | null;
  text: string;
  featuredOnly: boolean;
  sort: SortKey;
}

export function queryCatalog({ category, text, featuredOnly, sort }: CatalogQuery): CatalogProduct[] {
  const needle = normalize(text);
  const list = PRODUCTS.filter((product) => {
    if (category && product.category !== category) return false;
    if (featuredOnly && !product.featured) return false;
    if (!needle) return true;
    const categoryName = getCategory(product.category)?.name ?? "";
    return normalize(`${product.name} ${product.short} ${categoryName} ${product.tags?.join(" ") ?? ""}`).includes(needle);
  });
  const byName = (a: CatalogProduct, b: CatalogProduct) => a.name.localeCompare(b.name, "pt-BR");
  switch (sort) {
    case "preco-asc":
      return list.sort((a, b) => a.priceCents - b.priceCents || byName(a, b));
    case "preco-desc":
      return list.sort((a, b) => b.priceCents - a.priceCents || byName(a, b));
    case "nome-asc":
      return list.sort(byName);
    case "nome-desc":
      return list.sort((a, b) => byName(b, a));
    default:
      // Destaques primeiro; dentro de cada grupo, a ordem original do catálogo.
      return list.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  }
}
