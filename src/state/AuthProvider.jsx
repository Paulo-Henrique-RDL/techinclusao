import { createContext, useCallback, useEffect, useState } from "react";
import { auth } from "../services/index.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let cancelled = false;

    auth
      .getCurrentUser()
      .then((current) => {
        if (cancelled) return;
        setUser(current);
        setStatus(current ? "signed_in" : "signed_out");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("signed_out");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const cadastrar = useCallback(async (dados) => {
    const result = await auth.signUp(dados);
    if (result.user) {
      setUser(result.user);
      setStatus("signed_in");
    }
    return result;
  }, []);

  const entrar = useCallback(async (dados) => {
    const result = await auth.signIn(dados);
    if (result.user) {
      setUser(result.user);
      setStatus("signed_in");
    }
    return result;
  }, []);

  const sair = useCallback(async () => {
    await auth.signOut();
    setUser(null);
    setStatus("signed_out");
  }, []);

  return (
    <AuthContext.Provider value={{ user, status, cadastrar, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}
