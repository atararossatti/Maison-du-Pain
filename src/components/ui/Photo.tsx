import Image from "next/image";
import { PHOTOS, type PhotoId } from "@/config/photos";

interface PhotoProps {
  id: PhotoId;
  /** Dica de largura renderizada para o `next/image` escolher o tamanho certo. */
  sizes: string;
  className?: string;
  /** Texto alternativo; `""` marca a imagem como decorativa. */
  alt?: string;
  priority?: boolean;
}

/** Fotografia que preenche o pai (`position: relative`), com miniatura borrada enquanto carrega. */
export function Photo({ id, sizes, className = "", alt, priority }: PhotoProps) {
  const photo = PHOTOS[id];
  return (
    <Image
      src={photo.src}
      alt={alt ?? photo.alt}
      fill
      sizes={sizes}
      priority={priority}
      placeholder="blur"
      blurDataURL={photo.blur}
      draggable={false}
      className={`object-cover ${className}`}
    />
  );
}
