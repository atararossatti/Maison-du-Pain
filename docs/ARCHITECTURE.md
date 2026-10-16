# Arquitetura

## Princípio central

Cada cena é uma **função pura do progresso do scroll**. Não há estado acumulado: dado `progress ∈ [0, 1]`, a função devolve o quadro inteiro. Por isso rolar rápido, inverter a direção ou redimensionar a janela sempre produz o mesmo resultado, e os testes podem comparar quadros.

```
ScrollTrigger (scrub sobre o palco sticky) ──► progress ──► computeXFrame(progress) ──► apply (atributos/CSS)
```

O `scrub` do GSAP só suaviza o número de progresso; o desenho continua determinístico.

## Anatomia de uma cena

Cenas fixadas (01, 02, 03, 05, 06) seguem a mesma forma:

| Arquivo | Papel |
| --- | --- |
| `src/config/<cena>.ts` | Constantes: viewBox, telas de scroll, intervalos de fase (`PHASE`), escalas. Nada de números mágicos nos componentes. |
| `scenes/<cena>/camera.ts` | `computeFrame(progress)`: função pura. Usa `smoothstep` e `clamp` de `lib/math`. |
| `scenes/<cena>/use<Cena>Timeline.ts` | `setup(root)` localiza elementos **uma vez** e devolve `render(progress)`; chama `useScrubbedScene`. |
| `scenes/<cena>/Scene0X*.tsx` | A seção, textos e acessibilidade. |
| `scenes/<cena>/Illustration.tsx` + `layers/` | O SVG em camadas; elementos animados levam `data-el`/`data-layer`/`data-ui`. |

`hooks/useScrubbedScene.ts` liga o scrub ao palco com `gsap.context` (limpeza garantida) e, no modo estático, desenha o `staticProgress` e não cria nenhum ScrollTrigger.

### Escala por camada (paralaxe)

Nas cenas de câmera (01, 06 e o mergulho da 02), cada camada tem uma escala final `S`; o quadro aplica `scale = S^dolly` em torno de um ponto de fuga. Camadas mais próximas têm `S` maior, e a diferença entre elas gera paralaxe real.

### Palcos `sticky` e transições entre cenas

Cada cena é um **palco**: um contêiner alto (`ui/ScrubStage.tsx`) cujo filho (`<section>`) usa `position: sticky; top: 0`. O ScrollTrigger não faz pin: ele só lê o progresso do contêiner (`start: "top top"`, `end: "bottom bottom"`). A fixação é do navegador (thread do compositor), sem o salto de um quadro que o pin por JavaScript dava ao engatar e soltar. Não há scroll suave por biblioteca (o Lenis foi removido): o scroll é o nativo de cada navegador, e o `scrub` do GSAP suaviza o valor de progresso.

- Altura do palco = (telas + 1) viewports; +1 se houver `covered` (outra cena sobe por cima do último quadro).
- `overlap` aplica `margin-top: -100svh`: a cena seguinte sobe cobrindo o último quadro da anterior, que fica parado durante essa tela. Cada cena termina e começa na mesma cor (íris âmbar, véu de massa, flash dourado), então a passagem é contínua em vez de um "corte de página".
- `layer` define o empilhamento (cenas seguintes cobrem as anteriores).

| Cena | Telas de scroll | Sobrepõe a anterior | Coberta pela próxima |
| --- | --- | --- | --- |
| 01 Despertar | 4 | — | sim |
| 02 Interior | 6 | sim | sim |
| 03 Croissant | 6 | sim | sim (a 04 é uma seção normal com margem negativa) |
| 04 Sabores | altura natural | sim | não |
| 05 Processo | 8 | não (entra deslizando, a partir da cor de fundo da 04) | sim |
| 06 Retorno | 5 | sim | não (o rodapé vem depois) |

Os testes localizam o percurso de uma cena por `[data-scene]` → `parentElement` (o palco) em vez de assumir offsets.

### Movimento: a experiência é sempre completa

A preferência `prefers-reduced-motion` do sistema **não** desliga a experiência (decisão de produto: tudo precisa funcionar do mesmo jeito em qualquer navegador, sem botão de ativação). Quem quiser uma versão estática a escolhe no cabeçalho ("Modo estático"): a escolha fica no `localStorage` e a página recarrega, então nunca há troca de modo no meio da navegação. No modo estático os palcos viram seções normais (`useReducedMotion()` = modo estático escolhido).
## Carregamento sob demanda

A Cena 01 é renderizada no servidor. As Cenas 02–06 ficam atrás de `ui/LazyScene.tsx`: um placeholder com a **mesma altura** (altura do palco, com margem negativa nas cenas sobrepostas; `reserveReduced` no modo estático) é trocado pela cena, carregada via `next/dynamic`, quando entra a 400% da viewport; depois da abertura os chunks de todas as cenas são baixados em silêncio. Ao criar ou alterar uma cena, mantenha a altura reservada em `Experience.tsx` coerente (o teste "cenas sob demanda preservam a altura total do scroll" cobre isso). Testes precisam chamar `reveal(page, nome)` antes de consultar uma cena abaixo da dobra.

## Componentes transversais

