import { useEffect, useRef, useState } from "react";
import { AlertCircle, Check, ImagePlus, Leaf, RotateCcw, ScanLine, Upload, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../services/api.js";
import { ModelNotice } from "../components/ModelNotice.jsx";

const crops = ["tomato", "potato", "corn", "rice", "wheat", "apple"];
const allowed = ["image/jpeg", "image/png", "image/webp"];
const maxBytes = 10 * 1024 * 1024;

export function Scanner() {
  const { t } = useTranslation();
  const { token } = useApp();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [crop, setCrop] = useState("tomato");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!file) { setPreview(""); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function selectFile(selected) {
    setError("");
    setSuccess("");
    if (!selected) return;
    if (!allowed.includes(selected.type)) { setError("Choose a JPG, PNG, or WebP image."); return; }
    if (selected.size > maxBytes) { setError("Image must be 10 MB or smaller."); return; }
    setFile(selected);
  }

  async function submit(event) {
    event.preventDefault();
    if (!file) { setError("Choose a leaf image to continue."); return; }
    if (!token) { navigate("/login"); return; }
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      const result = await api.analyze(token, file, crop);
      navigate(`/result/${result.id}`, { state: { result, preview } });
    } catch (cause) {
      if (cause.status === 503) setError(cause.message);
      else if (cause.status === 401) { setError("Please sign in again to save your analysis."); }
      else setError(cause.message || t("error"));
    } finally { setBusy(false); }
  }

  return <div className="subpage">
    <div className="page-intro"><div className="eyebrow"><span className="eyebrow-dot" /> PLANT HEALTH</div><h1>{t("scanner")}</h1><p>Get a closer look at your crops with a clear, well-lit leaf photo.</p></div>
    <ModelNotice />
    <div className="scanner-layout">
      <form className="panel scanner-form" onSubmit={submit}>
        <div className="panel-heading"><div><h3>{t("uploadTitle")}</h3><p>{t("uploadHint")}</p></div><div className="scan-step">01 <span>/ 02</span></div></div>
        {!preview ? <button type="button" className="upload-zone" onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); selectFile(event.dataTransfer.files?.[0]); }}>
          <span className="upload-icon"><ImagePlus size={23} /></span><strong>{t("chooseImage")}</strong><span>or drag and drop it here</span><small>JPG · PNG · WEBP</small>
        </button> : <div className="preview-wrap"><img src={preview} alt="Selected leaf preview" /><div className="preview-overlay"><span><Check size={14} /> Image ready</span><button type="button" className="remove-image" onClick={() => { setFile(null); setError(""); }} aria-label="Remove selected image"><X size={17} /></button></div><button type="button" className="change-image" onClick={() => inputRef.current?.click()}><RotateCcw size={14} /> Change image</button></div>}
        <input ref={inputRef} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={(event) => selectFile(event.target.files?.[0])} />
        <label className="field-label" htmlFor="crop-select">{t("crop")} <span>Optional — helps narrow the analysis</span></label>
        <select id="crop-select" className="form-select" value={crop} onChange={(event) => setCrop(event.target.value)}>{crops.map((item) => <option value={item} key={item}>{t(item)}</option>)}</select>
        {error && <div className="form-error" role="alert"><AlertCircle size={16} />{error}</div>}
        {success && <div className="form-success" role="status">{success}</div>}
        <button className="button button-primary analyze-button" type="submit" disabled={busy}>{busy ? <><span className="spinner" />{t("analyzing")}</> : <><ScanLine size={17} />{t("analyze")}</>}</button>
        {!token && <p className="auth-hint"><Leaf size={14} /> Sign in is required to save scan results.</p>}
      </form>
      <aside className="scanner-aside">
        <div className="panel guide-panel"><div className="guide-icon"><Upload size={19} /></div><h3>For the clearest read</h3><ul><li>Choose a single leaf, filling most of the frame.</li><li>Use natural light and keep the camera steady.</li><li>Avoid strong shadows, blur, or wet leaves.</li></ul></div>
        <div className="privacy-note"><div className="privacy-icon"><Leaf size={17} /></div><p><strong>Your crop, your data.</strong> Results are saved privately to your account. AI predictions are guidance, not a confirmed diagnosis.</p></div>
      </aside>
    </div>
  </div>;
}
