import { ArrowUpRight, CircleCheck, Leaf, Trash2, TriangleAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function ScanTable({ scans, onDelete }) {
  const { t } = useTranslation();
  if (!scans?.length) return <div className="empty-state"><div className="empty-icon"><Leaf size={22} /></div><strong>{t("noScans")}</strong><p>{t("empty")}</p><Link className="text-link" to="/scanner">{t("scanLeaf")} →</Link></div>;
  return <div className="scan-list">
    {scans.map((scan) => {
      const healthy = /healthy/i.test(scan.prediction?.label || "");
      return <div className="scan-row" key={scan.id}>
        <Link to={`/result/${scan.id}`} className="scan-row-main">
          <div className={`scan-crop-icon ${healthy ? "healthy-icon" : ""}`}>{healthy ? <CircleCheck size={18} /> : <TriangleAlert size={18} />}</div>
          <div className="scan-info"><strong>{scan.prediction?.label || "Analysis result"}</strong><span>{scan.crop || "Crop not specified"} · {new Date(scan.created_at).toLocaleDateString()}</span></div>
          <span className="scan-confidence">{Math.round((scan.prediction?.confidence || 0) * 100)}%</span>
          <ArrowUpRight size={16} className="scan-arrow" />
        </Link>
        {onDelete && <button type="button" className="delete-scan" aria-label={`Delete scan ${scan.id}`} title="Delete scan" onClick={() => onDelete(scan)}><Trash2 size={15} /></button>}
      </div>;
    })}
  </div>;
}
