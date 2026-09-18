import { useCallback, useMemo, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { findLesson } from "../data/course.js";
import { questionBanksByLesson } from "../data/questions/index.js";
import { VideoPlayer } from "../components/VideoPlayer.jsx";
import { Quiz } from "../components/Quiz.jsx";
import { moduleTheme } from "../styles/moduleTheme.js";
import { useCourseState } from "../state/useCourseState.js";
import { buildQuizSession } from "../lib/quiz.js";
import { QUESTIONS_PER_LESSON_QUIZ } from "../lib/constants.js";
import { getNextStepInModule, isLessonApproved } from "../lib/rules.js";

export default function Lesson() {
  const { moduleId, lessonId } = useParams();
  const { state, registrarProgressoVideo, concluirVideo, enviarQuizAula } = useCourseState();
  const navigate = useNavigate();
  const [quizAttempt, setQuizAttempt] = useState(0);
  const [quizResult, setQuizResult] = useState(null);
  const [refazendoExercicio, setRefazendoExercicio] = useState(false);

  const { courseModule, lesson } = findLesson(moduleId, lessonId);
  const questionBank = questionBanksByLesson[lessonId];
  const watchedSecondsRef = useRef(0);

  const quizSession = useMemo(
    () => (questionBank ? buildQuizSession(questionBank, QUESTIONS_PER_LESSON_QUIZ) : []),
    [lessonId, quizAttempt]
  );

  const handleProgress = useCallback(
    (seconds) => {
      watchedSecondsRef.current = seconds;
      registrarProgressoVideo(moduleId, lessonId, seconds);
    },
    [moduleId, lessonId, registrarProgressoVideo]
  );

  const handleWatchedThreshold = useCallback(() => {
    concluirVideo(moduleId, lessonId, watchedSecondsRef.current);
  }, [moduleId, lessonId, concluirVideo]);

  if (!courseModule || !lesson) {
    return <Navigate to="/grade" replace />;
  }

  const theme = moduleTheme[moduleId];
  const lessonState = state.modules[moduleId].lessons[lessonId];
  const lessonNumber = courseModule.lessons.findIndex((item) => item.id === lessonId) + 1;

  const emRevisao = isLessonApproved(state, moduleId, lessonId);
  const mostrarExercicio = !quizResult && (emRevisao ? refazendoExercicio : lessonState.completed);

  function handleQuizSubmit(answers) {
    setQuizResult(enviarQuizAula(moduleId, lessonId, quizSession, answers));
  }

  function handleRetry() {
    setQuizResult(null);
    setQuizAttempt((value) => value + 1);
  }

  function refazerExercicio() {
    setQuizResult(null);
    setQuizAttempt((value) => value + 1);
    setRefazendoExercicio(true);
  }

  function goToNext() {
    const next = getNextStepInModule(state, moduleId);
    if (next.type === "lesson") {
      navigate(`/modulo/${moduleId}/aula/${next.lessonId}`);
    } else {
      navigate(`/modulo/${moduleId}`);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <Link
        to={`/modulo/${moduleId}`}
        className="font-mono text-xs uppercase tracking-widest text-muted hover:text-ink"
      >
        ← {courseModule.titulo}
      </Link>

      <header className="mb-6 mt-4">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-9 w-9 items-center justify-center font-mono text-sm font-medium text-white ${theme.fill}`}
          >
            {lessonNumber}
          </span>
          <p className="font-mono text-xs text-muted">
            Aula {lessonNumber} de {courseModule.lessons.length}
          </p>
        </div>
        <h1 className="mt-3 font-display text-3xl font-black tracking-tight text-ink">
          {lesson.titulo}
        </h1>
      </header>

      {lesson.videoId ? (
        <VideoPlayer
          youtubeId={lesson.videoId}
          initialSeconds={lessonState.watchedSeconds}
          onProgress={handleProgress}
          onWatchedThreshold={handleWatchedThreshold}
        />
      ) : (
        <p className="border border-dashed border-line px-5 py-10 text-center text-sm text-muted">
          O vídeo desta aula ainda não está disponível. Volte em breve.
        </p>
      )}

      <section className="mt-10">
        {emRevisao && !mostrarExercicio && !quizResult && (
          <div className="border-l-4 border-success bg-surface px-5 py-4">
            <p className="font-display text-lg font-bold text-success">Aula concluída</p>
            <p className="mt-1 text-sm text-muted">
              Você já passou nesta aula. Reveja o vídeo quantas vezes quiser — o exercício só se
              você quiser treinar de novo.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={refazerExercicio}
                className="min-h-11 rounded border border-line bg-canvas px-5 py-2.5 font-display font-bold text-ink transition-colors hover:border-ink"
              >
                Refazer o exercício
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="min-h-11 rounded bg-ink px-5 py-2.5 font-display font-bold text-white transition-colors hover:bg-ink/85"
              >
                Continuar de onde parei
              </button>
            </div>
          </div>
        )}

        {!emRevisao && lesson.videoId && !lessonState.completed && (
          <p className="border-l-4 border-line bg-surface px-5 py-4 text-sm text-muted">
            Assista o vídeo até o final para liberar o exercício desta aula.
          </p>
        )}

        {mostrarExercicio && (
          <>
            <h2 className="mb-4 font-display text-xl font-bold tracking-tight text-ink">
              {emRevisao ? "Exercício — só para treinar" : "Exercício da aula"}
            </h2>
            <Quiz key={quizAttempt} session={quizSession} onSubmit={handleQuizSubmit} />
          </>
        )}

        {quizResult && (
          <div
            className={`border p-6 ${quizResult.passed ? "border-success" : "border-alert"} bg-surface`}
          >
            <p
              className={`font-display text-2xl font-black tracking-tight ${
                quizResult.passed ? "text-success" : "text-alert"
              }`}
            >
              {quizResult.passed ? "Aula concluída" : "Quase lá"}
            </p>
            <p className="mt-1 font-mono text-sm text-muted">
              {quizResult.correctCount} de {quizResult.total} corretas ·{" "}
              {Math.round(quizResult.score * 100)}%
            </p>
            <div className="mt-5">
              {quizResult.passed ? (
                <button
                  type="button"
                  onClick={goToNext}
                  className="min-h-11 rounded bg-ink px-6 py-3 font-display font-bold text-white transition-colors hover:bg-ink/85"
                >
                  Continuar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRetry}
                  className="min-h-11 rounded bg-ink px-6 py-3 font-display font-bold text-white transition-colors hover:bg-ink/85"
                >
                  Tentar novamente
                </button>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
