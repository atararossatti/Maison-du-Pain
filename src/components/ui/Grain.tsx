/**
 * Grão de papel como textura estática (public/textures/grain.png) sobre a cena.
 * Antes era um filtro SVG (feTurbulence) que o navegador recalculava a cada quadro do scroll;
 * como camada de fundo repetida ela é rasterizada uma única vez.
 */
export function Grain() {
  return (
    <div
      aria-hidden
      className="grain pointer-events-none absolute inset-0 z-[5] opacity-60"
      style={{ backgroundImage: "url(/textures/grain.png)", backgroundSize: "160px 160px" }}
    />
  );
}