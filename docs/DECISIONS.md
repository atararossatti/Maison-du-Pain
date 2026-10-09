# Maison du Pain — Direção e decisões (fonte de verdade entre sessões)

## Estado
- Fase 01/02: concluída. Fase 03 (protótipo): **loader + Cena 01 + transição pela janela implementados e validados** (tsc, eslint, `next build`, 2 testes Playwright, screenshots em `test-results/shots`).
- Cena 02 (interior/massa) implementada em `scenes/bakery` (farinha → ingredientes → sova ligada ao scroll → massa cresce → mergulho). Começa com um "wash" âmbar que casa com o fim da Cena 01 (corte por cor, não zoom contínuo da vitrine: refinar depois). Cena 03 (croissant 3D, `scenes/croissant`) implementada: bola de massa → 7 cristas em barril (LatheGeometry) em arco → leque que mostra o corte em espiral das camadas; progresso do scroll vai para uma `ref` lida pelo `useFrame` (sem re-render); canvas só carrega perto da cena e pausa fora da tela. Modelo 100% procedural (sem GLB); texturas geradas em canvas. Cena 04 (`scenes/flavors`): composição editorial assimétrica de 6 produtos; cada `ProductStage` é um slider acessível (ponteiro, toque, setas/Home/End) que expõe `--v/--px/--py` e as ilustrações SVG reagem só por CSS (calc/var), sem re-render; paralaxe por item via ScrollTrigger scrub; botão "Ver detalhes" abre `<dialog>` nativo com dados fictícios (sem compra). Ilustração do croissant 2D ainda é simples. Cena 05 (`scenes/process`, 8 telas de pin): campo → zoom na espiga (a espiga do campo e a ampliada compartilham geometria, então o cruzamento não tem corte) → 24 grãos viram partículas e caem no moinho → farinha/água → massa → fermentação com relógio → forno → pão; indicador de etapas `<ol aria-current>`. Quadro final ainda é esparso (falta luz/atmosfera). Cena 06 (`scenes/finale`): é a Cena 01 ao contrário (mesma `computeFrame`, recuo da janela até a rua) com a variante `dusk` da ilustração (céu, luzes acesas, tint); 3 botões reais: cardápio (lista + rola até os sabores), visita (dados `A definir` em `config/contact.ts`, compartilhar/copiar link) e pedido (demo local que gera resumo copiável, sem envio). Todas as 6 cenas existem; falta refinamento (Fase 05), README/docs técnicos, cursor/som, mobile real (`NextChapter` é um marcador honesto). Scroll (telas de pin): Cena 01 = 5, Cena 02 = 6, Cena 03 = 6; cada cena ocupa 1 tela + pin, então a Cena 03 começa em 13vh.
- Pendências conhecidas: composição mobile (viewBox `slice` corta árvores/mesas em retrato), cursor customizado, som, README, e screenshots do loader no modo cinematográfico (o navegador embutido só exercitou o modo reduzido).
- Ambiente: Node 24 + Git instalados via winget. O caminho do usuário contém crase: no PowerShell use `-LiteralPath` e aspas simples. Chromium do Playwright instalado. Alguns navegadores embutidos emulam `prefers-reduced-motion`; testes de movimento usam Playwright (`reducedMotion: no-preference`).
- Próximo passo: validar loader cinematográfico por screenshot e refinar o final da Cena 01; depois Cena 02.

## Refinamento pós-publicação
- Movimento reduzido: confirmado em um Chrome real que `prefers-reduced-motion` estava ativo (site em versão estática). Agora `MotionNotice` explica e oferece "Ver a experiência completa" (`enableFullMotion`, só em memória); `useReducedMotion` = sistema && !override; CSS respeita `[data-motion="full"]`.
- Cena 01: a câmera agora avança até a **porta** (`CAMERA_ORIGIN` = centro da porta) e a folha gira (`applyDoor`, `data-fx="doorLeaf"`) revelando o interior enquanto o scroll desce; a Cena 06 usa a mesma câmera ao contrário (a porta fecha ao recuar). Loader com rede de segurança de 20 s (`WATCHDOG_MS`).
- Transições: Cena 02 abre em íris âmbar com a câmera recuando (`arrival`); Cena 03 termina dissolvendo para o creme da 04; Cena 05 entra da cor da 04 e sai em flash dourado, cor em que a 06 começa. Cena 05 reaproveita janela, lâmpadas e utensílios da padaria da Cena 02; o diálogo emite o som `open` (só se o som estiver ligado).
- Desempenho: grão virou textura estática; ambient pausado fora da tela (`data-offscreen`); p95 2D 50 → 33,4 ms.
- Mobile: `VIEWBOX_PORTRAIT` (900×1950) nas Cenas 01/06 quando `max-aspect-ratio: 4/5`. Cenas 02 e 05 ainda usam o recorte central.
- Arte: baguete com aro de casca, croissant 2D em arco, Cena 05 com tábua, brasas e a frase final.
- Correção: o tom do cabeçalho na cena escura agora usa IntersectionObserver (o ScrollTrigger não calculava a posição da cena fixada).

