import { Link } from "react-router-dom";
import { useAuth } from "../state/useAuth.js";

export default function NaoEncontrada() {
  const { status } = useAuth();
  const destino = status === "signed_in" ? "/grade" : "/";

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center gap-3 px-4 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Endereço não existe</p>
      <h1 className="font-display text-3xl font-black tracking-tight text-ink">
        Não encontramos esta página
      </h1>
      <p className="text-muted">
        O endereço pode ter sido digitado errado ou o link estar desatualizado.
      </p>
      <div className="mt-4">
        <Link
          to={destino}
          className="inline-block min-h-11 rounded bg-ink px-6 py-3 font-display font-bold text-white transition-colors hover:bg-ink/85"
        >
          {status === "signed_in" ? "Voltar para minha grade" : "Ir para a página inicial"}
        </Link>
      </div>
    </div>
  );
}
