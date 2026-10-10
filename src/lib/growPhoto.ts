import { PHOTOS, type PhotoId } from "@/config/photos";
import { gsap } from "@/lib/gsap";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * A fotografia do menu "cresce" do próprio retângulo até ocupar a tela inteira. O chamador navega por baixo dela e
 * chama `reveal()` para dissolvê-la, entregando o visitante à seção do produto.
 */
export function growPhoto(from: DOMRect, photoId: PhotoId): { grown: Promise<void>; reveal: () => Promise<void> } {
  if (prefersReducedMotion()) return { grown: Promise.resolve(), reveal: () => Promise.resolve() };

  const photo = PHOTOS[photoId];
  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  Object.assign(layer.style, {
    position: "fixed",
    left: `${from.left}px`,
    top: `${from.top}px`,
    width: `${from.width}px`,
    height: `${from.height}px`,
    overflow: "hidden",
    zIndex: "70",
    pointerEvents: "none",
    background: photo.color,
  });
  const img = new Image();
  img.src = photo.src;
  img.alt = "";
  Object.assign(img.style, { width: "100%", height: "100%", objectFit: "cover", display: "block", transformOrigin: "50% 50%" });
  layer.append(img);
  document.body.append(layer);

  const grown = new Promise<void>((resolve) => {
    gsap.to(layer, { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight, duration: 0.85, ease: "expo.inOut", onComplete: resolve });
    gsap.fromTo(img, { scale: 1 }, { scale: 1.12, duration: 0.85, ease: "expo.inOut" });
  });

  const reveal = () =>
    new Promise<void>((resolve) => {
      gsap.to(img, { scale: 1, duration: 0.9, ease: "power3.out" });
      gsap.to(layer, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          layer.remove();
          resolve();
        },
      });
    });

  return { grown, reveal };
}
