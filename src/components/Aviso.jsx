export function Aviso({ titulo, descricao }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center gap-2 px-4 text-center">
      <p className="font-display text-xl font-bold text-ink">{titulo}</p>
      {descricao && <p className="text-sm text-muted">{descricao}</p>}
    </div>
  );
}
