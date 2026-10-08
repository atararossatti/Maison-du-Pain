"use client";

import { useState } from "react";
import { Dialog, DialogCloseButton } from "@/components/ui/Dialog";
import { SHARE, VISIT_INFO } from "@/config/contact";
import { PRODUCTS, type ProductId } from "@/config/products";

interface DialogProps {
  open: boolean;
  onClose: () => void;
}

const NOTICE = "text-xs text-chocolate/60";

export function MenuDialog({ open, onClose }: DialogProps) {
  const exploreFlavors = () => {
    onClose();
    document.getElementById("sabores")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Dialog open={open} onClose={onClose} labelledBy="cardapio-titulo">
      <h3 id="cardapio-titulo" className="font-display text-3xl">Nosso cardápio</h3>
      <ul className="mt-5 grid gap-3">
        {PRODUCTS.map((product) => (
          <li key={product.id} className="border-t border-chocolate/15 pt-3">
            <p className="font-display text-lg">{product.name}</p>
            <p className="text-sm text-chocolate/70">{product.description}</p>
          </li>
        ))}
      </ul>
      <p className={`mt-5 ${NOTICE}`}>Cardápio ilustrativo de uma marca fictícia; sem preços nem disponibilidade.</p>
      <div className="flex flex-wrap gap-3">
        <DialogCloseButton onClose={onClose} />
        <button type="button" onClick={exploreFlavors} className="mt-6 rounded-full border border-chocolate/40 px-6 py-2.5 text-sm transition hover:bg-chocolate hover:text-cream">
          Explorar os sabores
        </button>
      </div>
    </Dialog>
  );
}

export function VisitDialog({ open, onClose }: DialogProps) {
  const [status, setStatus] = useState("");

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ ...SHARE, url });
        setStatus("Obrigado por compartilhar!");
      } else {
        await navigator.clipboard.writeText(url);
        setStatus("Link copiado para a área de transferência.");
      }
    } catch (error) {
      // O usuário cancelar o compartilhamento não é uma falha.
      if (!(error instanceof DOMException && error.name === "AbortError")) setStatus("Não foi possível compartilhar neste navegador.");
    }
  };

  const rows: [string, string | null][] = [
    ["Endereço", VISIT_INFO.address],
    ["Telefone", VISIT_INFO.phone],
    ["Horários", VISIT_INFO.hours],
  ];

  return (
    <Dialog open={open} onClose={onClose} labelledBy="visita-titulo">
      <h3 id="visita-titulo" className="font-display text-3xl">Venha nos visitar</h3>
      <p className="mt-3 text-chocolate/80">A Maison du Pain é uma padaria imaginária, então não há porta de verdade para bater. Quando houver, estes dados aparecem aqui.</p>
      <dl className="mt-5 grid gap-3 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[6.5rem_1fr] gap-3 border-t border-chocolate/15 pt-3">
            <dt className="uppercase tracking-[0.18em] text-chocolate/60">{label}</dt>
            <dd>{value ?? "A definir"}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-wrap items-center gap-3">
        <DialogCloseButton onClose={onClose} />
        <button type="button" onClick={share} className="mt-6 rounded-full border border-chocolate/40 px-6 py-2.5 text-sm transition hover:bg-chocolate hover:text-cream">
          Compartilhar este site
        </button>
      </div>
      <p role="status" className={`mt-3 ${NOTICE}`}>{status}</p>
    </Dialog>
  );
}

type Quantities = Record<ProductId, number>;
const EMPTY_ORDER = Object.fromEntries(PRODUCTS.map((product) => [product.id, 0])) as Quantities;
const MAX_QUANTITY = 12;

export function OrderDialog({ open, onClose }: DialogProps) {
  const [quantities, setQuantities] = useState<Quantities>(EMPTY_ORDER);
  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState("");

  const change = (id: ProductId, delta: number) => {
    setSummary("");
    setStatus("");
    setQuantities((current) => ({ ...current, [id]: Math.min(MAX_QUANTITY, Math.max(0, current[id] + delta)) }));
  };

  const chosen = PRODUCTS.filter((product) => quantities[product.id] > 0);

  const buildSummary = () => {
    const lines = chosen.map((product) => `${quantities[product.id]}× ${product.name}`);
    setSummary(["Pedido de demonstração — Maison du Pain", ...lines].join("\n"));
  };

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setStatus("Resumo copiado.");
    } catch {
      setStatus("Não foi possível copiar; selecione o texto manualmente.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} labelledBy="pedido-titulo">
      <h3 id="pedido-titulo" className="font-display text-3xl">Faça seu pedido</h3>
      <p className="mt-3 rounded-xl bg-gold/25 px-4 py-3 text-sm">
        Demonstração: nada é enviado nem cobrado. Monte uma cesta e gere um resumo para ver como seria.
      </p>
      <ul className="mt-5 grid gap-2">
        {PRODUCTS.map((product) => (
          <li key={product.id} className="flex items-center justify-between gap-4 border-t border-chocolate/15 pt-2">
            <span id={`qtd-${product.id}`}>{product.name}</span>
            <span className="flex items-center gap-3">
              <button type="button" aria-label={`Remover ${product.name}`} onClick={() => change(product.id, -1)} disabled={quantities[product.id] === 0} className="size-8 rounded-full border border-chocolate/40 disabled:opacity-30">−</button>
              <output aria-labelledby={`qtd-${product.id}`} className="w-5 text-center tabular-nums">{quantities[product.id]}</output>
              <button type="button" aria-label={`Adicionar ${product.name}`} onClick={() => change(product.id, 1)} disabled={quantities[product.id] === MAX_QUANTITY} className="size-8 rounded-full border border-chocolate/40 disabled:opacity-30">+</button>
            </span>
          </li>
        ))}
      </ul>
      {summary && <pre aria-label="Resumo do pedido" className="mt-4 whitespace-pre-wrap rounded-xl bg-butter p-4 font-sans text-sm">{summary}</pre>}
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={buildSummary} disabled={chosen.length === 0} className="mt-6 rounded-full bg-caramel px-6 py-2.5 text-sm text-chocolate transition hover:bg-gold disabled:opacity-40">
          Gerar resumo
        </button>
        {summary && (
          <button type="button" onClick={copySummary} className="mt-6 rounded-full border border-chocolate/40 px-6 py-2.5 text-sm transition hover:bg-chocolate hover:text-cream">
            Copiar resumo
          </button>
        )}
        <DialogCloseButton onClose={onClose} />
      </div>
      <p role="status" className={`mt-3 ${NOTICE}`}>{status}</p>
    </Dialog>
  );
}