"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
}

/** `<dialog>` nativo: foco preso, Esc fecha, clique no fundo fecha e o foco volta ao botão de origem. */
export function Dialog({ open, onClose, labelledBy, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => event.target === event.currentTarget && onClose()}
      aria-labelledby={labelledBy}
      className="m-auto max-h-[90svh] w-[min(92vw,36rem)] overflow-y-auto rounded-3xl border border-chocolate/20 bg-cream p-0 text-chocolate shadow-2xl backdrop:bg-chocolate/55"
    >
      {open && <div className="p-7 sm:p-9">{children}</div>}
    </dialog>
  );
}

export function DialogCloseButton({ onClose, label = "Fechar" }: { onClose: () => void; label?: string }) {
  return (
    <button type="button" onClick={onClose} autoFocus className="mt-6 rounded-full bg-chocolate px-6 py-2.5 text-sm text-cream transition hover:bg-brick">
      {label}
    </button>
  );
}