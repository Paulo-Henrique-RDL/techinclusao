import { createContext, useEffect, useReducer } from "react";
import { COURSE } from "../data/course.js";
import { progress as progressPort } from "../services/index.js";
import { buildModuleState } from "../services/localProgress.js";
import { useAuth } from "./useAuth.js";

export const CourseContext = createContext(null);

const INITIAL = { status: "loading", error: null, progress: null };

function reducer(state, action) {
  switch (action.type) {
    case "RESET_TO_LOADING":
      return INITIAL;

    case "HYDRATE":
      return { status: "ready", error: null, progress: action.progress };

    case "LOAD_FAILED":
      return { status: "error", error: action.error, progress: null };

    case "UPDATE_LESSON_PROGRESS": {
      const { moduleId, lessonId, watchedSeconds, completed } = action;
      const previousLesson = state.progress.modules[moduleId].lessons[lessonId];
      return withModules(state, {
        lastModuleId: moduleId,
        modules: {
          ...state.progress.modules,
          [moduleId]: {
            ...state.progress.modules[moduleId],
            lessons: {
              ...state.progress.modules[moduleId].lessons,
              [lessonId]: {
                ...previousLesson,
                watchedSeconds,
                completed: previousLesson.completed || completed,
              },
            },
          },
        },
      });
    }

    case "RECORD_QUIZ_RESULT": {
      const { moduleId, lessonId, score, passed } = action;
      const previousQuiz = state.progress.modules[moduleId].lessons[lessonId].quiz;
      return withModules(state, {
        modules: {
          ...state.progress.modules,
          [moduleId]: {
            ...state.progress.modules[moduleId],
            lessons: {
              ...state.progress.modules[moduleId].lessons,
              [lessonId]: {
                ...state.progress.modules[moduleId].lessons[lessonId],
                quiz: {
                  attempts: previousQuiz.attempts + 1,
                  bestScore: Math.max(previousQuiz.bestScore, score),
                  passed: previousQuiz.passed || passed,
                },
              },
            },
          },
        },
      });
    }

    case "RECORD_MODULE_EXAM_RESULT": {
      const { moduleId, score, passed } = action;
      const previousExam = state.progress.modules[moduleId].exam;
      return withModules(state, {
        modules: {
          ...state.progress.modules,
          [moduleId]: {
            ...state.progress.modules[moduleId],
            exam: {
              attempts: previousExam.attempts + 1,
              bestScore: Math.max(previousExam.bestScore, score),
              passed: previousExam.passed || passed,
            },
          },
        },
      });
    }

    case "RESET_MODULE": {
      const courseModule = COURSE.modules.find((item) => item.id === action.moduleId);
      return withModules(state, {
        modules: {
          ...state.progress.modules,
          [action.moduleId]: buildModuleState(courseModule),
        },
      });
    }

    default:
      return state;
  }
}

function withModules(state, patch) {
  return { ...state, progress: { ...state.progress, ...patch } };
}

export function CourseProvider({ children }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const userId = user?.id ?? null;

  useEffect(() => {

    dispatch({ type: "RESET_TO_LOADING" });
    if (!userId) return undefined;

    let cancelled = false;
    progressPort
      .loadProgress(userId)
      .then((loaded) => {
        if (!cancelled) dispatch({ type: "HYDRATE", progress: loaded });
      })
      .catch(() => {
        if (!cancelled) {
          dispatch({ type: "LOAD_FAILED", error: "Não foi possível carregar seu progresso." });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    if (!userId || state.status !== "ready") return;
    progressPort.saveProgress(userId, state.progress).catch(() => {
      console.warn("techinclusao: não foi possível salvar o progresso.");
    });
  }, [userId, state.status, state.progress]);

  return <CourseContext.Provider value={{ state, dispatch }}>{children}</CourseContext.Provider>;
}
