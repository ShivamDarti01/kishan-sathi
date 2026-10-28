import { useEffect, useState } from "react";
import { AlertTriangle, ArrowLeft, Download, Leaf, ShieldCheck, Sprout } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../services/api.js";

export function Result() {
  const { id } = useParams();
  const location = useLocation();
  const { t } = useTranslation();
  const { token } = useApp();
  const [scan, setScan] = useState(location.state?.result || null);
  const [image, setImage] = useState(location.state?.preview || "");
  const [diseaseInfo, setDiseaseInfo] = useState(null);
  const [guidanceError, setGuidanceError] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    if (!scan && token) api.scan(token, id).then(setScan).catch((cause) => setError(cause.message));
  }, [id, scan, token]);
  useEffect(() => {
    if (!scan) return;
    api.diseases().then(({ items }) => {
      const prediction = `${scan.crop} ${scan.prediction?.label || ""}`.toLowerCase().replace(/[^a-z0-9]+/g, " ");
      const match = items.find((item) => {
        const words = item.name.toLowerCase().split(/\s+/).filter((word) => word !== item.crop);
        return item.crop === scan.crop && words.length > 0 && words.every((word) => prediction.includes(word));
      });
      setDiseaseInfo(match || null);
    }).catch((cause) => setGuidanceError(`Additional crop guidance could not be loaded: ${cause.message}`));
  }, [scan]);

  function printReport() { window.print(); }
  if (error) return <div className="subpage"><Link to="/history" className="back-link"><ArrowLeft size={16} /> {t("history")}</Link><div className="inline-error">{error}</div></div>;
  if (!scan) return <div className="subpage"><div className="loading-row">{t("loading")}</div></div>;
  const prediction = scan.prediction || {};
  const alternatives = scan.alternatives || [];

  return <div className="subpage result-page"><div className="result-actions"><Link to="/history" className="back-link"><ArrowLeft size={16} /> {t("history")}</Link><button className="button button-outline print-button" onClick={printReport}><Download size={15} /> Download / print</button></div>
    <div className="result-heading"><div className="eyebrow"><span className="eyebrow-dot" /> AI ANALYSIS</div><h1>{t("result")}</h1><p>{scan.crop || "Crop not specified"} · {new Date(scan.created_at).toLocaleString()}</p></div>
    <div className="result-grid"><div className="panel result-image-panel">{image ? <img src={image} alt="Analyzed crop leaf" /> : <div className="result-placeholder"><Leaf size={45} /></div>}<div className="result-image-caption"><span><Leaf size={15} /> {scan.crop || "Crop not specified"}</span><span>{scan.model_version}</span></div></div>
      <div className="panel diagnosis-panel"><span className={`diagnosis-badge ${/healthy/i.test(prediction.label || "") ? "healthy-badge" : ""}`}><ShieldCheck size={15} /> {scan.uncertain ? "Needs review" : "AI prediction"}</span><h2>{prediction.label}</h2><div className="confidence-line"><span>{t("confidence")}</span><strong>{Math.round((prediction.confidence || 0) * 100)}%</strong></div><div className="confidence-track"><span style={{ width: `${Math.min(100, Math.round((prediction.confidence || 0) * 100))}%` }} /></div>
        {scan.uncertain && <div className="uncertainty-banner"><AlertTriangle size={17} /><span>{t("uncertain")}</span></div>}
        <p className="diagnosis-disclaimer">{t("notDiagnosis")}</p>
        {alternatives.length > 0 && <div className="alternatives"><h3>{t("alternatives")}</h3>{alternatives.slice(0, 3).map((item) => <div className="alternative-row" key={item.label}><span>{item.label}</span><strong>{Math.round(item.confidence * 100)}%</strong></div>)}</div>}
      </div>
    </div>
    <div className="result-note"><div className="tip-icon"><Sprout size={18} /></div><div><strong>What to do next</strong><p>Compare the result with visible symptoms and local conditions. If the photo is unclear or the result seems uncertain, take another photo or consult a local agricultural expert. Follow local regulations and product labels for any crop treatment.</p></div></div>
    {guidanceError && <div className="inline-error" role="status">{guidanceError}</div>}
    {diseaseInfo && <section className="panel result-guidance"><div className="panel-heading"><div><h3>General information: {diseaseInfo.name}</h3><p>Educational context only; not a confirmed diagnosis or treatment recommendation.</p></div></div><div className="guidance-grid"><div><strong>{t("symptoms")}</strong><p>{diseaseInfo.symptoms}</p></div><div><strong>{t("causes")}</strong><p>{diseaseInfo.causes}</p></div><div><strong>{t("care")}</strong><p>{diseaseInfo.care}</p></div></div></section>}
    <div className="result-footer"><span>Model version: {scan.model_version}</span><Link to="/scanner" className="button button-primary"><Leaf size={16} /> Analyze another leaf</Link></div>
  </div>;
}
