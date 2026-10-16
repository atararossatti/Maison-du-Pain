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
  /** Enquadramento (`object-position`) quando a fotografia é cortada para preencher o espaço. */
  focus?: string;
}

/** Fotografia que preenche o pai (`position: relative`), com miniatura borrada enquanto carrega. */
export function Photo({ id, sizes, className = "", alt, priority, focus }: PhotoProps) {
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
      style={focus ? { objectPosition: focus } : undefined}
      className={`object-cover ${className}`}
    />
  );
}
