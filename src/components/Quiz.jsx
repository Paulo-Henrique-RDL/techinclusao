import { useState } from "react";

export function Quiz({ session, onSubmit }) {
  const [answers, setAnswers] = useState({});
  const answeredCount = session.filter((question) => answers[question.id]).length;
  const allAnswered = answeredCount === session.length;

  function handleChange(questionId, alternativeId) {
    setAnswers((previous) => ({ ...previous, [questionId]: alternativeId }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!allAnswered) return;
    onSubmit(answers);
  }

  return (
    <form onSubmit={handleSubmit}>
      <ol className="border-t border-line">
        {session.map((question, index) => (
          <li key={question.id} className="border-b border-line bg-surface">
            <fieldset className="px-4 py-5 sm:px-6">
              <legend className="mb-4 flex gap-3">
                <span className="font-mono text-sm text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-base font-bold tracking-tight text-ink">
                  {question.enunciado}
                </span>
              </legend>
              <div className="flex flex-col gap-2 sm:pl-9">
                {question.alternativas.map((alternativa) => {
                  const selected = answers[question.id] === alternativa.id;
                  return (
                    <label
                      key={alternativa.id}
                      className={`flex min-h-11 cursor-pointer items-center gap-3 border px-4 py-3 text-sm transition-colors ${
                        selected
                          ? "border-ink bg-ink/5 text-ink"
                          : "border-line hover:border-muted"
                      }`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={alternativa.id}
                        checked={selected}
                        onChange={() => handleChange(question.id, alternativa.id)}
                        className="h-4 w-4 accent-ink"
                      />
                      {alternativa.texto}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={!allAnswered}
          className="min-h-11 rounded bg-ink px-7 py-3 font-display font-bold text-white transition-colors hover:bg-ink/85 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
        >
          Enviar respostas
        </button>
        <p className="font-mono text-sm text-muted">
          {answeredCount} de {session.length} respondidas
        </p>
      </div>
    </form>
  );
}
