"use client";

import { useRef, type ButtonHTMLAttributes } from "react";
import { useSound } from "@/components/animations/SoundProvider";
import { useMagnetic } from "@/hooks/useMagnetic";

/** Botão com atração magnética e som de toque (se o usuário ligou os efeitos). */
export function MagneticButton({ onClick, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const ref = useRef<HTMLButtonElement>(null);
  const { play } = useSound();
  useMagnetic(ref);

  return (
    <button
      ref={ref}
      type="button"
      onClick={(event) => {
        play("tap");
        onClick?.(event);
      }}
      {...props}
    />
  );
}