import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell.jsx";
import { useApp } from "./context/AppContext.jsx";
import { About } from "./pages/About.jsx";
import { Auth } from "./pages/Auth.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { Help } from "./pages/Help.jsx";
import { History } from "./pages/History.jsx";
import { Library } from "./pages/Library.jsx";
import { Result } from "./pages/Result.jsx";
import { Scanner } from "./pages/Scanner.jsx";

function Protected({ children }) {
  const { token } = useApp();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return <Routes><Route element={<AppShell />}><Route index element={<Dashboard />} /><Route path="scanner" element={<Scanner />} /><Route path="history" element={<Protected><History /></Protected>} /><Route path="result/:id" element={<Protected><Result /></Protected>} /><Route path="library" element={<Library />} /><Route path="help" element={<Help />} /><Route path="about" element={<About />} /><Route path="login" element={<Auth />} /><Route path="register" element={<Auth register />} /><Route path="*" element={<Navigate to="/" replace />} /></Route></Routes>;
}
