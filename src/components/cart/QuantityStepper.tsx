"use client";

import { MAX_QTY, MIN_QTY, normalizeQty } from "@/lib/cart";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  /** Nome do produto, usado nos rótulos acessíveis. */
  name: string;
  /** Campo numérico editável (página do produto) ou apenas o valor (carrinho). */
  editable?: boolean;
  compact?: boolean;
}

/** Quantidade sempre válida: inteiro entre 1 e 99, qualquer outro valor digitado é corrigido. */
export function QuantityStepper({ value, onChange, name, editable = false, compact = false }: QuantityStepperProps) {
  const size = compact ? "size-8" : "size-11";
  const button = `${size} grid place-items-center rounded-full border border-chocolate/30 text-lg leading-none transition-colors hover:bg-chocolate hover:text-cream disabled:pointer-events-none disabled:opacity-35 motion-reduce:transition-none`;
  return (
    <div className="inline-flex items-center gap-2" role="group" aria-label={`Quantidade de ${name}`}>
      <button type="button" className={button} aria-label={`Diminuir a quantidade de ${name}`} disabled={value <= MIN_QTY} onClick={() => onChange(normalizeQty(value - 1))}>
        <span aria-hidden>−</span>
      </button>
      {editable ? (
        <input
          type="number"
          inputMode="numeric"
          min={MIN_QTY}
          max={MAX_QTY}
          step={1}
          value={value}
          aria-label={`Quantidade de ${name}`}
          onChange={(event) => {
            // Corrige também o que aparece no campo (valores como "0" ou "abc" não podem ficar à vista).
            const next = normalizeQty(event.target.value);
            event.target.value = String(next);
            onChange(next);
          }}
          className="h-11 w-16 rounded-full border border-chocolate/30 bg-cream text-center text-base tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
      ) : (
        <output aria-live="polite" className="min-w-[2ch] text-center text-sm tabular-nums">{value}</output>
      )}
      <button type="button" className={button} aria-label={`Aumentar a quantidade de ${name}`} disabled={value >= MAX_QTY} onClick={() => onChange(normalizeQty(value + 1))}>
        <span aria-hidden>+</span>
      </button>
    </div>
  );
}