- **ScrollLock**: bloqueia o scroll (`overflow: hidden`) enquanto o loader cobre a tela.
- **Loader**: `useCriticalAssets` pondera tarefas reais (fontes, `load`, imagens de `config/loading.ts`). O progresso exibido é `min(real, tempo/MIN_BAKE_MS)`. Falha ou timeout apenas marca a tarefa como concluída e degrada a animação.
- **SoundProvider**: `AudioContext` criado só no primeiro "ligar"; sons sintetizados.
- **MagneticButton / useMagnetic**: só em `pointer: fine` e fora do modo estático; o cursor nativo permanece (o anel que seguia o mouse foi removido).
- **Dialog**: `<dialog>` nativo (foco preso, Esc, clique no fundo).

## Cena 03 (WebGL)

- Carregada com `next/dynamic` (`ssr: false`) apenas quando a seção se aproxima (`IntersectionObserver`); `frameloop` vira `never` fora da tela.
- O progresso vive em uma `ref` lida pelo `useFrame`; o scroll nunca causa re-render React.
- O croissant é uma bola de massa que dá lugar a 7 cristas (`LatheGeometry` + tampas com textura em espiral). Texturas e sombra são geradas em canvas e descartadas no cleanup. O ambiente de luz é `RoomEnvironment` (sem HDR externo).
- Partículas (`FlourBurst`) têm posição determinística em função do progresso, então são reversíveis.

## Como adicionar uma cena

1. Crie `src/config/<cena>.ts` (viewBox, `SCREENS`, `PHASE`).
2. Escreva `scenes/<cena>/camera.ts` com `compute<Cena>Frame` e o tipo do quadro.
3. Desenhe `Illustration.tsx` marcando o que anima com `data-el`.
4. Crie `use<Cena>Timeline.ts` com `setup` (estável, no nível do módulo ou `useCallback` com função inline) e `useScrubbedScene`.
5. Monte `Scene0X*.tsx` (landmarks, `aria-labelledby`, legendas com `opacity: reduced ? 1 : 0`) e inclua em `components/layout/Experience.tsx`.
6. Adicione um teste em `tests/` que role até a cena (`scrollStage`, pelo palco) e capture quadros.

## Catálogo, carrinho e rotas

- Rotas: `/` (experiência), `/catalogo`, `/catalogo/[id]` (estático, `dynamicParams = false`), `/pedido` (demonstração). As páginas internas usam `SiteShell` (mesmo cabeçalho, menus e rodapé).
- Dados: `config/catalog.ts` (tipos, categorias, produtos, busca e ordenação) e `config/catalog-images.ts`. Preço em centavos; nenhum dado nutricional ou de alergênicos. `ALL_PRODUCTS` tem todos; `PRODUCTS` (o que o site usa) só os que têm imagem (`REQUIRE_IMAGE`).
- Carrinho: `lib/cart.ts` é um store externo (`useSyncExternalStore`) que guarda `id → quantidade` em `localStorage`; o servidor sempre vê o carrinho vazio. `CartProvider` guarda só o estado de interface (gaveta, aviso).
- Voltar de uma página interna não repete a abertura: `SiteShell` marca a visita em `sessionStorage` e `Experience` consome a marca (F5 na home continua mostrando a abertura). `lib/navigate.ts` registra o roteador do Next para a troca de página ser navegação do cliente.
- `navigateTo` leva a outra página quando o item do menu tem `href` ou quando a seção da home é pedida de outra rota.

- Fotografias do catálogo: `scripts/optimize-products.mjs` associa cada arquivo de `imagens/` ao produto de mesmo nome e gera `public/images/products/<id>.webp` e `config/product-photos.generated.json`; `config/catalog-images.ts` monta `IMAGES` (com `focus` opcional = `object-position` do cartão). Produto sem foto fica fora do catálogo.

## Como adicionar um produto ao catálogo

1. Inclua o item em `DRAFTS` (`src/config/catalog.ts`): `id` (vira o endereço), categoria, textos e `priceCents`.
2. Salve a fotografia em `imagens/` com o nome do produto, rode `node scripts/optimize-products.mjs` e registre-a em `docs/IMAGE_CREDITS.md`. Sem fotografia, o produto não aparece.

## Como adicionar um produto animado (cena de sabores)

1. Inclua o item em `PRODUCTS` (`src/config/products.ts`): `id`, textos, `rest` e `details` (dados fictícios).
2. Estenda `ProductId` e crie a ilustração em `scenes/flavors/illustrations/`, reagindo às variáveis CSS `--v` (0–1 no eixo horizontal), `--px` e `--py` (−1 a 1).
3. Registre-a em `ART` e `LAYOUT` (`Scene04Flavors.tsx`: encaixe na grade, proporção e velocidade de paralaxe).

## Decisões relevantes

- **SVG em vez de Rive/Spline**: leve, nítido, acessível e sem integração externa a verificar.
- **Procedural em vez de GLB**: não há modelo licenciado disponível e nenhum modelo é "fingido".
- **Variáveis CSS nas interações de produto**: a pose é escrita direto no elemento (sem React), e o SVG reage por `calc(var(--v) …)`.
- **Dados fictícios explícitos** (`config/contact.ts` com `null`): a interface trata "sem dados" como estado normal.

## Testes

`npm test` (Playwright) usa `reducedMotion: "no-preference"` para exercitar as animações. Capturas ficam em `test-results/shots` (ignorado pelo Git). O Chromium do Playwright precisa estar instalado (`npx playwright install chromium`).
