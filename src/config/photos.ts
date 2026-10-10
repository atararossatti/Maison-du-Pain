import generated from "./photos.generated.json";

export type PhotoId = keyof typeof generated;

export interface Photo {
  id: PhotoId;
  src: string;
  width: number;
  height: number;
  /** Miniatura borrada (data URI) para o carregamento progressivo do `next/image`. */
  blur: string;
  /** Cor média da fotografia, usada em fundos e véus de transição. */
  color: string;
  alt: string;
  /** Legenda curta, em francês, usada na galeria. */
  caption: string;
}

const TEXT: Record<PhotoId, { alt: string; caption: string }> = {
  croissants: { alt: "Cesta de arame forrada com papel e croissants dourados, com a padaria desfocada ao fundo.", caption: "La corbeille du matin" },
  pains: { alt: "Pilha de pães franceses dourados e brilhantes, com a casca estalada.", caption: "La fournée" },
  sonho: { alt: "Sonho recheado de creme, coberto de açúcar de confeiteiro, sobre uma superfície roxa polvilhada.", caption: "Un nuage de sucre" },
  "gateau-chocolat": { alt: "Mão regando calda de chocolate sobre uma fatia de bolo de chocolate, em prato de cerâmica.", caption: "Le geste du chocolat" },
  "gateau-moelleux": { alt: "Corte de um bolo fofo de miolo claro e alveolado, com a crosta caramelizada em primeiro plano.", caption: "La mie tendre" },
  muffins: { alt: "Muffins dourados com frutas vermelhas e nozes em forminhas turquesa, em luz baixa.", caption: "Les muffins du soir" },
  biscuits: { alt: "Potes de vidro e latas com biscoitos de aveia e amanteigados, e biscoitos recheados à frente.", caption: "Les bocaux de la maison" },
  vitrine: { alt: "Vitrine da confeitaria com rolinhos de canela, tortas e doces sobre suportes, sob luzes quentes.", caption: "La vitrine" },
  "burger-maison": { alt: "Hambúrguer artesanal em pão macio, com cebola crocante e queijo derretido, sobre madeira.", caption: "Le burger de la maison" },
  "burger-rustique": { alt: "Hambúrgueres em pães rústicos, um deles de casca escura, com molho cremoso escorrendo.", caption: "Le pain rustique" },
};

export const PHOTOS = Object.fromEntries(
  (Object.keys(generated) as PhotoId[]).map((id) => {
    const g = generated[id];
    const photo: Photo = { id, src: `/fotos/${id}.webp`, width: g.width, height: g.height, blur: g.blur, color: g.color, ...TEXT[id] };
    return [id, photo];
  }),
) as Record<PhotoId, Photo>;
