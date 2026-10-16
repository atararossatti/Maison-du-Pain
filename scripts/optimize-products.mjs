/**
 * Fotografias dos produtos: lê `imagens/`, associa cada arquivo ao produto de MESMO nome (ignorando acento, maiúsculas,
 * espaços, hífens e extensão; nunca por semelhança) e grava `public/images/products/<id>.webp` + `src/config/product-photos.generated.json`.
 * O conteúdo e as cores não são alterados: só redimensiona (máx. 1600 px de lado maior) e converte para WebP. Os originais ficam intactos.
 * Uso: node scripts/optimize-products.mjs
 */
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const norm = (text) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

// Arquivos antigos, ligados aos produtos por `src/config/photos.ts` (pipeline `optimize-photos.mjs`).
const LEGACY = new Set(["biscoito.avif", "bolo cremoso.jpg", "bolo de chocolate.avif", "croassan.avif", "cupcakes", "doces.avif", "hamburguer 2.avif", "hamburguer.avif", "pães.avif", "sonho.jpg"].map(norm));

const catalog = await readFile("src/config/catalog.ts", "utf8");
const products = [...catalog.matchAll(/\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*category:/g)].map((m) => ({ id: m[1], name: m[2] }));
const byKey = new Map();
for (const p of products) for (const key of [norm(p.name), norm(p.id)]) byKey.set(key, p);

await mkdir("public/images/products", { recursive: true });
const manifest = {};
const unmatched = [];
const files = (await readdir("imagens")).filter((f) => !f.startsWith(".")).sort();
for (const file of files) {
  if (LEGACY.has(norm(file))) continue;
  const product = byKey.get(norm(file.replace(/\.[^.]+$/, "")));
  if (!product) {
    unmatched.push(file);
    continue;
  }
  if (manifest[product.id]) throw new Error(`Duas fotos para ${product.id}: ${file}`);
  const input = `imagens/${file}`;
  const out = await sharp(input).rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }).webp({ quality: 86, effort: 5 }).toFile(`public/images/products/${product.id}.webp`);
  const blur = await sharp(input).rotate().resize(14).blur(1).webp({ quality: 55 }).toBuffer();
  const { dominant } = await sharp(input).rotate().resize(64).stats();
  const hex = [dominant.r, dominant.g, dominant.b].map((v) => v.toString(16).padStart(2, "0")).join("");
  manifest[product.id] = { source: file, width: out.width, height: out.height, blur: `data:image/webp;base64,${blur.toString("base64")}`, color: `#${hex}` };
  console.log(product.id.padEnd(26), file.padEnd(34), `${out.width}x${out.height}`, `${Math.round(out.size / 1024)} KB`);
}
await writeFile("src/config/product-photos.generated.json", JSON.stringify(manifest, null, 2));
console.log(`\n${Object.keys(manifest).length} fotos associadas. Sem produto correspondente:`, unmatched.length ? unmatched : "nenhuma");
