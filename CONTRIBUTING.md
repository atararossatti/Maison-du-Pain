# Contribuindo

Este é um projeto autoral e proprietário de Atara Rossatti (todos os direitos reservados, veja [LICENSE](LICENSE)). Não aceita contribuições externas sem autorização prévia e expressa da autora; as convenções abaixo valem para quem trabalha no projeto com essa autorização.

## Ambiente

```bash
npm install
npx playwright install chromium
npm run dev
```

## Antes de entregar uma alteração

```bash
npm run typecheck && npm run lint && npm test && npm run build
```

Mudanças visuais devem vir com uma captura real (os testes salvam em `test-results/shots`). Não declare comportamento como pronto sem tê-lo exercitado no navegador.

## Convenções

- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `perf:`, `style:`, `test:`, `docs:`, `refactor:`), com mensagens específicas.
- **Animação**: cenas são funções puras do progresso (veja [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)). Constantes em `src/config`, nunca espalhadas.
- **Limpeza**: use `gsap.context` e remova listeners/recursos WebGL no cleanup.
- **Acessibilidade**: toda interação de mouse precisa de equivalente por teclado e toque; respeite `prefers-reduced-motion`.
- **Conteúdo**: a marca é fictícia. Não invente endereço, telefone, preços nem integrações comerciais.
- **Assets**: só inclua arquivos com licença verificada e registre a origem no README.