import { AlertTriangle, Sprout } from "lucide-react";
import { useTranslation } from "react-i18next";

export function ModelNotice({ compact = false }) {
  const { t } = useTranslation();
  return (
    <div className={`model-notice ${compact ? "compact" : ""}`} role="status">
      <span className="notice-icon"><AlertTriangle size={18} /></span>
      <div><strong>{t("modelMissing")}</strong><p>{t("modelHelp")}</p>{!compact && <div className="notice-foot"><Sprout size={14} /> No demo predictions. Your results will be real when a model is installed.</div>}</div>
    </div>
  );
}
