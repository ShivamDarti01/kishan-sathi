import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, CalendarDays, Leaf, ScanLine, ShieldCheck, Sprout, Sun } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../services/api.js";
import { ModelNotice } from "../components/ModelNotice.jsx";
import { ScanTable } from "../components/ScanTable.jsx";

export function Dashboard() {
  const { t } = useTranslation();
  const { token, user } = useApp();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) { setScans([]); setLoading(false); return; }
    let active = true;
    api.scans(token).then((data) => { if (active) setScans(data.items); })
      .catch((cause) => { if (active) setError(cause.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token]);

  const healthy = scans.filter((scan) => /healthy/i.test(scan.prediction?.label || "")).length;
  const diseaseDistribution = Object.entries(scans.reduce((counts, scan) => {
    const label = scan.prediction?.label || "Unknown";
    counts[label] = (counts[label] || 0) + 1;
    return counts;
  }, {})).map(([label, count]) => ({ label, count }));
  const cropDistribution = Object.entries(scans.reduce((counts, scan) => {
    counts[scan.crop] = (counts[scan.crop] || 0) + 1;
    return counts;
  }, {})).map(([crop, count]) => ({ crop, count }));
  const pieColors = ["#358457", "#8dbb75", "#d0a455", "#548b9c", "#b27a5c", "#8d7ca8"];
  const chartData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      return { key: date.toLocaleDateString("en", { weekday: "short" }), full: date.toDateString(), scans: 0 };
    });
    scans.forEach((scan) => {
      const date = new Date(scan.created_at).toDateString();
      const day = days.find((item) => item.full === date);
      if (day) day.scans += 1;
    });
    return days;
  }, [scans]);

  return <div className="dashboard-page">
    <div className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-dot" /> FARM OVERVIEW</div><h1>{t("welcome")}{user?.name ? `, ${user.name.split(" ")[0]}` : ""} <span className="wave">✳</span></h1><p>{t("overview")} — let's keep your crops thriving.</p></div><div className="date-chip"><CalendarDays size={16} /> {new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</div></div>
    <section className="hero-card"><div className="hero-copy"><span className="hero-label"><Sprout size={14} /> YOUR FARM, HEALTHIER</span><h2>A little care goes<br />a long way.</h2><p>Check in on your crops. A clear leaf photo is the first step to understanding plant health.</p><Link to="/scanner" className="button button-light"><ScanLine size={17} /> {t("scanLeaf")} <ArrowUpRight size={16} /></Link></div><div className="hero-art" aria-hidden="true"><div className="sun-disc" /><div className="plant-stem" /><div className="plant-leaf leaf-one" /><div className="plant-leaf leaf-two" /><div className="plant-leaf leaf-three" /><div className="plant-leaf leaf-four" /><div className="plant-ground" /><span className="art-spark spark-one">✳</span><span className="art-spark spark-two">✦</span></div></section>
    <ModelNotice compact />
    {error && <div className="inline-error" role="alert">{error}</div>}
    <section className="stat-grid">
      <Stat icon={ScanLine} label={t("scans")} value={scans.length} tone="green" foot="Saved in your account" />
      <Stat icon={ShieldCheck} label={t("healthy")} value={healthy} tone="mint" foot={scans.length ? `${Math.round(healthy / scans.length * 100)}% of your scans` : "Based on your scans"} />
      <Stat icon={Leaf} label={t("watch")} value={scans.length - healthy} tone="amber" foot="Review with an expert" />
    </section>
    <section className="content-grid">
      <article className="panel trend-panel"><div className="panel-heading"><div><h3>{t("weekly")}</h3><p>Scan activity, based on your saved records</p></div><span className="chart-period"><Sun size={14} /> Last 7 days</span></div><div className="chart-wrap">{loading ? <div className="skeleton-chart" /> : <ResponsiveContainer width="100%" height="100%"><LineChart data={chartData} margin={{ top: 10, right: 12, bottom: 0, left: -18 }}><CartesianGrid stroke="var(--line)" strokeDasharray="4 5" vertical={false} /><XAxis dataKey="key" axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 11 }} dy={10} /><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 11 }} /><Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12, color: "var(--text)" }} /><Line type="monotone" dataKey="scans" stroke="var(--green)" strokeWidth={3} dot={{ r: 4, fill: "var(--green)", strokeWidth: 2, stroke: "var(--surface)" }} activeDot={{ r: 6 }} /></LineChart></ResponsiveContainer>}</div><div className="chart-legend"><span /> Your scans</div></article>
      <article className="panel tips-panel"><div className="panel-heading"><div><h3>Field notes</h3><p>Small habits, stronger crops</p></div><span className="tip-icon"><Sprout size={18} /></span></div><div className="tip-item"><span className="tip-number">01</span><div><strong>Check leaves regularly</strong><p>Look at both sides, especially after rain or humid days.</p></div></div><div className="tip-item"><span className="tip-number">02</span><div><strong>Take a clear photo</strong><p>Use daylight and focus on one leaf for a useful assessment.</p></div></div><div className="tip-item"><span className="tip-number">03</span><div><strong>Ask a local expert</strong><p>Confirm uncertain symptoms before deciding how to act.</p></div></div></article>
    </section>
    <section className="content-grid analytics-grid">
      <article className="panel trend-panel"><div className="panel-heading"><div><h3>Disease distribution</h3><p>Predicted labels from your saved scans</p></div></div>{!scans.length && !loading ? <div className="chart-empty">Saved scans will appear here. No sample data is shown.</div> : <><div className="distribution-chart"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={diseaseDistribution} dataKey="count" nameKey="label" innerRadius={45} outerRadius={72} paddingAngle={3}>{diseaseDistribution.map((entry, index) => <Cell key={entry.label} fill={pieColors[index % pieColors.length]} />)}</Pie><Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 10, color: "var(--text)" }} /></PieChart></ResponsiveContainer></div><div className="distribution-legend">{diseaseDistribution.slice(0, 4).map((item, index) => <span key={item.label}><i style={{ background: pieColors[index % pieColors.length] }} />{item.label} <b>{item.count}</b></span>)}</div></>}</article>
      <article className="panel trend-panel"><div className="panel-heading"><div><h3>Crop-wise analysis</h3><p>Images analyzed by crop type</p></div></div>{!scans.length && !loading ? <div className="chart-empty">Your crop breakdown will appear after your first saved scan.</div> : <div className="crop-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={cropDistribution} margin={{ top: 12, right: 8, bottom: 0, left: -20 }}><CartesianGrid stroke="var(--line)" strokeDasharray="4 5" vertical={false} /><XAxis dataKey="crop" axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 9 }} /><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 9 }} /><Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 10, color: "var(--text)" }} /><Bar dataKey="count" name="Scans" fill="var(--green)" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div>}</article>
    </section>
    <section className="panel recent-panel"><div className="panel-heading"><div><h3>{t("recent")}</h3><p>Your latest saved diagnosis records</p></div><Link to="/history" className="text-link">View all <ArrowUpRight size={15} /></Link></div>{loading ? <div className="loading-row">{t("loading")}</div> : <ScanTable scans={scans.slice(0, 4)} />}</section>
  </div>;
}

function Stat({ icon: Icon, label, value, tone, foot }) {
  return <article className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={19} /></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-foot">{foot}</div></article>;
}
