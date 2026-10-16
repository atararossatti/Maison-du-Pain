import { PHOTOS, type PhotoId } from "./photos";
import productPhotos from "./product-photos.generated.json";

/**
 * Fotografia de produto, fornecida pelo autor do projeto (`imagens/`) e registrada em `docs/IMAGE_CREDITS.md`.
 * Cada foto só entra no produto que ela mostra; produto sem foto fica sem imagem (e fora do catálogo, ver `REQUIRE_IMAGE`).
 */
export interface ProductImage {
  /** Caminho público (`/images/products/...` ou `/fotos/...`). */
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Miniatura borrada (data URI) para o carregamento progressivo. */
  blur?: string;
  /** Cor média, usada no fundo enquanto a imagem carrega. */
  color?: string;
  /** `object-position` do enquadramento nos cartões (padrão: centro). */
  focus?: string;
}

const fromPhoto = (id: PhotoId, alt?: string): ProductImage => {
  const photo = PHOTOS[id];
  return { src: photo.src, alt: alt ?? photo.alt, width: photo.width, height: photo.height, blur: photo.blur, color: photo.color };
};

/** Enquadramento individual (só onde o recorte central do cartão cortaria o produto). */
const FOCUS: Readonly<Record<string, string>> = {
  "baguette-traditionnelle": "30% 50%",
  cheesecake: "38% 50%",
  entremets: "72% 50%",
  macarons: "40% 50%",
  "tarte-tatin": "40% 50%",
};

/** Fotos geradas por `scripts/optimize-products.mjs`, uma por produto. */
const FROM_FILES: Record<string, readonly ProductImage[]> = Object.fromEntries(
  Object.entries(productPhotos as Record<string, { width: number; height: number; blur: string; color: string }>).map(([id, photo]) => [
    id,
    [{ src: `/images/products/${id}.webp`, alt: "", width: photo.width, height: photo.height, blur: photo.blur, color: photo.color, focus: FOCUS[id] }],
  ]),
);

/** Fotos antigas de `imagens/`, já otimizadas por `scripts/optimize-photos.mjs`. */
const LEGACY: Record<string, readonly ProductImage[]> = {
  "croissant-tradicional": [fromPhoto("croissants")],
  sonho: [fromPhoto("sonho")],
  "gateau-au-chocolat": [fromPhoto("gateau-chocolat")],
  "gateau-moelleux": [fromPhoto("gateau-moelleux")],
  muffins: [fromPhoto("muffins")],
  "biscoitos-amanteigados": [fromPhoto("biscuits")],
  "burger-artesanal": [fromPhoto("burger-maison"), fromPhoto("burger-rustique")],
};

/** Imagens de cada produto. O texto alternativo é o nome do produto (preenchido em `catalog.ts`). */
export const IMAGES: Readonly<Record<string, readonly ProductImage[]>> = { ...FROM_FILES, ...LEGACY };
