import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../services/api.js";
import { ScanTable } from "../components/ScanTable.jsx";

export function History() {
  const { t } = useTranslation();
  const { token } = useApp();
  const [scans, setScans] = useState([]);
  const [query, setQuery] = useState("");
  const [crop, setCrop] = useState("all");
  const [period, setPeriod] = useState("all");
  const [status, setStatus] = useState({ loading: Boolean(token), error: "" });
  useEffect(() => {
    if (!token) { setScans([]); setStatus({ loading: false, error: "" }); return; }
    api.scans(token).then((data) => { setScans(data.items); setStatus({ loading: false, error: "" }); })
      .catch((cause) => setStatus({ loading: false, error: cause.message }));
  }, [token]);
  const filtered = useMemo(() => scans.filter((item) => {
    const matchesText = `${item.prediction?.label || ""} ${item.crop || ""}`.toLowerCase().includes(query.toLowerCase());
    const afterDate = period === "all" || new Date(item.created_at) >= new Date(Date.now() - Number(period) * 24 * 60 * 60 * 1000);
    return matchesText && afterDate && (crop === "all" || item.crop === crop);
  }), [scans, query, crop, period]);

  async function deleteScan(scan) {
    if (!window.confirm(`Delete scan #${scan.id}? This cannot be undone.`)) return;
    try {
      await api.deleteScan(token, scan.id);
      setScans((current) => current.filter((item) => item.id !== scan.id));
    } catch (cause) {
      setStatus((current) => ({ ...current, error: cause.message }));
    }
  }

  return <div className="subpage"><div className="page-intro"><div className="eyebrow"><span className="eyebrow-dot" /> YOUR RECORDS</div><h1>{t("history")}</h1><p>Keep track of crop health checks saved to your account.</p></div>
    <section className="panel history-panel"><div className="history-toolbar"><label className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search crops or results…" /></label><label className="filter-field"><SlidersHorizontal size={15} /><select value={crop} onChange={(event) => setCrop(event.target.value)}><option value="all">{t("allCrops")}</option>{["tomato", "potato", "corn", "rice", "wheat", "apple"].map((item) => <option value={item} key={item}>{t(item)}</option>)}</select></label><label className="filter-field"><select value={period} onChange={(event) => setPeriod(event.target.value)} aria-label="Filter by date"><option value="all">Any date</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option></select></label></div>
      {status.error && <div className="inline-error" role="alert">{status.error}</div>}{status.loading ? <div className="loading-row">{t("loading")}</div> : <ScanTable scans={filtered} onDelete={deleteScan} />}
    </section>
  </div>;
}
