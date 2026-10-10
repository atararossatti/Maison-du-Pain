/**
 * Converte as fotos de `imagens/` (avif/jpg) em WebP otimizado dentro de `public/fotos/` e gera
 * `src/config/photos.generated.json` (dimensões, cor média e miniatura borrada para o carregamento progressivo).
 * Uso: node scripts/optimize-photos.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const SOURCES = {
  "croissants": "croassan.avif",
  "pains": "pães.avif",
  "sonho": "sonho.jpg",
  "gateau-chocolat": "bolo de chocolate.avif",
  "gateau-moelleux": "bolo cremoso.jpg",
  "muffins": "cupcakes",
  "biscuits": "biscoito.avif",
  "vitrine": "doces.avif",
  "burger-maison": "hamburguer.avif",
  "burger-rustique": "hamburguer 2.avif",
};

await mkdir("public/fotos", { recursive: true });
const manifest = {};
for (const [slug, file] of Object.entries(SOURCES)) {
  const input = `imagens/${file}`;
  const meta = await sharp(input).metadata();
  const out = await sharp(input).webp({ quality: 84, effort: 5 }).toFile(`public/fotos/${slug}.webp`);
  const blur = await sharp(input).resize(14).blur(1).webp({ quality: 55 }).toBuffer();
  const { dominant } = await sharp(input).resize(64).stats();
  const hex = [dominant.r, dominant.g, dominant.b].map((v) => v.toString(16).padStart(2, "0")).join("");
  manifest[slug] = { width: meta.width, height: meta.height, blur: `data:image/webp;base64,${blur.toString("base64")}`, color: `#${hex}` };
  console.log(slug.padEnd(16), `${meta.width}x${meta.height}`, `${Math.round(out.size / 1024)} KB`);
}
await writeFile("src/config/photos.generated.json", JSON.stringify(manifest, null, 2));
