import { COURSE } from "../data/course.js";

const KEY_PREFIX = "techinclusao_progress_v2:";
const STORAGE_VERSION = 2;

export function buildModuleState(courseModule) {
  const lessons = {};
  courseModule.lessons.forEach((lesson) => {
    lessons[lesson.id] = {
      watchedSeconds: 0,
      completed: false,
      quiz: { attempts: 0, bestScore: 0, passed: false },
    };
  });
  return { lessons, exam: { attempts: 0, bestScore: 0, passed: false } };
}

export function buildInitialProgress() {
  const modules = {};
  COURSE.modules.forEach((courseModule) => {
    modules[courseModule.id] = buildModuleState(courseModule);
  });
  return { lastModuleId: null, modules };
}

function keyFor(userId) {
  return `${KEY_PREFIX}${userId}`;
}

export async function loadProgress(userId) {
  const raw = window.localStorage.getItem(keyFor(userId));
  if (!raw) return buildInitialProgress();

  try {
    const parsed = JSON.parse(raw);
    if (parsed.version !== STORAGE_VERSION) {
      console.warn("techinclusao: versão de progresso incompatível, reiniciando estado.");
      return buildInitialProgress();
    }
    return parsed.data;
  } catch {
    return buildInitialProgress();
  }
}

export async function saveProgress(userId, progress) {
  window.localStorage.setItem(
    keyFor(userId),
    JSON.stringify({ version: STORAGE_VERSION, data: progress })
  );
}
