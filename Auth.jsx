import { useState } from "react";
import { ArrowRight, Leaf, LockKeyhole } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../services/api.js";

export function Auth({ register = false }) {
  const { t } = useTranslation();
  const { signIn } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const data = register ? await api.register(name, email, password) : await api.login(email, password);
      signIn(data.access_token, data.user);
      navigate("/");
    } catch (cause) { setError(cause.message || t("error")); }
    finally { setBusy(false); }
  }

  return <div className="auth-page"><section className="auth-card"><Link to="/" className="brand auth-brand"><span className="brand-mark"><Leaf size={21} /></span><span><strong>{t("brand")}</strong><small>{t("tagline")}</small></span></Link><div className="auth-heading"><div className="auth-lock"><LockKeyhole size={19} /></div><h1>{register ? t("registerTitle") : t("loginTitle")}</h1><p>Save your scan history and get a clearer picture of crop health.</p></div>
    <form onSubmit={submit} className="auth-form">{register && <label className="form-field"><span>{t("fullName")}</span><input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required maxLength={100} /></label>}<label className="form-field"><span>{t("email")}</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required maxLength={254} /></label><label className="form-field"><span>{t("password")}</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={register ? "new-password" : "current-password"} required minLength={8} /></label>{error && <div className="form-error" role="alert">{error}</div>}<button type="submit" className="button button-primary auth-submit" disabled={busy}>{busy ? t("loading") : register ? t("createAccount") : t("signIn")} <ArrowRight size={16} /></button></form>
    <p className="auth-switch">{register ? t("hasAccount") : t("noAccount")} <Link to={register ? "/login" : "/register"}>{register ? t("signIn") : t("createAccount")}</Link></p>
  </section><div className="auth-side"><div className="auth-orbit"><div className="orbit-leaf"><Leaf size={64} /></div><span className="orbit-dot dot-a" /><span className="orbit-dot dot-b" /><span className="orbit-dot dot-c" /></div><p>Healthy plants begin with<br /><strong>understanding.</strong></p><span>Smart farming, healthy crops.</span></div></div>;
}
