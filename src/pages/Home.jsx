import { Link } from "react-router-dom";
import { COURSE } from "../data/course.js";
import { Grade } from "../components/Grade.jsx";
import { useAuth } from "../state/useAuth.js";
import { useCourseState } from "../state/useCourseState.js";
import { countApprovedLessons, isCourseComplete } from "../lib/rules.js";

export default function Home() {
  const { user } = useAuth();
  const { state } = useCourseState();

  const totalLessons = COURSE.modules.reduce((sum, item) => sum + item.lessons.length, 0);
  const approvedLessons = COURSE.modules.reduce(
    (sum, item) => sum + countApprovedLessons(state, item.id),
    0
  );
  const lastModule = COURSE.modules.find((item) => item.id === state.lastModuleId);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Sua grade</p>
          <h1 className="mt-2 font-display text-3xl font-black tracking-tight text-ink sm:text-4xl">
            Olá, {user.nome}
          </h1>
          <p className="mt-2 max-w-md text-muted">
            {approvedLessons === 0
              ? "Sua grade está vazia. Escolha um curso abaixo e comece pela primeira aula."
              : isCourseComplete(state)
                ? "Você concluiu os cinco cursos. A grade está completa."
                : "Cada curso é independente — siga o que quiser, na ordem que preferir."}
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <p className="font-mono text-sm text-muted">
            <span className="text-2xl font-medium text-ink">{approvedLessons}</span>
            <span> / {totalLessons} aulas</span>
          </p>
          {lastModule && (
            <Link
              to={`/modulo/${lastModule.id}`}
              className="min-h-11 rounded bg-ink px-6 py-3 font-display font-bold text-white transition-colors hover:bg-ink/85"
            >
              Voltar para {lastModule.titulo}
            </Link>
          )}
        </div>
      </header>

      <Grade state={state} />

      {isCourseComplete(state) && (
        <Link
          to="/conclusao"
          className="mt-8 inline-block min-h-11 rounded bg-success px-7 py-3 font-display font-bold text-white transition-opacity hover:opacity-90"
        >
          Ver conclusão do curso
        </Link>
      )}
    </div>
  );
}
