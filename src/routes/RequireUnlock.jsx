import { Navigate, useParams } from "react-router-dom";
import { useCourseState } from "../state/useCourseState.js";

export function RequireUnlock({ check, redirectTo, children }) {
  const { state } = useCourseState();
  const params = useParams();
  if (!check(state, params)) {
    return <Navigate to={typeof redirectTo === "function" ? redirectTo(params) : redirectTo} replace />;
  }
  return children;
}
