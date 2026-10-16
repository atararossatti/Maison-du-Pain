import Image from "next/image";
import { getCategory, type CatalogProduct, type CategoryId } from "@/config/catalog";
import type { ProductImage } from "@/config/catalog-images";

const TINT: Record<CategoryId, string> = {
  viennoiseries: "from-gold/45 via-blush to-butter",
  paes: "from-caramel/40 via-butter to-cream",
  patisserie: "from-rose/55 via-blush to-cream",
  doces: "from-crust/30 via-gold/30 to-cream",
  salgados: "from-olive/30 via-butter to-cream",
  cafeteria: "from-chocolate/30 via-caramel/30 to-butter",
};

interface ProductPictureProps {
  product: CatalogProduct;
  /** Imagem específica (galeria); por padrão, a principal. */
  image?: ProductImage;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Só muda o quadro sem fotografia: miniatura (sem texto), cartão (padrão) ou destaque (página do produto). */
  variant?: "thumb" | "card" | "hero";
}

/**
 * Preenche o pai (`position: relative` com proporção fixa, então não há deslocamento de layout).
 * Sem fotografia verificada, mostra um quadro tipográfico da casa: nunca a foto de outro alimento.
 */
export function ProductPicture({ product, image, sizes, priority, className = "", variant = "card" }: ProductPictureProps) {
  const photo = image ?? product.images[0];
  if (photo) {
    return (
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder={photo.blur ? "blur" : "empty"}
        blurDataURL={photo.blur}
        draggable={false}
        className={`object-cover ${className}`}
        style={{ backgroundColor: photo.color, objectPosition: photo.focus }}
      />
    );
  }
  const category = getCategory(product.category);
  const letter = product.name.charAt(0);
  const ghost = "select-none font-display italic leading-none text-transparent [-webkit-text-stroke:1.5px_var(--color-caramel)]";
  if (variant === "thumb") {
    return (
      <div aria-hidden data-no-photo className={`absolute inset-0 grid place-items-center overflow-hidden bg-gradient-to-br ${TINT[product.category]} ${className}`}>
        <span className={`${ghost} text-5xl opacity-60`}>{letter}</span>
      </div>
    );
  }
  if (variant === "hero") {
    return (
      <div aria-hidden data-no-photo className={`absolute inset-0 grid place-items-center overflow-hidden bg-gradient-to-br ${TINT[product.category]} ${className}`}>
        <span className={`${ghost} absolute text-[clamp(14rem,48cqw,26rem)] opacity-40`}>{letter}</span>
        <div className="relative text-center">
          <p className="font-hand text-3xl leading-none text-crust-text" lang="fr">{category?.french}</p>
          <p className="mt-2 text-[0.68rem] uppercase tracking-[0.24em] text-chocolate/60">Fotografia em breve</p>
        </div>
      </div>
    );
  }
  return (
    <div aria-hidden data-no-photo className={`absolute inset-0 overflow-hidden bg-gradient-to-br ${TINT[product.category]} ${className}`}>
      <span className={`${ghost} absolute -bottom-[0.18em] -right-[0.04em] text-[clamp(9rem,26cqw,16rem)] opacity-45`}>{letter}</span>
      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="font-hand text-lg leading-none text-crust-text" lang="fr">{category?.french}</p>
        <p className="mt-1 text-[0.62rem] uppercase tracking-[0.22em] text-chocolate/55">Fotografia em breve</p>
      </div>
    </div>
  );
}
