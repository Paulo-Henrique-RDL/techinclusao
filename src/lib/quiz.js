function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function buildQuizSession(questionBank, count) {
  const chosen = shuffle(questionBank).slice(0, Math.min(count, questionBank.length));
  return chosen.map((question) => ({
    id: question.id,
    enunciado: question.enunciado,
    correta: question.correta,
    alternativas: shuffle(question.alternativas),
  }));
}

export function scoreQuizSession(session, answers) {
  const details = session.map((question) => {
    const chosenId = answers[question.id];
    const correct = chosenId === question.correta;
    return { questionId: question.id, chosenId, correct };
  });
  const correctCount = details.filter((item) => item.correct).length;
  const score = session.length === 0 ? 0 : correctCount / session.length;
  return { score, correctCount, total: session.length, details };
}
