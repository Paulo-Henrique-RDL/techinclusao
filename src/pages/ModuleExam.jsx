import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { COURSE } from "../data/course.js";
import { getModuleQuestionBank } from "../data/questions/index.js";
import { Quiz } from "../components/Quiz.jsx";
import { moduleTheme } from "../styles/moduleTheme.js";
import { useCourseState } from "../state/useCourseState.js";
import { buildQuizSession } from "../lib/quiz.js";
import { MAX_ATTEMPTS, QUESTIONS_PER_MODULE_EXAM } from "../lib/constants.js";
import { isModuleApproved, isModuleInRetake, remainingExamAttempts } from "../lib/rules.js";

export default function ModuleExam() {
  const { moduleId } = useParams();
  const { state, enviarProvaModulo } = useCourseState();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState(null);

  const courseModule = COURSE.modules.find((item) => item.id === moduleId);

  const session = useMemo(
    () =>
      courseModule
        ? buildQuizSession(getModuleQuestionBank(courseModule), QUESTIONS_PER_MODULE_EXAM)
        : [],
    [moduleId, attempt]
  );

  if (!courseModule) {
    return <Navigate to="/grade" replace />;
  }
  if (isModuleApproved(state, moduleId) || isModuleInRetake(state, moduleId)) {
    return <Navigate to={`/modulo/${moduleId}`} replace />;
  }

  const theme = moduleTheme[moduleId];
  const { exam } = state.modules[moduleId];
  const remaining = remainingExamAttempts(exam.attempts);

  function handleSubmit(answers) {
    setResult(enviarProvaModulo(moduleId, session, answers));
  }

  function handleRetry() {
    setResult(null);
    setAttempt((value) => value + 1);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <Link
        to={`/modulo/${moduleId}`}
        className="font-mono text-xs uppercase tracking-widest text-muted hover:text-ink"
      >
        ← {courseModule.titulo}
      </Link>

      <header className="mb-8 mt-4 border-b border-line pb-6">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Prova do curso</p>
        <h1 className={`mt-2 font-display text-3xl font-black tracking-tight ${theme.text}`}>
          {courseModule.titulo}
        </h1>
        <p className="mt-2 max-w-lg text-muted">
          {QUESTIONS_PER_MODULE_EXAM} questões sorteadas das cinco aulas. Você precisa acertar 80%.
        </p>
        <p className="mt-3 font-mono text-sm text-muted">
          Tentativa {exam.attempts + 1} de {MAX_ATTEMPTS}
        </p>
      </header>

      {!result && <Quiz key={attempt} session={session} onSubmit={handleSubmit} />}

      {result && (
        <div className={`border p-6 ${result.passed ? "border-success" : "border-alert"} bg-surface`}>
          <p
            className={`font-display text-2xl font-black tracking-tight ${
              result.passed ? "text-success" : "text-alert"
            }`}
          >
            {result.passed ? "Aprovado" : "Você não atingiu 80% desta vez"}
          </p>
          <p className="mt-1 font-mono text-sm text-muted">
            {result.correctCount} de {result.total} corretas · {Math.round(result.score * 100)}%
          </p>
          <div className="mt-5">
            {result.passed || remaining === 0 ? (
              <button
                type="button"
                onClick={() => navigate(`/modulo/${moduleId}`)}
                className="min-h-11 rounded bg-ink px-6 py-3 font-display font-bold text-white transition-colors hover:bg-ink/85"
              >
                Voltar para o curso
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRetry}
                className="min-h-11 rounded bg-ink px-6 py-3 font-display font-bold text-white transition-colors hover:bg-ink/85"
              >
                Tentar novamente · {remaining} restante{remaining > 1 ? "s" : ""}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
