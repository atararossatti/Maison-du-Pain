# Maison du Pain — Direção e decisões (fonte de verdade entre sessões)

## Estado
- Fase 01/02: concluída. Fase 03 (protótipo): **loader + Cena 01 + transição pela janela implementados e validados** (tsc, eslint, `next build`, 2 testes Playwright, screenshots em `test-results/shots`).
- Cenas 02–06: não iniciadas (`NextChapter` é um marcador honesto). O frame final da Cena 01 (zoom no interior da vitrine) é provisório; a Cena 02 deve assumir o interior completo.
- Pendências conhecidas: composição mobile (viewBox `slice` corta árvores/mesas em retrato), cursor customizado, som, README, e screenshots do loader no modo cinematográfico (o navegador embutido só exercitou o modo reduzido).
- Ambiente: Node 24 + Git instalados via winget. O caminho do usuário contém crase: no PowerShell use `-LiteralPath` e aspas simples. Chromium do Playwright instalado. O navegador embutido do Claude emula `prefers-reduced-motion`; testes de movimento usam Playwright (`reducedMotion: no-preference`). Configurar `git config user.name/email` antes do primeiro commit.
- Próximo passo: validar loader cinematográfico por screenshot e refinar o final da Cena 01; depois Cena 02.

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
