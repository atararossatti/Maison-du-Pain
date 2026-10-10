import type { ReactNode } from "react";
import { PHOTOS, type PhotoId } from "@/config/photos";
import { Photo } from "./Photo";

interface PhotoFrameProps {
  id: PhotoId;
  sizes: string;
  /** Máscara de revelação (ver `useEditorialMotion`). */
  reveal?: "up" | "down" | "left" | "right" | "iris";
  /** Deslize interno da imagem, em % da altura. 0 desliga. */
  drift?: number;
  /** Proporção do quadro; padrão: a da própria fotografia (nada é cortado). */
  ratio?: string | false;
  className?: string;
  alt?: string;
  priority?: boolean;
  children?: ReactNode;
}

/** Quadro de fotografia pronto para as animações editoriais: máscara, zoom que assenta e paralaxe interna. */
export function PhotoFrame({ id, sizes, reveal = "up", drift = 7, ratio, className = "", alt, priority, children }: PhotoFrameProps) {
  const photo = PHOTOS[id];
  return (
    <div data-reveal={reveal} className={`relative overflow-hidden ${className}`} style={{ aspectRatio: ratio === false ? undefined : (ratio ?? `${photo.width} / ${photo.height}`), background: photo.color }}>
      <div data-reveal-img className="absolute inset-0">
        <div data-drift={drift || undefined} className={drift ? "absolute inset-x-0 -inset-y-[9%]" : "absolute inset-0"}>
          <Photo id={id} sizes={sizes} alt={alt} priority={priority} />
        </div>
      </div>
      {children}
    </div>
  );
}
