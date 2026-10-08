/** Divide o texto em palavras com máscara, para a revelação tipográfica vinda de baixo. */
export function SplitWords({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, index) => (
        <span key={`${word}-${index}`} className="word-mask">
          <span className="word-inner">{word}&nbsp;</span>
        </span>
      ))}
    </>
  );
}