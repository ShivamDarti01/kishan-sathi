import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, BookOpen, ChevronDown, CircleHelp, LayoutDashboard, Leaf, LogIn, LogOut, Menu, Moon, ScanLine, Sun, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext.jsx";

const links = [
  { to: "/", key: "dashboard", icon: LayoutDashboard },
  { to: "/scanner", key: "scanner", icon: ScanLine },
  { to: "/history", key: "history", icon: Activity },
  { to: "/library", key: "library", icon: BookOpen },
  { to: "/help", key: "help", icon: CircleHelp },
];

export function AppShell() {
  const { t } = useTranslation();
  const { theme, toggleTheme, language, changeLanguage, user, signOut } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function exit() {
    signOut();
    navigate("/");
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <NavLink to="/" className="brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark"><Leaf size={21} strokeWidth={2.2} /></span>
          <span><strong>{t("brand")}</strong><small>{t("tagline")}</small></span>
        </NavLink>
        <div className="nav-caption">FARM TOOLS</div>
        <nav className="side-nav">
          {links.map(({ to, key, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={() => setMenuOpen(false)}>
              <Icon size={18} /><span>{t(key)}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><span className="help-spark">✳</span><strong>Here for your farm</strong><p>Clear, cautious guidance for healthier crops.</p><NavLink to="/help">Get help <span>→</span></NavLink></div>
          <div className="profile-row"><div className="avatar">{user?.name?.slice(0, 1)?.toUpperCase() || "K"}</div><div className="profile-text"><strong>{user?.name || "Guest farmer"}</strong><small>{user ? "Farmer account" : "Sign in to save scans"}</small></div>
            {user ? <button className="icon-button" title={t("signOut")} onClick={exit}><LogOut size={17} /></button> : <button className="icon-button" title={t("signIn")} onClick={() => navigate("/login")}><LogIn size={17} /></button>}
          </div>
        </div>
      </aside>
      {menuOpen && <button className="mobile-backdrop" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
          <div className="breadcrumb"><span>Kishan-Sathi</span><span className="crumb-dot">/</span><span className="crumb-current">{t(links.find((item) => item.to === window.location.pathname)?.key || "dashboard")}</span></div>
          <div className="top-actions">
            <label className="language-picker"><span>{t("language")}</span><select value={language} onChange={(event) => changeLanguage(event.target.value)} aria-label={t("language")}><option value="en">EN</option><option value="hi">हिंदी</option><option value="pa">ਪੰਜਾਬੀ</option></select><ChevronDown size={13} /></label>
            <button className="icon-button theme-toggle" aria-label="Toggle dark mode" onClick={toggleTheme}>{theme === "light" ? <Moon size={18} /> : <Sun size={18} />}</button>
            <div className="top-avatar">{user?.name?.slice(0, 1)?.toUpperCase() || "K"}</div>
          </div>
        </header>
        <motion.div className="page-content" key={window.location.pathname} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
          <Outlet />
        </motion.div>
        <footer className="site-footer"><span>© {new Date().getFullYear()} Kishan-Sathi AI</span><span>सही पहचान, बेहतर फसल · <NavLink to="/about">{t("about")}</NavLink></span></footer>
      </main>
    </div>
  );
}
