import { useEffect, useState } from "react";
import { BookOpen, Leaf, ShieldAlert, Sprout } from "lucide-react";
import { api } from "../services/api.js";

export function Library() {
  const [diseases, setDiseases] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => { api.diseases().then((data) => setDiseases(data.items)).catch((cause) => setError(cause.message)); }, []);
  return <div className="subpage"><div className="page-intro"><div className="eyebrow"><span className="eyebrow-dot" /> LEARN & GROW</div><h1>Plant health guide</h1><p>General crop-health information. Always confirm disease concerns with a local expert.</p></div>
    {error && <div className="inline-error">{error}</div>}
    <div className="library-grid">{diseases.map((disease) => <article className="panel disease-card" key={disease.slug}><div className="disease-icon"><BookOpen size={19} /></div><span className="disease-crop">{disease.crop}</span><h3>{disease.name}</h3><p>{disease.summary}</p><div className="disease-detail"><div><Leaf size={14} /><span><strong>Look for</strong>{disease.symptoms}</span></div><div><ShieldAlert size={14} /><span><strong>May be associated with</strong>{disease.causes}</span></div><div><Sprout size={14} /><span><strong>General care</strong>{disease.care}</span></div></div><p className="source-note">General educational guidance · Not a treatment prescription</p></article>)}</div>
  </div>;
}
