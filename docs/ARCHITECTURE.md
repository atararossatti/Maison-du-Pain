# Arquitetura

## Princípio central

Cada cena é uma **função pura do progresso do scroll**. Não há estado acumulado: dado `progress ∈ [0, 1]`, a função devolve o quadro inteiro. Por isso rolar rápido, inverter a direção ou redimensionar a janela sempre produz o mesmo resultado, e os testes podem comparar quadros.

```
ScrollTrigger (pin + scrub) ──► progress ──► computeXFrame(progress) ──► apply (atributos/CSS)
```

O `scrub` do GSAP só suaviza o número de progresso; o desenho continua determinístico.

## Anatomia de uma cena

Cenas fixadas (01, 02, 03, 05, 06) seguem a mesma forma:

| Arquivo | Papel |
| --- | --- |
| `src/config/<cena>.ts` | Constantes: viewBox, telas de pin, intervalos de fase (`PHASE`), escalas. Nada de números mágicos nos componentes. |
| `scenes/<cena>/camera.ts` | `computeFrame(progress)`: função pura. Usa `smoothstep` e `clamp` de `lib/math`. |
| `scenes/<cena>/use<Cena>Timeline.ts` | `setup(root)` localiza elementos **uma vez** e devolve `render(progress)`; chama `useScrubbedScene`. |
| `scenes/<cena>/Scene0X*.tsx` | A seção, textos e acessibilidade. |
| `scenes/<cena>/Illustration.tsx` + `layers/` | O SVG em camadas; elementos animados levam `data-el`/`data-layer`/`data-ui`. |

`hooks/useScrubbedScene.ts` cria o pin e o scrub com `gsap.context` (limpeza garantida) e, com movimento reduzido, desenha o `staticProgress` e não cria nenhum ScrollTrigger.

### Escala por camada (paralaxe)

Nas cenas de câmera (01, 06 e o mergulho da 02), cada camada tem uma escala final `S`; o quadro aplica `scale = S^dolly` em torno de um ponto de fuga. Camadas mais próximas têm `S` maior, e a diferença entre elas gera paralaxe real.

### Mapa de scroll

Cada cena ocupa 1 tela mais as telas de pin. Para posicionar testes ou âncoras: início da cena *n* = soma de (1 + pin) das anteriores.

| Cena | Pin (telas) | Início (telas) |
| --- | --- | --- |
| 01 Despertar | 4 | 0 |
| 02 Interior | 6 | 5 |
| 03 Croissant | 6 | 12 |
| 04 Sabores | — (altura natural) | 19 |
| 05 Processo | 8 | depende da altura da 04 |
| 06 Retorno | 5 | depende da 05 |

Os testes localizam a cena por `.pin-spacer` em vez de assumir offsets.

## Carregamento sob demanda

A Cena 01 é renderizada no servidor. As Cenas 02–06 ficam atrás de `ui/LazyScene.tsx`: um placeholder com a **mesma altura** (1 tela + telas de pin; `motion-reduce:min-h-svh` com movimento reduzido) é trocado pela cena, carregada via `next/dynamic`, quando entra a 250% da viewport. Ao criar ou alterar uma cena, mantenha a altura reservada em `Experience.tsx` coerente (o teste "cenas sob demanda preservam a altura total do scroll" cobre isso). Testes precisam chamar `reveal(page, nome)` antes de consultar uma cena abaixo da dobra.

## Componentes transversais

- **ScrollProvider**: uma instância do Lenis dirigida por `gsap.ticker`; `locked` bloqueia o scroll durante o loader. Não é criada com movimento reduzido.
- **Loader**: `useCriticalAssets` pondera tarefas reais (fontes, `load`, imagens de `config/loading.ts`). O progresso exibido é `min(real, tempo/MIN_BAKE_MS)`. Falha ou timeout apenas marca a tarefa como concluída e degrada a animação.
- **SoundProvider**: `AudioContext` criado só no primeiro "ligar"; sons sintetizados.
- **Cursor / MagneticButton / useMagnetic**: só em `pointer: fine` e sem movimento reduzido; o cursor nativo permanece.
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
6. Adicione um teste em `tests/` que role até a cena via `.pin-spacer` e capture quadros.

## Como adicionar um produto

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
