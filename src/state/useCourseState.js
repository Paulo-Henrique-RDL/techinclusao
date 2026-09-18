import { useContext } from "react";
import { CourseContext } from "./CourseProvider.jsx";
import { PASS_THRESHOLD } from "../lib/constants.js";
import { scoreQuizSession } from "../lib/quiz.js";

export function useCourseState() {
  const context = useContext(CourseContext);
  if (!context) throw new Error("useCourseState precisa estar dentro de <CourseProvider>");
  const { state, dispatch } = context;

  function registrarProgressoVideo(moduleId, lessonId, watchedSeconds) {
    dispatch({
      type: "UPDATE_LESSON_PROGRESS",
      moduleId,
      lessonId,
      watchedSeconds,
      completed: false,
    });
  }

  function concluirVideo(moduleId, lessonId, watchedSeconds) {
    dispatch({
      type: "UPDATE_LESSON_PROGRESS",
      moduleId,
      lessonId,
      watchedSeconds,
      completed: true,
    });
  }

  function enviarQuizAula(moduleId, lessonId, session, answers) {
    const result = scoreQuizSession(session, answers);
    const passed = result.score >= PASS_THRESHOLD;
    dispatch({ type: "RECORD_QUIZ_RESULT", moduleId, lessonId, score: result.score, passed });
    return { ...result, passed };
  }

  function enviarProvaModulo(moduleId, session, answers) {
    const result = scoreQuizSession(session, answers);
    const passed = result.score >= PASS_THRESHOLD;
    dispatch({ type: "RECORD_MODULE_EXAM_RESULT", moduleId, score: result.score, passed });
    return { ...result, passed };
  }

  function refazerModulo(moduleId) {
    dispatch({ type: "RESET_MODULE", moduleId });
  }

  return {
    state: state.progress,
    status: state.status,
    error: state.error,
    registrarProgressoVideo,
    concluirVideo,
    enviarQuizAula,
    enviarProvaModulo,
    refazerModulo,
  };
}
