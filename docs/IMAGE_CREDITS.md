# Créditos e licenças das fotografias

Registro obrigatório de TODA fotografia usada no site. Regra do projeto: nenhuma imagem entra sem origem, licença e termos verificados
para a imagem específica; sem confirmação, a imagem é descartada. Nunca se associa a fotografia de um alimento a outro.

## Estado atual

Todas as imagens do catálogo são **fotografias fornecidas pelo autor do projeto** (pasta `imagens/`). Não há ilustração nem imagem de banco
no catálogo. O produto sem fotografia (hoje, só o Croque madame) fica fora do catálogo até a foto chegar (`REQUIRE_IMAGE` em
`src/config/catalog.ts`); a imagem de outro alimento nunca é usada no lugar.

Como entra uma foto nova: salve em `imagens/` com o nome do produto (por exemplo `Pão de centeio.png`), rode
`node scripts/optimize-products.mjs` e confira o relatório (a associação é pelo nome exato, ignorando acento, maiúsculas, espaços,
hífens e extensão; arquivo sem produto é listado, nunca atribuído a outro). O script grava `public/images/products/<id>.webp` e
`src/config/product-photos.generated.json`. Os originais não são alterados nem removidos.

## Fotografias fornecidas pelo autor do projeto

Pasta `imagens/` do repositório (originais), otimizadas por `scripts/optimize-photos.mjs` para `public/fotos/*.webp`.
Fonte: autor do projeto (Atara Rossatti). Os direitos de uso são do autor; a licença de cada original não foi auditada por este
registro (fotografias de terceiros eventualmente contidas nelas não foram identificadas). Atribuição: não exigida.
Verificação do conteúdo (o que a imagem realmente mostra): 2026-10-16.

| Arquivo | Onde é usada | O que mostra | Produto do catálogo associado |
| --- | --- | --- | --- |
| `public/fotos/croissants.webp` | Catálogo, home, mega menu | Cesta de croissants dourados | Croissant tradicional |
| `public/fotos/sonho.webp` | Catálogo, Nosso Atelier | Sonho com creme e açúcar de confeiteiro | Sonho |
| `public/fotos/gateau-chocolat.webp` | Catálogo, Nosso Atelier, mega menu | Fatia de bolo de chocolate com calda | Gâteau au chocolat |
| `public/fotos/gateau-moelleux.webp` | Catálogo, Nosso Atelier | Corte de bolo fofo de miolo alveolado | Gâteau moelleux |
| `public/fotos/muffins.webp` | Catálogo, home | Muffins com frutas vermelhas e nozes | Muffins |
| `public/fotos/biscuits.webp` | Catálogo, home, mega menu | Biscoitos de aveia e amanteigados em potes | Biscoitos amanteigados |
| `public/fotos/burger-maison.webp` | Catálogo, home, mega menu | Hambúrguer artesanal com queijo e cebola | Burger artesanal |
| `public/fotos/burger-rustique.webp` | Catálogo (galeria do burger) | Hambúrgueres em pães rústicos | Burger artesanal (imagem adicional) |
| `public/fotos/vitrine.webp` | Home (composição) | Vitrine com rolinhos de canela e doces | Editorial (nenhum produto) |
| `public/fotos/pains.webp` | Nosso Atelier, capa da categoria Pães | Pilha de pãezinhos dourados | Capa de categoria; não é baguete nem outro pão do catálogo |

## Fotografias dos produtos (pasta `imagens/`, 2026-10-16)

Fonte: autor do projeto. Conversão: só redimensionamento (lado maior até 1600 px) e WebP com qualidade 86, sem filtro de cor nem
edição de conteúdo. As fotos de comida que mostram a embalagem "Maison du Pain" (Brioche, Pain aux raisins, Macarons) são do próprio projeto.

42 fotografias, uma por produto, em `public/images/products/<id>.webp`:

| Produto (id) | Arquivo original |
| --- | --- |
| baguette-traditionnelle | `Baguette traditionnelle.jpg` |
| brioche | `Brioche.png` |
| brownies | `Brownies.png` |
| canele | `Canelé.png` |
| cappuccino | `Cappuccino.png` |
| cha | `Cha.png` |
| chausson-aux-pommes | `Chausson aux pommes.png` |
| cheesecake | `Cheesecake.png` |
| chocolat-chaud | `Chocolate Quente.png` |
| cinnamon-roll | `Cinnamon roll.png` |
| cookies | `Cookies.png` |
| croissant-de-amendoas | `Croissant de amêndoas.jpg` |
| croissant-recheado | `Croissant recheado.png` |
| croque-monsieur | `Croque monsieur.png` |
| entremets | `Entremets.png` |
| espresso | `Espresso.png` |
| financiers | `Financiers.png` |
| focaccia | `Focaccia.png` |
| fougasse | `Fougasse.png` |
| latte | `Latte.png` |
| macarons | `Macarons (caixa com 6).png` |
| madeleines | `Madeleines.png` |
| mille-feuille | `Mille-feuille.png` |
| mocha | `Mocha.png` |
| opera-cake | `Opera cake.png` |
| pain-au-chocolat | `Pain au chocolat.jpg` |
| pain-au-levain | `Pain au levain.jpg` |
| pain-aux-raisins | `Pain aux raisins.png` |
| pain-de-campagne | `Pain de campagne.png` |
| palmiers | `Palmiers.png` |
| paris-brest | `Paris-Brest.png` |
| pao-de-centeio | `Pão de centeio.png` |
| pao-de-nozes | `Pão de nozes.png` |
| pao-integral | `Pão integral.png` |
| quiche-lorraine | `Quiche Lorraine.png` |
| sanduiche-de-baguete | `Sanduíche de baguete.png` |
| sanduiche-de-croissant | `Sanduíche de croissant.png` |
| tarte-tatin | `Tarte Tatin.png` |
| tarte-au-citron | `Tarte au citron.png` |
| tarte-aux-fraises | `Tarte aux fraises.jpg` |
| torta-salgada | `Torta salgada.png` |
| eclair-de-chocolate | `Éclair de chocolate.avif` |

Os outros 7 produtos usam as fotografias da tabela anterior.

### Produto sem fotografia

- Croque madame (`croque-madame`): nenhuma foto em `imagens/`; não aparece no catálogo até receber uma.
