import { ChevronDown, CircleHelp, Mail, MessageCircle } from "lucide-react";

const faqs = [
  ["How do I take a useful leaf photo?", "Use daylight, focus on one leaf, and fill most of the frame. Avoid blur, strong shadows, and wet leaves."],
  ["Can the AI confirm a disease?", "No. A model output is an estimate, not a confirmed diagnosis. Results can be uncertain, especially for field photos; ask a local agricultural expert."],
  ["Why does analysis say the model is not configured?", "The application needs a compatible trained Keras model and a matching output-label file. See the README for setup steps. The app does not show made-up results."],
  ["Are pesticide recommendations provided?", "No pesticide dosage or disease-specific chemical treatment is prescribed. Always consult a qualified local expert and follow local regulations and product labels."],
];

export function Help() {
  return <div className="subpage"><div className="page-intro"><div className="eyebrow"><span className="eyebrow-dot" /> WE'RE HERE TO HELP</div><h1>Help & support</h1><p>Quick answers to common questions from farmers.</p></div>
    <div className="help-layout"><section className="panel faq-panel"><div className="panel-heading"><div><h3>Frequently asked questions</h3><p>Helpful answers to get you started</p></div><CircleHelp size={20} className="muted-icon" /></div>{faqs.map(([question, answer]) => <details className="faq-item" key={question}><summary>{question}<ChevronDown size={17} /></summary><p>{answer}</p></details>)}</section>
      <aside className="panel support-card"><div className="support-icon"><MessageCircle size={21} /></div><h3>Talk to a local expert</h3><p>For suspected crop disease, a local agricultural extension officer or agronomist can inspect your crop and recommend appropriate next steps.</p><a className="support-link" href="https://farmer.gov.in/" target="_blank" rel="noreferrer"><Mail size={15} /> Find agricultural resources</a></aside></div>
  </div>;
}
