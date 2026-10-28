import { createContext, useContext, useEffect, useMemo, useState } from "react";
import i18n from "../i18n/index.js";

const AppContext = createContext(null);

function initialTheme() {
  const saved = localStorage.getItem("ks-theme");
  if (saved) return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme);
  const [language, setLanguage] = useState(i18n.language);
  const [token, setToken] = useState(() => localStorage.getItem("ks-token"));
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ks-user")); } catch { return null; }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("ks-theme", theme);
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    toggleTheme: () => setTheme((current) => current === "light" ? "dark" : "light"),
    language,
    changeLanguage: (next) => {
      setLanguage(next);
      i18n.changeLanguage(next);
      localStorage.setItem("ks-language", next);
    },
    token,
    user,
    signIn: (nextToken, nextUser) => {
      localStorage.setItem("ks-token", nextToken);
      localStorage.setItem("ks-user", JSON.stringify(nextUser));
      setToken(nextToken);
      setUser(nextUser);
    },
    signOut: () => {
      localStorage.removeItem("ks-token");
      localStorage.removeItem("ks-user");
      setToken(null);
      setUser(null);
    },
  }), [theme, language, token, user]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
