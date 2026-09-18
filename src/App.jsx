import { Link, Route, Routes } from "react-router-dom";
import Inicio from "./pages/Inicio.jsx";
import Entrar from "./pages/Entrar.jsx";
import Home from "./pages/Home.jsx";
import Module from "./pages/Module.jsx";
import Lesson from "./pages/Lesson.jsx";
import ModuleExam from "./pages/ModuleExam.jsx";
import Result from "./pages/Result.jsx";
import NaoEncontrada from "./pages/NaoEncontrada.jsx";
import { GraoDoPapel } from "./components/GraoDoPapel.jsx";
import { RequireAuth } from "./routes/RequireAuth.jsx";
import { RequireUnlock } from "./routes/RequireUnlock.jsx";
import { useAuth } from "./state/useAuth.js";
import { isCourseComplete, isLessonUnlocked, isModuleExamUnlocked } from "./lib/rules.js";

function Protegida({ check, redirectTo, children }) {
  return (
    <RequireAuth>
      <RequireUnlock check={check} redirectTo={redirectTo}>
        {children}
      </RequireUnlock>
    </RequireAuth>
  );
}

function Cabecalho() {
  const { user, status, sair } = useAuth();

  return (
    <header className="relative bg-ink">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4">
        <Link
          to={user ? "/grade" : "/"}
          className="font-display text-lg font-black tracking-tight text-white"
        >
          TechInclusão
        </Link>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 sm:inline">
          Capacitação digital
        </span>

        {user ? (
          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-sm text-white/70 sm:inline">{user.nome}</span>
            <button
              type="button"
              onClick={sair}
              className="font-mono text-xs uppercase tracking-widest text-white/70 transition-colors hover:text-white"
            >
              Sair
            </button>
          </div>
        ) : (
          status === "signed_out" && (
            <div className="ml-auto flex items-center gap-2">
              <Link
                to="/entrar"
                className="px-3 py-2 font-display text-sm font-bold text-white/80 transition-colors hover:text-white"
              >
                Entrar
              </Link>
              <Link
                to="/criar-conta"
                className="min-h-10 rounded bg-white px-4 py-2 font-display text-sm font-bold text-ink transition-opacity hover:opacity-90"
              >
                Criar conta
              </Link>
            </div>
          )
        )}
      </div>
    </header>
  );
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <GraoDoPapel />

      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Pular para o conteúdo principal
      </a>

      <Cabecalho />

      <main id="conteudo-principal" className="relative flex-1">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/entrar" element={<Entrar />} />
          <Route path="/criar-conta" element={<Entrar />} />
          <Route
            path="/grade"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/modulo/:moduleId"
            element={
              <RequireAuth>
                <Module />
              </RequireAuth>
            }
          />
          <Route
            path="/modulo/:moduleId/aula/:lessonId"
            element={
              <Protegida
                check={(state, { moduleId, lessonId }) => isLessonUnlocked(state, moduleId, lessonId)}
                redirectTo={({ moduleId }) => `/modulo/${moduleId}`}
              >
                <Lesson />
              </Protegida>
            }
          />
          <Route
            path="/modulo/:moduleId/prova"
            element={
              <Protegida
                check={(state, { moduleId }) => isModuleExamUnlocked(state, moduleId)}
                redirectTo={({ moduleId }) => `/modulo/${moduleId}`}
              >
                <ModuleExam />
              </Protegida>
            }
          />
          <Route
            path="/conclusao"
            element={
              <Protegida check={isCourseComplete} redirectTo="/grade">
                <Result />
              </Protegida>
            }
          />
          <Route path="*" element={<NaoEncontrada />} />
        </Routes>
      </main>

      <footer className="relative border-t border-line py-6 text-center font-mono text-xs text-muted">
        Projeto de extensão TechInclusão — capacitação digital gratuita
      </footer>
    </div>
  );
}
