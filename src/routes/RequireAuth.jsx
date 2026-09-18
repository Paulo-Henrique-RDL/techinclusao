import { Navigate } from "react-router-dom";
import { useAuth } from "../state/useAuth.js";
import { useCourseState } from "../state/useCourseState.js";
import { Aviso } from "../components/Aviso.jsx";

export function RequireAuth({ children }) {
  const { status: authStatus } = useAuth();
  const { status: progressStatus, error } = useCourseState();

  if (authStatus === "checking") {
    return <Aviso titulo="Carregando…" />;
  }
  if (authStatus === "signed_out") {
    return <Navigate to="/entrar" replace />;
  }
  if (progressStatus === "loading") {
    return <Aviso titulo="Carregando seu progresso…" />;
  }
  if (progressStatus === "error") {
    return <Aviso titulo="Não foi possível carregar seu progresso" descricao={error} />;
  }
  return children;
}
