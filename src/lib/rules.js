import { COURSE } from "../data/course.js";
import { MAX_ATTEMPTS } from "./constants.js";

function findModule(moduleId) {
  return COURSE.modules.find((item) => item.id === moduleId);
}

export function isLessonApproved(state, moduleId, lessonId) {
  const lessonState = state.modules[moduleId]?.lessons[lessonId];
  return Boolean(lessonState?.completed && lessonState.quiz.passed);
}

export function isLessonUnlocked(state, moduleId, lessonId) {
  const courseModule = findModule(moduleId);
  if (!courseModule) return false;

  const index = courseModule.lessons.findIndex((lesson) => lesson.id === lessonId);
  if (index < 0) return false;
  if (index === 0) return true;

  const previous = courseModule.lessons[index - 1];
  return isLessonApproved(state, moduleId, previous.id);
}

export function isModuleExamUnlocked(state, moduleId) {
  const courseModule = findModule(moduleId);
  if (!courseModule) return false;
  return courseModule.lessons.every((lesson) => isLessonApproved(state, moduleId, lesson.id));
}

export function isModuleApproved(state, moduleId) {
  return Boolean(state.modules[moduleId]?.exam.passed);
}

export function isModuleInRetake(state, moduleId) {
  const exam = state.modules[moduleId]?.exam;
  return Boolean(exam && !exam.passed && exam.attempts >= MAX_ATTEMPTS);
}

export function getModuleStatus(state, moduleId) {
  if (isModuleApproved(state, moduleId)) return "completed";
  if (isModuleInRetake(state, moduleId)) return "retake";

  const courseModule = findModule(moduleId);
  const started = courseModule.lessons.some((lesson) => {
    const lessonState = state.modules[moduleId].lessons[lesson.id];
    return lessonState.watchedSeconds > 0 || lessonState.quiz.attempts > 0;
  });
  return started ? "in_progress" : "not_started";
}

export function countApprovedLessons(state, moduleId) {
  return findModule(moduleId).lessons.filter((lesson) =>
    isLessonApproved(state, moduleId, lesson.id)
  ).length;
}

export function remainingExamAttempts(attempts) {
  return Math.max(0, MAX_ATTEMPTS - attempts);
}

export function isCourseComplete(state) {
  return COURSE.modules.every((courseModule) => isModuleApproved(state, courseModule.id));
}

export function getNextStepInModule(state, moduleId) {
  const nextLesson = findModule(moduleId).lessons.find(
    (lesson) => !isLessonApproved(state, moduleId, lesson.id)
  );
  if (nextLesson) return { type: "lesson", lessonId: nextLesson.id };
  if (!isModuleApproved(state, moduleId)) return { type: "exam" };
  return { type: "done" };
}