## Checklist de publicação (Fase 08)
- [x] `tsc`, ESLint, `next build` e 11 testes Playwright passam; `npm audit --omit=dev` sem vulnerabilidades.
- [x] Repositório revisado: sem `.env`, chaves, `node_modules` ou `.next` rastreados; maior arquivo é o `package-lock.json`.
- [x] Metadados (`package.json`, Open Graph, favicon), LICENSE, CONTRIBUTING, CI (`typecheck`, `lint`, `build`).
- [x] Capturas reais em `docs/screenshots`; medições em `scripts/measure.mjs`.
- [ ] **Push** para `github.com/atararossatti/Maison-du-Pain` (requer login do usuário).
- [x] GIF da experiência (`docs/demo.gif`).
- [x] Demo publicada na Vercel: https://maison-du-pain-two.vercel.app (projeto `maison-du-pain`, integrado ao GitHub: cada push em `main` publica de novo).
- [x] Lighthouse: demo publicada 1ª medição mobile 51 / desktop 65; após `LazyScene`, contraste e pausa das animações sob o loader (build local): mobile 57 / desktop 74, acessibilidade 100. Resta pintura nativa do SVG da abertura e LCP = duração do loader. Demo no ar após o deploy: mobile 56 / desktop 70, acessibilidade 100. Pendente: dispositivo real.

## Direção artística
**Conceito:** "um livro ilustrado que ganha profundidade". Camadas de papel recortado (SVG, ilustração própria) com luz volumétrica; o 3D (croissant) surge como o único objeto "real" do mundo, o que dá peso à transformação da Cena 03.
**Luz como narrador:** amanhecer (rosa-creme frio) → interior (âmbar quente) → fim de tarde (dourado + janelas acesas), guiada pelo scroll.
**Paleta:** creme `#F7E9D0`, chocolate `#493126`, caramelo `#C88B52`, oliva `#687451`, branco quente `#FFF9EF`, dourado `#D8AD65`; derivados em `globals.css` (`@theme static`), única fonte de cores (SVG usa `var(--color-*)`). Sem preto/azul puros.
**Tipografia:** títulos *Fraunces*, UI *Instrument Sans*, manuscrito *Caveat* só em detalhes (frases francesas).
**Textura:** grão de papel (feTurbulence estático) sobre a ilustração.

## Estratégia 3D / ilustração
- Cenas 01, 02, 05, 06: **SVG em camadas** (paralaxe multicamadas, GSAP). Leve, nítido, acessível.
- Cenas 03 e 04: **React Three Fiber** com croissant procedural (geometria própria + PBR com textura gerada); sem GLB licenciado disponível, nenhum modelo será "fingido".
- Transição ilustração→3D (Cena 03): máscara animada + partículas de farinha; sem corte.
- Canvas WebGL carregado via `dynamic()` só quando a Cena 03 se aproxima.
- Rive/Spline: não usados (sem integração verificada).

## Storyboard (resumo)
1. Loader: forno + croissant, progresso real (fontes, load, imagens críticas), porta abre, vapor, câmera atravessa.
2. Cena 01: fachada → dolly → janela → atravessa o vidro (timeline única pinned). ✅
3. Cena 02: interior; farinha→massa→cresce→zoom.
4. Cena 03: massa vira croissant 3D; camadas se separam.
5. Cena 04: composição editorial de 6 produtos com interações próprias.
6. Cena 05: trigo→grão→farinha→massa→forno→pão.
7. Cena 06: exterior ao entardecer; CTAs (demo honesta, sem endereço/telefone).

## Arquitetura implementada
Next.js 16 (App Router) + TS estrito + Tailwind 4. GSAP + ScrollTrigger + Lenis num único `ScrollProvider` (Lenis dirigido pelo ticker do GSAP; desligado em movimento reduzido).

- `src/config/` valores de cena (`awakening.ts`: escala por camada, origem da câmera, comprimento do scroll) e loading.
- `scenes/awakening/camera.ts`: **função pura** progresso→quadro (`computeFrame`). Scroll rápido/reverso/resize sempre dá o mesmo quadro; o scrub só suaviza o progresso.
- Camadas SVG: `<g data-pointer>` (paralaxe do mouse) envolve `<g data-layer>` (transform do scroll) para nunca disputarem a mesma propriedade.
- Dolly exponencial `escala = S^d`; S maior = mais perto da câmera (gera paralaxe real).
- Loader: progresso exibido = min(real, tempo/`MIN_BAKE_MS`); falhas/timeout degradam para versão simples; "Pular introdução" sempre disponível; modo reduzido ou device tier baixo sem vapor/travessia.
- Cleanup: tudo em `gsap.context` + `ctx.revert()`.

## Riscos
- Safari/iOS e `pin`: `ignoreMobileResize` + `svh` (ainda não testado em dispositivo real).
- Peso do 3D em mobile: croissant ≤30k tris, DPR limitado a 1.5.
- Grão feTurbulence re-rasteriza no resize; oculto em tier baixo.

## Decisão: cinema sempre ligado, palcos sticky (sem Lenis)
- Antes, `prefers-reduced-motion` do sistema deixava o site estático e um botão "Ver a experiência completa" trocava de modo no meio da página (um corte brusco). Agora a experiência cinematográfica é o padrão em qualquer navegador; só quem escolhe "Modo estático" no cabeçalho a desliga (recarrega a página).
- Pins do ScrollTrigger e Lenis foram trocados por palcos `position: sticky` (`ScrubStage`) com scroll nativo: sem o salto de ~115 px que o pin dava ao engatar e sem scroll por JavaScript.
- Cenas se encaixam por sobreposição (`overlap`/`covered`): a próxima sobe por cima do último quadro parado da anterior, na mesma cor de passagem.
