import { Link } from "react-router-dom";
import { COURSE } from "../data/course.js";
import { moduleTheme } from "../styles/moduleTheme.js";
import {
  countApprovedLessons,
  getModuleStatus,
  isLessonApproved,
  isLessonUnlocked,
  isModuleApproved,
  isModuleExamUnlocked,
} from "../lib/rules.js";

const statusLabel = {
  not_started: "Não começou",
  in_progress: "Em andamento",
  retake: "Tentativas esgotadas",
  completed: "Concluído",
};

function cellClasses(state, theme) {
  if (state === "done") return `${theme.fill} border-transparent text-white`;
  if (state === "open") return `border-2 bg-surface ${theme.border} ${theme.text}`;
  return "border bg-canvas border-line text-muted";
}

function Cell({ label, state, theme, title }) {
  return (
    <span
      title={title}
      className={`flex h-8 w-8 items-center justify-center border font-mono text-xs font-medium ${cellClasses(state, theme)}`}
    >
      {label}
    </span>
  );
}

function lessonCellState(state, moduleId, lessonId) {
  if (isLessonApproved(state, moduleId, lessonId)) return "done";
  if (isLessonUnlocked(state, moduleId, lessonId)) return "open";
  return "shut";
}

function examCellState(state, moduleId) {
  if (isModuleApproved(state, moduleId)) return "done";
  if (isModuleExamUnlocked(state, moduleId)) return "open";
  return "shut";
}

export function Grade({ state }) {
  return (
    <ol className="border-t border-line">
      {COURSE.modules.map((courseModule, index) => {
        const theme = moduleTheme[courseModule.id];
        const status = getModuleStatus(state, courseModule.id);
        const approved = countApprovedLessons(state, courseModule.id);

        return (
          <li key={courseModule.id} className="border-b border-line">
            <Link
              to={`/modulo/${courseModule.id}`}
              className="flex flex-col gap-4 bg-surface px-4 py-5 transition-colors hover:bg-canvas sm:flex-row sm:items-center sm:gap-6 sm:px-6"
            >
              <span
                aria-hidden="true"
                className={`hidden w-1.5 self-stretch sm:block ${theme.fill}`}
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-3">
                  <span className={`font-mono text-xs ${theme.text}`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className={`font-display text-xl font-bold tracking-tight ${theme.text}`}>
                    {courseModule.titulo}
                  </h2>
                </div>
                <p className="mt-1 text-sm text-muted">{courseModule.resumo}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {courseModule.lessons.map((lesson, lessonIndex) => (
                    <Cell
                      key={lesson.id}
                      label={lessonIndex + 1}
                      state={lessonCellState(state, courseModule.id, lesson.id)}
                      theme={theme}
                      title={`Aula ${lessonIndex + 1}: ${lesson.titulo}`}
                    />
                  ))}
                </div>
                <span aria-hidden="true" className="h-8 w-px bg-line" />
                <Cell
                  label="P"
                  state={examCellState(state, courseModule.id)}
                  theme={theme}
                  title="Prova do curso"
                />
              </div>

              <div className="sm:w-40 sm:text-right">
                <p className="font-mono text-xs text-muted">
                  {approved} de {courseModule.lessons.length} aulas
                </p>
                <p
                  className={`text-sm font-medium ${
                    status === "completed"
                      ? "text-success"
                      : status === "retake"
                        ? "text-alert"
                        : "text-ink"
                  }`}
                >
                  {statusLabel[status]}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
