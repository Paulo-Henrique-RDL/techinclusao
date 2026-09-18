import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../state/useAuth.js";
import { Aviso } from "../components/Aviso.jsx";

const campoClasse =
  "min-h-12 w-full rounded border border-line bg-surface px-4 py-3 text-ink outline-none placeholder:text-muted focus-visible:border-ink";

export default function Entrar() {
  const { status, cadastrar, entrar } = useAuth();
  const { pathname } = useLocation();
  const cadastrando = pathname === "/criar-conta";
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);

  if (status === "checking") {
    return <Aviso titulo="Carregando…" />;
  }
  if (status === "signed_in") {
    return <Navigate to="/grade" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErro(null);
    setEnviando(true);

    const result = cadastrando
      ? await cadastrar({ nome, email, senha })
      : await entrar({ email, senha });

    setEnviando(false);
    if (result.error) setErro(result.error);
  }

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center gap-6 px-4">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          Projeto de extensão · Capacitação digital
        </p>
        <h1 className="mt-2 font-display text-4xl font-black leading-[1.05] tracking-tight text-ink">
          {cadastrando ? "Criar sua conta" : "Entrar"}
        </h1>
        <p className="mt-2 text-muted">
          {cadastrando
            ? "Cinco cursos, vinte e cinco aulas, no seu ritmo."
            : "Bem-vindo de volta. Sua grade está esperando."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {cadastrando && (
          <div>
            <label htmlFor="nome" className="mb-1 block text-sm text-muted">
              Seu nome
            </label>
            <input
              id="nome"
              type="text"
              required
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              placeholder="Como podemos te chamar"
              className={campoClasse}
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="mb-1 block text-sm text-muted">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="voce@exemplo.com"
            className={campoClasse}
          />
        </div>

        <div>
          <label htmlFor="senha" className="mb-1 block text-sm text-muted">
            Senha
          </label>
          <input
            id="senha"
            type="password"
            required
            minLength={6}
            autoComplete={cadastrando ? "new-password" : "current-password"}
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            placeholder="Pelo menos 6 caracteres"
            className={campoClasse}
          />
        </div>

        {erro && (
          <p role="alert" className="border border-alert bg-surface px-4 py-3 text-sm text-alert">
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="min-h-12 rounded bg-ink px-7 py-3 font-display font-bold text-white transition-colors hover:bg-ink/85 disabled:opacity-60"
        >
          {enviando ? "Aguarde…" : cadastrando ? "Criar conta e começar" : "Entrar"}
        </button>
      </form>

      <p className="text-sm text-muted">
        {cadastrando ? "Já tem uma conta? " : "Ainda não tem conta? "}
        <Link
          to={cadastrando ? "/entrar" : "/criar-conta"}
          className="font-medium text-ink underline"
        >
          {cadastrando ? "Entrar" : "Criar uma agora"}
        </Link>
      </p>

      <p className="border-t border-line pt-4 text-xs text-muted">
        Enquanto a plataforma não tem servidor, sua conta e seu progresso ficam guardados neste
        navegador. Não use uma senha que você usa em outro lugar.
      </p>
    </div>
  );
}
