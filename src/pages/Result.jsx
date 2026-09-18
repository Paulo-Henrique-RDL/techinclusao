import { Link } from "react-router-dom";
import { COURSE } from "../data/course.js";
import { Grade } from "../components/Grade.jsx";
import { useAuth } from "../state/useAuth.js";
import { useCourseState } from "../state/useCourseState.js";

export default function Result() {
  const { user } = useAuth();
  const { state } = useCourseState();

  const averageScore =
    COURSE.modules.reduce((sum, item) => sum + state.modules[item.id].exam.bestScore, 0) /
    COURSE.modules.length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Grade completa</p>
        <h1 className="mt-2 font-display text-4xl font-black tracking-tight text-ink sm:text-5xl">
          Parabéns, {user.nome}
        </h1>
        <p className="mt-3 max-w-xl text-muted">
          Você concluiu os cinco cursos do TechInclusão — 25 aulas e 5 provas — com aproveitamento
          médio de {Math.round(averageScore * 100)}% nas provas.
        </p>
      </header>

      <Grade state={state} />

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-lg text-xs text-muted">
          Este reconhecimento é simbólico, sem validade oficial — reflete o progresso registrado
          neste navegador.
        </p>
        <Link
          to="/grade"
          className="min-h-11 self-start rounded bg-ink px-6 py-3 font-display font-bold text-white transition-colors hover:bg-ink/85"
        >
          Voltar para a grade
        </Link>
      </div>
    </div>
  );
}
