import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/catalog/ProductDetail";
import { SiteShell } from "@/components/layout/SiteShell";
import { PRODUCTS, getProduct } from "@/config/catalog";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Só existem as páginas dos produtos do catálogo; qualquer outro endereço cai na página "não encontrado".
export const dynamicParams = false;
export const generateStaticParams = () => PRODUCTS.map((product) => ({ slug: product.id }));

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return { title: "Produto não encontrado — Maison du Pain" };
  return { title: `${product.name} — Maison du Pain`, description: `${product.short} Produto e preço demonstrativos.` };
}

export default async function ProductPage({ params }: PageProps) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  return (
    <SiteShell>
      <ProductDetail product={product} />
    </SiteShell>
  );
}
