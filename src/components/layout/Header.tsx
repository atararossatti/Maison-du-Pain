"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function Header() {
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => gsap.set(bar, { scaleY: self.progress }),
    });
    return () => trigger.kill();
  }, []);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-4 sm:px-9 sm:py-6">
        <a
          href="#"
          className="pointer-events-auto font-display text-lg tracking-tight text-chocolate sm:text-xl"
          aria-label="Maison du Pain — início"
        >
          Maison <span className="italic text-crust">du</span> Pain
        </a>
        <p className="font-hand text-xl text-chocolate/80 max-sm:hidden" lang="fr">
          Le bonheur se savoure
        </p>
      </header>
      <div className="pointer-events-none fixed right-0 top-0 z-40 h-full w-[3px] bg-chocolate/10" aria-hidden>
        <span ref={barRef} className="block h-full origin-top scale-y-0 bg-caramel" />
      </div>
    </>
  );
}