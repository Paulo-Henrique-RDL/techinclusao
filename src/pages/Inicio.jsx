import { Link, Navigate } from "react-router-dom";
import { COURSE } from "../data/course.js";
import { BENEFICIOS_POR_CURSO } from "../data/beneficios.js";
import { moduleTheme } from "../styles/moduleTheme.js";
import { useAuth } from "../state/useAuth.js";
import { Aviso } from "../components/Aviso.jsx";

const TOTAL_AULAS = COURSE.modules.reduce((soma, item) => soma + item.lessons.length, 0);

const COMO_FUNCIONA = [
  { titulo: "Assista a aula", texto: "Um vídeo curto, que você pode pausar e voltar quando quiser." },
  { titulo: "Faça o exercício", texto: "Cinco perguntas sobre o que acabou de ver." },
  { titulo: "Avance", texto: "Acertando 80%, a próxima aula abre. Errou? Tenta de novo, sem limite." },
];

function BotaoPrincipal({ children }) {
  return (
    <Link
      to="/criar-conta"
      className="inline-block min-h-12 rounded bg-ink px-8 py-3.5 font-display text-lg font-bold text-white transition-colors hover:bg-ink/85"
    >
      {children}
    </Link>
  );
}

export default function Inicio() {
  const { status } = useAuth();

  if (status === "checking") return <Aviso titulo="Carregando…" />;
  if (status === "signed_in") return <Navigate to="/grade" replace />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:py-20">
      <section>
        <h1 className="font-display text-4xl font-black leading-[1.05] tracking-tight text-ink sm:text-5xl">
          Depois daqui, você sabe:
        </h1>

        <ul className="mt-8 border-t border-line">
          {COURSE.modules.map((courseModule) => (
            <li
              key={courseModule.id}
              className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-line py-5"
            >
              <span
                aria-hidden="true"
                className={`h-3 w-3 shrink-0 translate-y-0.5 ${moduleTheme[courseModule.id].fill}`}
              />
              <p className="min-w-0 flex-1 text-lg leading-snug text-ink">
                {BENEFICIOS_POR_CURSO[courseModule.id]}
              </p>
              <span className="ml-7 shrink-0 font-mono text-xs text-muted sm:ml-0 sm:w-36 sm:text-right">
                {courseModule.titulo}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <BotaoPrincipal>Criar minha conta — é de graça</BotaoPrincipal>
          <p className="mt-3 text-sm text-muted">
            Já começou antes?{" "}
            <Link to="/entrar" className="font-medium text-ink underline">
              Entrar na minha conta
            </Link>
          </p>
        </div>
      </section>

      <section className="mt-16 grid grid-cols-3 gap-px border border-line bg-line">
        {[
          [TOTAL_AULAS, "aulas em vídeo"],
          [COURSE.modules.length, "cursos, com prova"],
          ["R$ 0", "do começo ao fim"],
        ].map(([valor, rotulo]) => (
          <div key={rotulo} className="bg-canvas px-4 py-6 text-center">
            <p className="font-mono text-3xl text-ink">{valor}</p>
            <p className="mt-1 text-xs text-muted">{rotulo}</p>
          </div>
        ))}
      </section>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-black tracking-tight text-ink">Como funciona</h2>
        <ol className="mt-6 grid gap-6 sm:grid-cols-3">
          {COMO_FUNCIONA.map((passo, indice) => (
            <li key={passo.titulo}>
              <p className="font-mono text-xs text-muted">{String(indice + 1).padStart(2, "0")}</p>
              <p className="mt-2 font-display text-lg font-bold text-ink">{passo.titulo}</p>
              <p className="mt-1 text-sm text-muted">{passo.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 border-l-4 border-ink bg-surface px-6 py-6">
        <h2 className="font-display text-2xl font-black tracking-tight text-ink">
          O que você precisa
        </h2>
        <p className="mt-2 max-w-xl text-muted">
          Um celular ou computador com internet. Só isso. Você escolhe por qual curso começar e para
          quando quiser — quando voltar, continua de onde parou.
        </p>
      </section>

      <section className="mt-16 border-t border-line pt-10 text-center">
        <p className="font-display text-2xl font-black tracking-tight text-ink">
          Sua grade começa vazia. Vamos preencher?
        </p>
        <div className="mt-6">
          <BotaoPrincipal>Começar agora</BotaoPrincipal>
        </div>
      </section>
    </div>
  );
}
