import { Link, Navigate, useParams } from "react-router-dom";
import { COURSE } from "../data/course.js";
import { LessonList } from "../components/LessonList.jsx";
import { moduleTheme } from "../styles/moduleTheme.js";
import { useCourseState } from "../state/useCourseState.js";
import { MAX_ATTEMPTS } from "../lib/constants.js";
import {
  countApprovedLessons,
  isModuleApproved,
  isModuleExamUnlocked,
  isModuleInRetake,
  remainingExamAttempts,
} from "../lib/rules.js";

function ExamPanel({ courseModule, state, onRetake }) {
  const theme = moduleTheme[courseModule.id];
  const { exam } = state.modules[courseModule.id];
  const remaining = remainingExamAttempts(exam.attempts);

  if (isModuleApproved(state, courseModule.id)) {
    return (
      <div className="border border-line bg-surface p-6">
        <p className="font-display text-lg font-bold text-success">Curso concluído</p>
        <p className="mt-1 text-sm text-muted">
          Você foi aprovado na prova com {Math.round(exam.bestScore * 100)}%.
        </p>
      </div>
    );
  }

  if (isModuleInRetake(state, courseModule.id)) {
    return (
      <div className="border border-alert bg-surface p-6">
        <p className="font-display text-lg font-bold text-alert">Tentativas esgotadas</p>
        <p className="mt-1 max-w-lg text-sm text-muted">
          Você usou as {MAX_ATTEMPTS} tentativas da prova deste curso. Refazer o curso zera as aulas
          e a prova daqui — seus outros cursos continuam como estão.
        </p>
        <button
          type="button"
          onClick={onRetake}
          className="mt-4 min-h-11 rounded bg-alert px-6 py-3 font-display font-bold text-white transition-opacity hover:opacity-90"
        >
          Refazer este curso
        </button>
      </div>
    );
  }

  if (isModuleExamUnlocked(state, courseModule.id)) {
    return (
      <div className="border border-line bg-surface p-6">
        <p className="font-display text-lg font-bold text-ink">Prova do curso liberada</p>
        <p className="mt-1 text-sm text-muted">
          São 20 questões sorteadas das cinco aulas. Você precisa acertar 80%. Tentativas usadas:{" "}
          {exam.attempts} de {MAX_ATTEMPTS} — restam {remaining}.
        </p>
        <Link
          to={`/modulo/${courseModule.id}/prova`}
          className={`mt-4 inline-block min-h-11 rounded px-6 py-3 font-display font-bold text-white transition-opacity hover:opacity-90 ${theme.fill}`}
        >
          Fazer a prova
        </Link>
      </div>
    );
  }

  return (
    <div className="border border-dashed border-line p-6">
      <p className="font-display text-lg font-bold text-muted">Prova do curso</p>
      <p className="mt-1 text-sm text-muted">Conclua as cinco aulas acima para liberar a prova.</p>
    </div>
  );
}

export default function Module() {
  const { moduleId } = useParams();
  const { state, refazerModulo } = useCourseState();
  const courseModule = COURSE.modules.find((item) => item.id === moduleId);

  if (!courseModule) {
    return <Navigate to="/grade" replace />;
  }

  const theme = moduleTheme[moduleId];
  const approved = countApprovedLessons(state, moduleId);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <Link to="/grade" className="font-mono text-xs uppercase tracking-widest text-muted hover:text-ink">
        ← Grade
      </Link>

      <header className="mb-8 mt-4 border-b border-line pb-6">
        <h1 className={`font-display text-4xl font-black tracking-tight ${theme.text}`}>
          {courseModule.titulo}
        </h1>
        <p className="mt-2 text-muted">{courseModule.resumo}</p>
        <p className="mt-4 font-mono text-sm text-muted">
          {approved} de {courseModule.lessons.length} aulas concluídas
        </p>
      </header>

      <LessonList courseModule={courseModule} state={state} />

      <div className="mt-8">
        <ExamPanel
          courseModule={courseModule}
          state={state}
          onRetake={() => refazerModulo(moduleId)}
        />
      </div>
    </div>
  );
}
