import { Link } from "react-router-dom";
import { moduleTheme } from "../styles/moduleTheme.js";
import { isLessonApproved, isLessonUnlocked } from "../lib/rules.js";

function LockIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <rect x="4.5" y="9" width="11" height="8" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6.5 9V6.5a3.5 3.5 0 0 1 7 0V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M4 10.5 8 14.5 16 6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LessonList({ courseModule, state }) {
  const theme = moduleTheme[courseModule.id];

  return (
    <ol className="border-t border-line">
      {courseModule.lessons.map((lesson, index) => {
        const approved = isLessonApproved(state, courseModule.id, lesson.id);
        const unlocked = isLessonUnlocked(state, courseModule.id, lesson.id);

        const marker = (
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center border font-mono text-sm font-medium ${
              approved
                ? `${theme.fill} border-transparent text-white`
                : unlocked
                  ? `bg-surface ${theme.border} ${theme.text}`
                  : "bg-canvas border-line text-muted"
            }`}
          >
            {approved ? <CheckIcon /> : unlocked ? index + 1 : <LockIcon />}
          </span>
        );

        const body = (
          <>
            {marker}
            <span className="min-w-0 flex-1">
              <span className="block font-medium text-ink">{lesson.titulo}</span>
              <span className="mt-0.5 block text-xs text-muted">
                {approved ? "Concluída" : unlocked ? "Disponível" : "Conclua a aula anterior"}
              </span>
            </span>
          </>
        );

        return (
          <li key={lesson.id} className="border-b border-line">
            {unlocked ? (
              <Link
                to={`/modulo/${courseModule.id}/aula/${lesson.id}`}
                className="flex items-center gap-4 bg-surface px-4 py-3 transition-colors hover:bg-canvas"
              >
                {body}
              </Link>
            ) : (
              <div aria-disabled="true" className="flex items-center gap-4 bg-surface/60 px-4 py-3">
                {body}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
